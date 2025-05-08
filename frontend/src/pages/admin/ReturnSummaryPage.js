// src/pages/ReturnSummaryPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
// import axios from 'axios'; // Bỏ comment nếu dùng API thật
// import { useSelector } from 'react-redux';

// --- Dữ liệu mẫu CẬP NHẬT ---
// Thêm totalEstimatedAmount và dueAmount (giả định deposit là 20%)
const samplePenaltyTypes = [
  // ... (giữ nguyên)
  { id: 1, name: "Phí vệ sinh", defaultAmount: 150000 },
  { id: 2, name: "Trả xe trễ hạn", defaultAmount: 200000 },
  { id: 3, name: "Hư hỏng nhẹ", defaultAmount: 0 },
  { id: 4, name: "Thiếu nhiên liệu", defaultAmount: 0 },
  { id: 5, name: "Mất giấy tờ xe", defaultAmount: 500000 },
];
const sampleContractDetails_101 = {
  id: 101,
  customer: {
    /*...*/ id: 55,
    user: {
      fullName: "Nguyễn Văn An",
      phoneNumber: "0901234567",
      email: "an.nguyen@email.com",
    },
  },
  employee: { /*...*/ id: 12, user: { fullName: "Trần Thị Bích" } },
  startDate: "2023-10-20",
  endDate: "2023-10-25",
  createdDate: "2023-10-19", // Thêm ngày tạo nếu có
  depositAmount: 2000000,
  totalEstimatedAmount: 10000000, // <-- THÊM MỚI (2tr / 0.2)
  dueAmount: 8000000, // <-- THÊM MỚI (10tr - 2tr)
  status: "ACTIVE",
  collaterals: [
    /*...*/
  ],
  contractVehicleDetails: [
    {
      id: 301,
      rentalPrice: 800000,
      vehicle: { id: 7, name: "Toyota Vios G", licensePlate: "30A-987.65" },
    },
    {
      id: 302,
      rentalPrice: 1200000,
      vehicle: {
        id: 9,
        name: "Ford Ranger Wildtrak",
        licensePlate: "29C-555.11",
      },
    },
  ],
};
const sampleContractDetails_102 = {
  id: 102,
  customer: { /*...*/ id: 55, user: { fullName: "Nguyễn Văn An" } },
  employee: { /*...*/ id: 10, user: { fullName: "Lê Văn Cường" } },
  startDate: "2023-09-15",
  endDate: "2023-09-18",
  createdDate: "2023-09-14",
  depositAmount: 1000000,
  totalEstimatedAmount: 5000000, // <-- THÊM MỚI (1tr / 0.2)
  dueAmount: 4000000, // <-- THÊM MỚI (5tr - 1tr)
  status: "OVERDUE",
  collaterals: [
    /*...*/
  ],
  contractVehicleDetails: [
    {
      id: 305,
      rentalPrice: 600000,
      vehicle: { id: 15, name: "Hyundai Accent", licensePlate: "30F-112.23" },
    },
  ],
};
const allSampleContractDetails = {
  101: sampleContractDetails_101,
  102: sampleContractDetails_102,
};
const samplePenaltiesFromPreviousPage = [
  // ... (giữ nguyên)
  {
    penaltyTypeId: 1,
    penaltyAmount: 150000,
    note: "Nội thất bẩn",
    contractVehicleDetailId: 301,
  },
  {
    penaltyTypeId: 4,
    penaltyAmount: 250000,
    note: "Thiếu xăng",
    contractVehicleDetailId: 301,
  },
  {
    penaltyTypeId: 3,
    penaltyAmount: 400000,
    note: "Xước cản sau",
    contractVehicleDetailId: 302,
  },
];
const mockCurrentUser = {
  /*...*/
};
// --- Kết thúc dữ liệu mẫu ---

