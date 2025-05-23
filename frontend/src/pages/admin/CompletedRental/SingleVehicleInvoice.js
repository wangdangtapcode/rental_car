import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

export const SingleVehicleInvoice = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { vehicleDetailId } = useParams();

  const [vehicleDetail, setVehicleDetail] = useState(null);
  const [contractDetails, setContractDetails] = useState(null);
  const [calculation, setCalculation] = useState({
    rentalDays: 0,
    rentalCost: 0,
    totalPenalties: 0,
    totalAmount: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);
  const [error, setError] = useState(null);

  const currentUser = useSelector((state) => state.user.user);

  const calculateCosts = useCallback((vehicleDetail) => {
    if (!vehicleDetail) return;

    // Calculate rental days
    const startDate = new Date(vehicleDetail.startDate);
    const endDate = new Date(
      vehicleDetail.actualReturnDate || vehicleDetail.endDate
    );

    const diffTime = Math.abs(endDate - startDate);
    const rentalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    // Calculate rental cost
    const dailyRate = vehicleDetail.rentalPrice || 0;
    const rentalCost = dailyRate * rentalDays;

    // Calculate penalties
    let totalPenalties = 0;
    if (vehicleDetail.penalties && Array.isArray(vehicleDetail.penalties)) {
      totalPenalties = vehicleDetail.penalties.reduce(
        (sum, penalty) => sum + (Number(penalty.penaltyAmount) || 0),
        0
      );
    }

    // Calculate total
    const totalAmount = rentalCost + totalPenalties;

    // Update state
    setCalculation({
      rentalDays,
      rentalCost,
      totalPenalties,
      totalAmount,
    });
  }, []);

  // Load data
  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const vdFromState = location.state?.vehicleDetail;
    const contractFromState = location.state?.contract;

    if (vdFromState && contractFromState) {
      setVehicleDetail(vdFromState);
      setContractDetails(contractFromState);
      calculateCosts(vdFromState);
      setIsLoading(false);
    } else {
      // If not from state, load from API
      const fetchVehicleDetail = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8081/api/rentalContract/vehicleDetail/${vehicleDetailId}`
          );

          setVehicleDetail(response.data);

          // Get contract data
          const contractResponse = await axios.get(
            `http://localhost:8081/api/rentalContract/${response.data.rentalContract.id}`
          );

          setContractDetails(contractResponse.data);
          calculateCosts(response.data);
        } catch (err) {
          console.error("Error loading vehicle details:", err);
          setError("Không thể tải thông tin xe. Vui lòng thử lại.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchVehicleDetail();
    }
  }, [vehicleDetailId, location.state, calculateCosts]);

  // Handle create invoice
  const handleCreateInvoice = useCallback(async () => {
    if (!vehicleDetail || !currentUser || !currentUser.id) {
      setError(
        "Thiếu thông tin xe hoặc nhân viên. Vui lòng đăng nhập để tiếp tục."
      );
      return;
    }

    setIsCreatingInvoice(true);
    setError(null);

    const paymentDate = new Date().toISOString().slice(0, 10);

    const invoicePayload = {
      paymentDate: paymentDate,
      penaltyAmount: calculation.totalPenalties,
      totalAmount: calculation.totalAmount,
      employeeId: currentUser.id,
      vehicleDetailId: vehicleDetail.id,
    };

    try {
      // Gọi API tạo hóa đơn - bước này sẽ cập nhật trạng thái xe thành RETURNED
      const response = await axios.post(
        `http://localhost:8081/api/invoice/createSingle/${vehicleDetail.id}?employeeId=${currentUser.id}`,
        invoicePayload
      );

      if (response.data === "Tạo hóa đơn thành công") {
        alert("Đã xác nhận thanh toán và hoàn tất quá trình trả xe!");
        navigate("/completedRental");
      } else {
        alert("Thêm hoá đơn thất bại!");
      }
    } catch (err) {
      let errorMsg = "Đã xảy ra lỗi trong quá trình tạo hóa đơn.";
      if (err.response) {
        errorMsg = `Lỗi từ server: ${err.response.data} (Code: ${err.response.status})`;
      } else if (err.request) {
        errorMsg = "Không thể kết nối đến máy chủ.";
      } else {
        errorMsg = `Lỗi: ${err.message}`;
      }
      setError(errorMsg);
    } finally {
      setIsCreatingInvoice(false);
    }
  }, [vehicleDetail, calculation, currentUser, navigate]);

  if (isLoading) {
    return (
      <p className="text-center mt-10 text-gray-600">Đang tải dữ liệu...</p>
    );
  }

  if (error && !vehicleDetail) {
    return <p className="mt-10 text-center text-red-600">Lỗi: {error}</p>;
  }

  if (!vehicleDetail) {
    return (
      <p className="text-center mt-10 text-gray-600">
        Không có thông tin xe để tạo hóa đơn.
      </p>
    );
  }

  // Format helpers
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
        Hóa đơn Trả Xe Đơn Lẻ
      </h2>

      {error && (
        <p className="mb-4 text-center text-red-600 font-medium">
          Lỗi: {error}
        </p>
      )}

      {/* Contract Info */}
      <div className="mb-6 p-4 border border-gray-200 rounded-lg shadow bg-gray-50">
        <h3 className="text-lg font-medium mb-3">Thông tin Hợp đồng</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Mã HĐ:</span> {contractDetails?.id}
          </div>
          <div>
            <span className="font-medium">Khách hàng:</span>{" "}
            {contractDetails?.customer?.fullName}
          </div>
          <div>
            <span className="font-medium">Ngày lập:</span>{" "}
            {formatDate(contractDetails?.contractDate)}
          </div>
          <div>
            <span className="font-medium">SĐT:</span>{" "}
            {contractDetails?.customer?.phoneNumber}
          </div>
        </div>
      </div>

      {/* Vehicle Info */}
      <div className="mb-6 p-4 border border-gray-200 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-3">Thông tin Xe</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Tên xe:</span>{" "}
            {vehicleDetail.vehicle?.name}
          </div>
          <div>
            <span className="font-medium">Biển số:</span>{" "}
            {vehicleDetail.vehicle?.licensePlate}
          </div>
          <div>
            <span className="font-medium">Ngày thuê:</span>{" "}
            {formatDate(vehicleDetail.startDate)}
          </div>
          <div>
            <span className="font-medium">Ngày trả:</span>{" "}
            {formatDate(vehicleDetail.actualReturnDate)}
          </div>
          <div>
            <span className="font-medium">Số ngày thuê:</span>{" "}
            {calculation.rentalDays} ngày
          </div>
          <div>
            <span className="font-medium">Giá thuê/ngày:</span>{" "}
            {formatCurrency(vehicleDetail.rentalPrice)}
          </div>
        </div>
      </div>

      {/* Penalties */}
      {vehicleDetail.penalties && vehicleDetail.penalties.length > 0 && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-3">Phí phạt</h3>
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Loại lỗi</th>
                <th className="p-2 text-left">Ghi chú</th>
                <th className="p-2 text-right">Số tiền</th>
              </tr>
            </thead>
            <tbody>
              {vehicleDetail.penalties.map((penalty, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2">{penalty.penaltyType?.name}</td>
                  <td className="p-2">{penalty.note}</td>
                  <td className="p-2 text-right">
                    {formatCurrency(penalty.penaltyAmount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Calculation Summary */}
      <div className="mb-6 p-4 border border-gray-200 rounded-lg shadow bg-gray-50">
        <h3 className="text-lg font-medium mb-3">Tổng kết</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Chi phí thuê xe:</span>
            <span className="font-medium">
              {formatCurrency(calculation.rentalCost)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Tổng phí phạt:</span>
            <span className="font-medium">
              {formatCurrency(calculation.totalPenalties)}
            </span>
          </div>
          <div className="border-t border-gray-300 pt-2 mt-2 flex justify-between text-lg font-bold">
            <span>Tổng cộng:</span>
            <span>{formatCurrency(calculation.totalAmount)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          disabled={isCreatingInvoice}
        >
          Quay lại
        </button>
        <button
          onClick={handleCreateInvoice}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          disabled={isCreatingInvoice}
        >
          {isCreatingInvoice
            ? "Đang xử lý..."
            : "Xác Nhận Thanh Toán & Hoàn Tất"}
        </button>
      </div>
    </div>
  );
};
