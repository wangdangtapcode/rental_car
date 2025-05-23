// src/pages/Invoice.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

export const Invoice = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [contractDetails, setContractDetails] = useState(null);

  const [calculation, setCalculation] = useState({
    totalPenalties: 0,
    totalEstimatedAmount: 0,
    totalAmount: 0,
    depositAmount: 0,
    finalAmountDue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);
  const [error, setError] = useState(null);

  const currentUser = useSelector((state) => state.user.user);

  const calculateCosts = useCallback((contract) => {
    if (!contract) return;

    const deposit = contract.depositAmount || 0;
    const estimatedTotal = contract.totalEstimatedAmount || 0;

    // 1. Tính tổng phạt ĐÃ CÓ trong hợp đồng gốc
    let existingPenaltiesTotal = 0;
    if (
      contract.contractVehicleDetails &&
      Array.isArray(contract.contractVehicleDetails)
    ) {
      contract.contractVehicleDetails.forEach((detail) => {
        if (detail.penalties && Array.isArray(detail.penalties)) {
          detail.penalties.forEach((penalty) => {
            existingPenaltiesTotal += Number(penalty.penaltyAmount) || 0;
          });
        }
      });
    }

    // 3. Tính tổng tất cả các khoản phạt
    const totalPenalties = existingPenaltiesTotal;

    // 4. Tính tổng tiền mới = tiền thuê gốc + tổng tất cả phạt
    const newTotalAmount = estimatedTotal + totalPenalties;

    // 5. Tính số tiền cuối cùng = Tổng mới - tiền cọc
    const finalAmountDue = newTotalAmount - deposit;

    // 6. Cập nhật state calculation
    setCalculation({
      totalPenalties: totalPenalties,
      totalEstimatedAmount: estimatedTotal,
      totalAmount: newTotalAmount,
      depositAmount: deposit,
      finalAmountDue,
    });
  }, []); // Không cần dependency

  // --- Lấy dữ liệu từ State và Tính toán ---
  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const contractFromState = location.state?.contract;
    if (!contractFromState) {
      setError("Lỗi: Không nhận được dữ liệu hợp đồng từ trang trước.");
      setIsLoading(false);
      return;
    }
    // const penalties = contractFromState.contractVehicleDetails.flatMap(
    //   (detail) => detail.penalties || []
    // );

    if (!currentUser || !currentUser.id) {
      setError(
        "Lỗi: Không xác định được thông tin nhân viên xử lý. Vui lòng đăng nhập lại."
      );
      setIsLoading(false);
      return;
    }

    console.log("Contract received from state:", contractFromState);

    setContractDetails(contractFromState);

    calculateCosts(contractFromState);

    setIsLoading(false);
  }, [location.state, calculateCosts, currentUser]);

  // --- Hàm Tạo Hóa đơn (Sử dụng totalPenalties tổng hợp) ---
  const handleCreateInvoice = useCallback(async () => {
    if (!contractDetails || !currentUser || !currentUser.id) {
      setError("Thiếu thông tin Hợp đồng hoặc Nhân viên.");
      return;
    }

    setIsCreatingInvoice(true);
    setError(null);

    const paymentDate = new Date().toISOString().slice(0, 10);

    const invoicePayload = {
      paymentDate: paymentDate,
      penaltyAmount: calculation.totalPenalties,
      dueAmount: calculation.finalAmountDue,
      totalAmount: calculation.totalAmount,
      rentalContract: contractDetails,
      employee: currentUser,
    };

    console.log("Payload gửi đi để tạo InvoiceDetail:", invoicePayload);

    try {
      const response = await axios.post(
        "http://localhost:8081/api/invoice/create",
        invoicePayload
      );
      console.log(response.data);
      if (response.data === true) {
        alert("Thêm hoá đơn thành công!");
        navigate("/completedRental");
      } else {
        alert("Thêm hoá đơn thất bại!");
      }
    } catch (err) {
      let errorMsg = "Đã xảy ra lỗi trong quá trình tạo hóa đơn.";
      if (err.response) {
        const serverError =
          err.response.data?.message ||
          err.response.data?.error ||
          JSON.stringify(err.response.data);
        errorMsg = `Lỗi từ server: ${serverError} (Code: ${err.response.status})`;
      } else if (err.request) {
        errorMsg = "Không thể kết nối đến máy chủ.";
      } else {
        errorMsg = `Lỗi cấu hình request: ${err.message}`;
      }
      setError(errorMsg);
    } finally {
      setIsCreatingInvoice(false);
    }
  }, [contractDetails, calculation, currentUser]);

  if (isLoading)
    return (
      <p className="text-center mt-10 text-gray-600">
        Đang tải dữ liệu hóa đơn...
      </p>
    );
  if (error && !contractDetails)
    return <p className="mt-10 text-center text-red-600">Lỗi: {error}</p>;
  if (!contractDetails)
    return (
      <p className="text-center mt-10 text-gray-600">
        Không có thông tin hợp đồng để tạo hóa đơn.
      </p>
    );

  // Lấy các giá trị tính toán mới để render
  const {
    totalPenalties,
    totalEstimatedAmount,
    totalAmount,
    depositAmount,
    finalAmountDue,
  } = calculation;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("vi-VN");
    } catch (e) {
      return dateString;
    }
  };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return "0 VND";
    return amount.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Hóa đơn Thanh toán Hợp đồng
      </h2>
      {error && (
        <p className="mb-4 text-center text-red-600 font-medium">
          Lỗi: {error}
        </p>
      )}
      <div className="border border-gray-300 p-6 rounded-lg shadow-lg bg-white text-sm">
        {/* --- Phần Header (Hiển thị thông tin từ contractDetails) --- */}
        <div className="grid grid-cols-2  gap-x-6 gap-y-3 mb-5 pb-4 border-b border-gray-200">
          {/* Thông tin khách hàng */}
          <div>
            <h3 className="text-base font-semibold mb-1 text-gray-700">
              Thông tin Khách hàng
            </h3>
            <p>
              <strong>Tên:</strong>{" "}
              {contractDetails.customer?.user?.fullName || "N/A"}
            </p>
            <p>
              <strong>SĐT:</strong>{" "}
              {contractDetails.customer?.user?.phoneNumber || "N/A"}
            </p>
            <p>
              <strong>Email:</strong>{" "}
              {contractDetails.customer?.user?.email || "N/A"}
            </p>
          </div>
          {/* Thông tin HĐ & Xử lý */}
          <div>
            <h3 className="text-base font-semibold mb-1 text-gray-700">
              Thông tin Hợp đồng
            </h3>
            <p>
              <strong>NV tạo HĐ:</strong>{" "}
              {contractDetails.employee?.user?.fullName || "N/A"}
            </p>
            <p>
              <strong>Ngày bắt đầu HĐ:</strong>{" "}
              {formatDate(contractDetails.startDate)}
            </p>
            <p>
              <strong>Ngày kết thúc HĐ:</strong>{" "}
              {formatDate(contractDetails.endDate)}
            </p>
            <p className="mt-2">
              <strong>NV tạo hóa đơn:</strong>{" "}
              {currentUser?.user.fullName || "N/A"}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              <strong>Ngày tạo hóa đơn:</strong>{" "}
              {new Date().toLocaleDateString("vi-VN")}
            </p>
          </div>
        </div>

        {/* --- Phần Chi tiết Xe (Hiển thị từ contractDetails) --- */}
        <div className="mb-5">
          <h3 className="text-base font-semibold mb-2 text-gray-700">
            Chi tiết Xe trong Hợp đồng
          </h3>
          {contractDetails.contractVehicleDetails &&
          contractDetails.contractVehicleDetails.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="py-2 px-2 font-medium text-gray-600">
                    Tên xe
                  </th>
                  <th className="py-2 px-2 font-medium text-gray-600">
                    Biển số
                  </th>
                  <th className="py-2 px-2 font-medium text-gray-600 text-right">
                    Giá thuê (HĐ)
                  </th>
                </tr>
              </thead>
              <tbody>
                {contractDetails.contractVehicleDetails.map((vd) => (
                  <tr key={vd.id} className="border-b border-gray-100">
                    <td className="py-1.5 px-2">{vd.vehicle?.name || "N/A"}</td>
                    <td className="py-1.5 px-2 font-mono">
                      {vd.vehicle?.licensePlate || "N/A"}
                    </td>
                    <td className="py-1.5 px-2 text-right">
                      {formatCurrency(vd.rentalPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500 italic">
              Không có chi tiết xe trong hợp đồng này.
            </p>
          )}
        </div>

        {/* --- Phần Phạt ĐÃ CÓ trong Hợp đồng --- */}
        {calculation.totalPenalties > 0 && (
          <div className="mb-5 pb-4 border-b border-gray-200">
            <h3 className="text-base font-semibold mb-2 text-orange-700">
              Chi tiết Phạt
            </h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-orange-50">
                  <th className="py-2 px-2 font-medium text-orange-800">
                    Loại phạt
                  </th>
                  <th className="py-2 px-2 font-medium text-orange-800">
                    Xe liên quan
                  </th>
                  <th className="py-2 px-2 font-medium text-orange-800">
                    Ghi chú
                  </th>
                  <th className="py-2 px-2 font-medium text-orange-800 text-right">
                    Số tiền
                  </th>
                </tr>
              </thead>
              <tbody>
                {contractDetails.contractVehicleDetails
                  ?.flatMap(
                    (detail) =>
                      detail.penalties?.map((p) => ({
                        ...p,
                        vehicleName: detail.vehicle?.name,
                      })) || [] // Thêm tên xe để dễ nhìn
                  )
                  .map((p, index) => (
                    <tr
                      key={`existing-${p.id || index}`}
                      className="border-b border-gray-100"
                    >
                      <td className="py-1.5 px-2">
                        {p.penaltyType?.name || "N/A"}
                      </td>
                      <td className="py-1.5 px-2 text-xs">
                        {p.vehicleName || "N/A"}
                      </td>
                      <td className="py-1.5 px-2 italic text-gray-600">
                        {p.note || "(không có)"}
                      </td>
                      <td className="py-1.5 px-2 text-right font-semibold text-orange-600">
                        {formatCurrency(p.penaltyAmount)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {calculation.totalPenalties === 0 && (
          <div className="mb-5 pb-4 border-b border-gray-200">
            <p className="text-center text-gray-500 italic">
              Không có phí phạt nào.
            </p>
          </div>
        )}

        {/* --- Phần Tổng kết Tiền (CẬP NHẬT HIỂN THỊ) --- */}
        <div>
          <h3 className="text-base font-semibold mb-3 text-gray-700">
            Tổng kết Thanh toán
          </h3>
          <div className="space-y-2 max-w-md ml-auto">
            <p className="flex justify-between items-center text-base">
              <span className="text-gray-600">Tổng tiền thuê gốc (HĐ):</span>
              <span className="font-medium text-gray-800 w-36 text-right">
                {formatCurrency(totalEstimatedAmount)}
              </span>
            </p>
            {totalPenalties > 0 && (
              <p className="flex justify-between items-center text-base">
                <span className="text-gray-600">Tổng phạt:</span>
                <span className="font-medium text-orange-700 w-36 text-right">
                  (+) {formatCurrency(totalPenalties)}
                </span>
              </p>
            )}

            {/* Hiển thị tổng cộng cuối cùng */}
            <p className="flex justify-between items-center text-base font-semibold border-t pt-2">
              <span className="text-gray-800">Tổng cộng (Thuê + Phạt):</span>
              <span className="text-gray-900 w-36 text-right">
                {formatCurrency(totalAmount)}
              </span>
            </p>
            <p className="flex justify-between items-center text-base">
              <span className="text-gray-600">Tiền cọc đã trả:</span>
              <span className="font-medium text-green-700 w-36 text-right">
                (-) {formatCurrency(depositAmount)}
              </span>
            </p>
            {/* Số tiền cuối cùng */}
            <div
              className={`mt-3 font-bold text-lg text-right p-3 rounded-md border `}
            >
              {finalAmountDue > 0 && (
                <span>
                  Thanh toán thêm:{" "}
                  <strong className="ml-2">
                    {formatCurrency(finalAmountDue)}
                  </strong>
                </span>
              )}
              {finalAmountDue < 0 && (
                <span>
                  Hoàn lại KH:{" "}
                  <strong className="ml-2">
                    {formatCurrency(Math.abs(finalAmountDue))}
                  </strong>
                </span>
              )}
              {finalAmountDue === 0 && <span>Hoàn tất.</span>}
            </div>
          </div>
        </div>
      </div>{" "}
      {/* Kết thúc khung hóa đơn */}
      <div className="mt-8 text-center">
        <button
          onClick={handleCreateInvoice}
          disabled={isLoading || isCreatingInvoice}
          className={`py-3 px-8 text-lg font-semibold rounded-md shadow-md text-white transition duration-150 ease-in-out ${
            isCreatingInvoice
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          }`}
        >
          {isCreatingInvoice ? "Đang tạo hóa đơn..." : "Xác nhận & Tạo Hóa đơn"}
        </button>
      </div>
    </div>
  );
};