const ReturnSummaryPage = () => {
  const { contractId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // --- State ---
  const [contractDetails, setContractDetails] = useState(null);
  const [newPenaltiesData, setNewPenaltiesData] = useState([]);
  const [penaltyTypes, setPenaltyTypes] = useState([]);
  // CẬP NHẬT State Tính toán
  const [calculation, setCalculation] = useState({
    totalNewPenalties: 0,
    totalEstimatedAmount: 0, // Thêm: Lưu trữ tiền thuê gốc
    totalAmount: 0, // Thêm: Tổng tiền thuê gốc + phạt
    depositAmount: 0, // Giữ nguyên: Tiền cọc từ HĐ
    finalAmountDue: 0, // Giữ nguyên: Số tiền cuối (thu/trả)
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const currentUser = mockCurrentUser;

  // --- Hàm Tính toán Chi phí (CẬP NHẬT LOGIC) ---
  const calculateCosts = useCallback((contract, penalties) => {
    const deposit = contract?.depositAmount || 0;
    const estimatedTotal = contract?.totalEstimatedAmount || 0; // Lấy tiền thuê gốc từ HĐ

    const totalNewPenalties = penalties.reduce(
      (sum, p) => sum + (Number(p.penaltyAmount) || 0), // Đảm bảo là số
      0
    );

    // Tính tổng mới = tiền thuê gốc + tổng phạt mới
    const newTotalAmount = estimatedTotal + totalNewPenalties;

    // Tính số tiền cuối cùng = Tổng mới - tiền cọc đã trả
    const finalAmountDue = newTotalAmount - deposit;

    // Cập nhật state calculation với các giá trị mới
    setCalculation({
      totalNewPenalties,
      totalEstimatedAmount: estimatedTotal, // Lưu lại tiền thuê gốc
      totalAmount: newTotalAmount, // Lưu lại tổng mới
      depositAmount: deposit, // Lưu lại tiền cọc
      finalAmountDue, // Lưu lại số tiền cuối
    });
  }, []); // Không cần dependency vì chỉ dùng tham số

  // --- Fetch dữ liệu và Tính toán (Giữ nguyên logic fetch, dùng data mới) ---
  useEffect(() => {
    const penaltiesFromState =
      location.state?.penaltiesToCreate || samplePenaltiesFromPreviousPage;
    setNewPenaltiesData(penaltiesFromState);

    const fetchAllDataAndCalculate = async () => {
      setIsLoading(true);
      setError(null);
      // Sử dụng dữ liệu mẫu ĐÃ CẬP NHẬT
      setTimeout(() => {
        const contractData = allSampleContractDetails[contractId];
        const typesData = samplePenaltyTypes;

        if (contractData) {
          setContractDetails(contractData);
          setPenaltyTypes(typesData);
          // Gọi hàm tính toán đã cập nhật
          calculateCosts(contractData, penaltiesFromState);
        } else {
          setError(`Không tìm thấy dữ liệu mẫu cho HĐ ID: ${contractId}`);
        }
        setIsLoading(false);
      }, 500);
    };
    fetchAllDataAndCalculate();
  }, [contractId, location.state, calculateCosts]); // calculateCosts là dependency

  // --- Hàm Hoàn tất Trả xe (CẬP NHẬT Payload nếu cần) ---
  const handleCompleteReturn = useCallback(async () => {
    // ... (kiểm tra contractDetails giữ nguyên) ...
    if (!contractDetails) {
      setError("Thiếu thông tin HĐ.");
      return;
    }
    setIsCompleting(true);
    setError(null);
    setSuccessMessage("");

    // Payload có thể vẫn giữ nguyên nếu backend chỉ cần biết tổng phạt và số tiền cuối
    // Backend có thể tự tính totalAmount dựa trên contractId và penaltiesToCreate
    const payload = {
      contractId: parseInt(contractId, 10),
      penaltiesToCreate: newPenaltiesData,
      finalCalculation: {
        totalPenaltyAmount: calculation.totalNewPenalties, // Tổng phạt mới
        finalAmountPaidOrRefunded: calculation.finalAmountDue, // Số tiền cuối cùng thu/chi
      },
      processingEmployeeId: currentUser?.id, // Thêm ID nhân viên xử lý
    };
    console.log(
      "Payload (mock) gửi đi để hoàn tất:",
      JSON.stringify(payload, null, 2)
    );

    // Giả lập gọi API thành công
    setTimeout(() => {
      console.log("Giả lập hoàn tất thành công!");
      setSuccessMessage(
        `Hoàn tất trả xe (mock) cho hợp đồng ${contractId} thành công!`
      );
      setIsCompleting(false);
      // Có thể navigate đi đâu đó sau khi thành công
      // navigate('/some-success-page');
    }, 1000);
  }, [
    contractId,
    contractDetails,
    newPenaltiesData,
    calculation, // calculation giờ chứa các giá trị mới
    currentUser,
    navigate,
  ]);

  // --- Render ---
  if (isLoading) return <p>Đang tải...</p>;
  if (error && !contractDetails) return <p>Lỗi: {error}</p>;
  if (!contractDetails) return <p>Không có thông tin hợp đồng.</p>;

  // Lấy các giá trị tính toán mới để render
  const {
    totalNewPenalties,
    totalEstimatedAmount, // Lấy giá trị mới
    totalAmount, // Lấy giá trị mới
    depositAmount,
    finalAmountDue,
  } = calculation;

  const getPenaltyTypeName = (typeId) =>
    penaltyTypes.find((pt) => pt.id === typeId)?.name || `Loại ID ${typeId}`;

  // Định dạng ngày tháng
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("vi-VN");
    } catch (e) {
      return dateString; // Trả về chuỗi gốc nếu lỗi
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Hóa đơn Trả xe - Mã HĐ: {contractId}
      </h2>
      {error && (
        <p className="mb-4 text-center text-red-600 font-medium">
          Lỗi: {error}
        </p>
      )}
      {successMessage && (
        <p className="mb-4 text-center text-green-600 font-medium">
          {successMessage}
        </p>
      )}
      {/* --- Khung Hóa đơn Chính --- */}
      <div className="border border-gray-300 p-6 rounded-lg shadow-lg bg-white text-sm">
        {/* --- Phần Header: Khách hàng, Nhân viên & Ngày HĐ --- CẬP NHẬT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 mb-5 pb-4 border-b border-gray-200">
          {/* Thông tin khách hàng (giữ nguyên) */}
          <div>
            <h3 className="text-base font-semibold mb-1 text-gray-700">
              Thông tin Khách hàng
            </h3>
            <p>
              <strong>Tên:</strong>{" "}
              {contractDetails.customer?.user?.fullName || "N/A"}
            </p>
            {/* ... (SĐT, Email, Mã KH giữ nguyên) ... */}
            <p>
              <strong>SĐT:</strong>{" "}
              {contractDetails.customer?.user?.phoneNumber}
            </p>
            <p>
              <strong>Email:</strong>{" "}
              {contractDetails.customer?.user?.email || "N/A"}
            </p>
            <p>
              <strong>Mã KH:</strong> {contractDetails.customer?.id || "N/A"}
            </p>
          </div>
          {/* Thông tin nhân viên & Ngày HĐ */}
          <div>
            <h3 className="text-base font-semibold mb-1 text-gray-700">
              Thông tin Hợp đồng & Xử lý
            </h3>
            <p>
              <strong>NV tạo HĐ:</strong>{" "}
              {contractDetails.employee?.user?.fullName || "N/A"} (ID:{" "}
              {contractDetails.employee?.id})
            </p>
            {/* --- THÊM NGÀY HỢP ĐỒNG --- */}
            <p>
              <strong>Ngày bắt đầu HĐ:</strong>{" "}
              {formatDate(contractDetails.startDate)}
            </p>
            <p>
              <strong>Ngày kết thúc HĐ:</strong>{" "}
              {formatDate(contractDetails.endDate)}
            </p>
            {/* --- ------------------ --- */}
            <p className="mt-2">
              <strong>NV nhận trả xe:</strong>{" "}
              {currentUser?.user?.fullName || "N/A"} (ID: {currentUser?.id})
            </p>
            <p className="mt-1 text-xs text-gray-500">
              <strong>Ngày xử lý trả xe:</strong>{" "}
              {new Date().toLocaleDateString("vi-VN")}
            </p>
          </div>
        </div>

        {/* --- Phần Chi tiết Xe (giữ nguyên) --- */}
        <div className="mb-5">
          <h3 className="text-base font-semibold mb-2 text-gray-700">
            Chi tiết Xe trong Hợp đồng
          </h3>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="py-2 px-2 font-medium text-gray-600">Tên xe</th>
                <th className="py-2 px-2 font-medium text-gray-600">Biển số</th>
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
                    {vd.rentalPrice?.toLocaleString() || 0} VND
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- Phần Phạt Mới Phát Sinh (giữ nguyên) --- */}
        {newPenaltiesData.length > 0 && (
          <div className="mb-5 pb-4 border-b border-gray-200">
            <h3 className="text-base font-semibold mb-2 text-red-700">
              Chi tiết Phạt/Phí phát sinh khi trả xe
            </h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-red-50">
                  <th className="py-2 px-2 font-medium text-red-800">
                    Loại phạt/phí
                  </th>
                  <th className="py-2 px-2 font-medium text-red-800">
                    Ghi chú
                  </th>
                  <th className="py-2 px-2 font-medium text-red-800 text-right">
                    Số tiền
                  </th>
                </tr>
              </thead>
              <tbody>
                {newPenaltiesData.map((p, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-1.5 px-2">
                      {getPenaltyTypeName(p.penaltyTypeId)}
                    </td>
                    <td className="py-1.5 px-2 italic text-gray-600">
                      {p.note || "(không có)"}
                    </td>
                    <td className="py-1.5 px-2 text-right font-semibold text-red-600">
                      {p.penaltyAmount.toLocaleString()} VND
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {newPenaltiesData.length === 0 && (
          <div className="mb-5 pb-4 border-b border-gray-200">
            <p className="text-center text-gray-500 italic">
              Không có phí phạt/phát sinh mới.
            </p>
          </div>
        )}

        {/* --- Phần Tổng kết Tiền --- CẬP NHẬT HIỂN THỊ */}
        <div>
          <h3 className="text-base font-semibold mb-3 text-gray-700">
            Tổng kết Thanh toán
          </h3>
          <div className="space-y-2 max-w-md ml-auto">
            {/* --- THÊM HIỂN THỊ TIỀN THUÊ GỐC --- */}
            <p className="flex justify-between items-center text-base">
              <span className="text-gray-600">Tổng tiền thuê gốc (HĐ):</span>
              <span className="font-medium text-gray-800 w-32 text-right">
                {totalEstimatedAmount.toLocaleString()} VND
              </span>
            </p>
            {/* --- -------------------------- --- */}
            <p className="flex justify-between items-center text-base">
              <span className="text-gray-600">Tổng tiền phạt mới:</span>
              <span className="font-medium text-red-700 w-32 text-right">
                (+) {totalNewPenalties.toLocaleString()} VND
              </span>
            </p>
            {/* --- THÊM HIỂN THỊ TỔNG MỚI --- */}
            <p className="flex justify-between items-center text-base font-semibold border-t pt-2">
              <span className="text-gray-800">Tổng cộng (Thuê + Phạt):</span>
              <span className="text-gray-900 w-32 text-right">
                {totalAmount.toLocaleString()} VND
              </span>
            </p>
            {/* --- ---------------------- --- */}
            <p className="flex justify-between items-center text-base">
              <span className="text-gray-600">Tiền cọc đã trả:</span>
              <span className="font-medium text-green-700 w-32 text-right">
                (-) {depositAmount.toLocaleString()} VND
              </span>
            </p>
            {/* --- Số tiền cuối cùng (logic hiển thị giữ nguyên) --- */}
            <div
              className={`mt-3 font-bold text-lg text-right p-3 rounded-md border ${
                finalAmountDue > 0
                  ? "border-red-200 bg-red-50 text-red-800"
                  : finalAmountDue < 0
                  ? "border-green-200 bg-green-50 text-green-800"
                  : "border-blue-200 bg-blue-50 text-blue-800"
              }`}
            >
              {finalAmountDue > 0 && (
                <span>
                  Thanh toán thêm:{" "}
                  <strong className="ml-2">
                    {finalAmountDue.toLocaleString()} VND
                  </strong>
                </span>
              )}
              {finalAmountDue < 0 && (
                <span>
                  Hoàn lại KH:{" "}
                  <strong className="ml-2">
                    {Math.abs(finalAmountDue).toLocaleString()} VND
                  </strong>
                </span>
              )}
              {finalAmountDue === 0 && <span>Hoàn tất.</span>}
            </div>
          </div>
        </div>
      </div>{" "}
      {/* Kết thúc khung hóa đơn */}
      {/* --- Nút hoàn tất và Lưu ý (giữ nguyên) --- */}
      {!successMessage && (
        <div className="mt-8 text-center">
          {contractDetails?.collaterals &&
            contractDetails.collaterals.length > 0 && (
              <p className="text-sm text-gray-500 italic mb-4">
                Lưu ý: Nhớ trả lại tài sản thế chấp cho khách hàng (
                {contractDetails.collaterals
                  .map((c) => c.description)
                  .join(", ")}
                ).
              </p>
            )}
          <button
            onClick={handleCompleteReturn}
            disabled={isLoading || isCompleting}
            className={`py-3 px-8 text-lg font-semibold rounded-md shadow-md text-white transition duration-150 ease-in-out ${
              isCompleting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            }`}
          >
            {isCompleting ? "Đang xử lý..." : "Xác nhận Thanh toán & Hoàn tất"}
          </button>
        </div>
      )}
      {successMessage && (
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/")} // Hoặc navigate đến trang danh sách hợp đồng
            className="py-2 px-4 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Về trang chủ
          </button>
        </div>
      )}
    </div>
  );
};

export default ReturnSummaryPage;
