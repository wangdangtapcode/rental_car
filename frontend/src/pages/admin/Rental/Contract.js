import { useLocation, useNavigate } from "react-router";
import { useState, useEffect, useCallback } from "react";
import { formatCurrency } from "../../../utils/formatters";
import axios from "axios";
import { useSelector } from "react-redux";
export const ContractDraft = () => {
  const user = useSelector((state) => state.user.user);
  const location = useLocation();
  const navigate = useNavigate();
  const contractInputData = location.state;
  // State chính của trang này
  const [customer, setCustomer] = useState(null);
  const [searchParams, setSearchParams] = useState(null);
  // State đặc biệt để quản lý xe và ghi chú tình trạng của chúng
  const [vehiclesWithNotes, setVehiclesWithNotes] = useState([]);

  const [collaterals, setCollaterals] = useState([]); // Mảng các tài sản đảm bảo (chỉ là string mô tả)
  const [newCollateralInput, setNewCollateralInput] = useState(""); // Input cho tài sản mới
  const [depositAmount, setDepositAmount] = useState(0); // Tiền đặt cọc

  const [isSaving, setIsSaving] = useState(false); // Trạng thái đang lưu
  const [error, setError] = useState(null); // Lỗi chung

  // --- Effect để kiểm tra và lấy dữ liệu đầu vào ---
  useEffect(() => {
    if (
      !contractInputData?.customer ||
      !contractInputData?.selectedVehicles ||
      !contractInputData?.searchParams
    ) {
      console.error(
        "ContractRentalPage: Missing required data from previous step. Navigating back."
      );
      navigate("/rental/customer", { replace: true }); // Quay về bước 1 nếu thiếu data
    } else {
      // Chỉ cập nhật state nếu chúng chưa được khởi tạo
      if (!customer) setCustomer(contractInputData.customer);
      if (!searchParams) setSearchParams(contractInputData.searchParams);
      if (vehiclesWithNotes.length === 0)
        setVehiclesWithNotes(contractInputData.selectedVehicles);
    }
  }, [contractInputData, navigate, customer, searchParams, vehiclesWithNotes]); // Dependencies để đảm bảo chỉ chạy khi cần

  // Xử lý thay đổi ghi chú tình trạng xe
  const handleConditionNotesChange = useCallback((vehicleId, notes) => {
    setVehiclesWithNotes((prevVehicles) =>
      prevVehicles.map((item) => {
        if (item.vehicle.id === vehicleId) {
          console.log(item); // In thông tin xe trước khi thay đổi
          return { ...item, conditionNotes: notes };
        }
        return item;
      })
    );
  }, []); // Không cần dependency
  const handleConfirmContract = useCallback(async () => {
    setError(null);
    // Kiểm tra dữ liệu cơ bản
    if (!customer || !searchParams || vehiclesWithNotes.length === 0) {
      setError("Lỗi dữ liệu đầu vào, không thể tạo hợp đồng.");
      return;
    }
    if (depositAmount <= 0) {
      setError("Vui lòng nhập số tiền đặt cọc.");
      return;
    }
    if (collaterals.length === 0) {
      setError("Vui lòng điền tài sản đảm bảo.");
      return;
    }
    if (!user || !user.id) {
      setError(
        "Không xác định được thông tin nhân viên. Vui lòng đăng nhập lại."
      );
      setIsSaving(false);
      return;
    }
    const payload = {
      customerId: customer.id,
      employeeId: user.id,
      startDate: searchParams.startDate,
      endDate: searchParams.endDate,
      depositAmount: depositAmount,
      contractVehicleDetails: vehiclesWithNotes.map((item) => {
        if (
          !item.vehicle ||
          !item.vehicle.id ||
          typeof item.vehicle.rentalPrice !== "number"
        ) {
          throw new Error(`Dữ liệu xe không hợp lệ: ${JSON.stringify(item)}`);
        }
        return {
          vehicleId: item.vehicle.id,
          vehicleCondition: item.conditionNotes,
          rentalPrice: item.vehicle.rentalPrice,
        };
      }),
      collaterals: collaterals.map((desc) => ({
        description: desc,
      })),
    };

    console.log("Payload gửi lên server:", JSON.stringify(payload, null, 2));

    setIsSaving(true);
    try {
      const response = await axios.post("/api/v1/rental-contracts", payload);
      if (response.data === true) {
        alert("Thêm hợp đồng thành công!");
        navigate(`/rental/customer`);
      } else {
        setError("Lưu hợp đồng thất bại. Phản hồi từ server không hợp lệ.");
        setIsSaving(false);
      }
    } catch (err) {
      setError("Đã xảy ra lỗi trong quá trình lưu hợp đồng.");
      console.error("Save contract error:", err);
      setIsSaving(false);
    } finally {
      setIsSaving(false);
    }
  }, [
    customer,
    searchParams,
    vehiclesWithNotes,
    depositAmount,
    collaterals,
    user,
    navigate,
  ]);

  // Nếu đang thiếu dữ liệu cần thiết (dù useEffect đã chạy), hiển thị loading hoặc null
  if (!customer || !searchParams || vehiclesWithNotes.length === 0) {
    // useEffect sẽ xử lý navigate, nên có thể trả về null hoặc một spinner
    return (
      <div className="container mx-auto p-4">Đang tải dữ liệu hợp đồng...</div>
    );
  }

  // Tính tổng tiền thuê dự kiến (optional)
  const calculateTotalRental = () => {
    const start = new Date(searchParams.startDate);
    const end = new Date(searchParams.endDate);
    const diffTime = Math.abs(end - start);
    // Tính số ngày thuê (bao gồm cả ngày bắt đầu và kết thúc)
    // Ví dụ: thuê từ 1/1 đến 2/1 là 2 ngày
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    if (isNaN(diffDays) || diffDays <= 0) return 0;

    return vehiclesWithNotes.reduce((total, item) => {
      const price = item.vehicle.rentalPrice || 0;
      return total + price * diffDays;
    }, 0);
  };
  const totalRentalAmount = calculateTotalRental();
  //

  //
  const handleNewCollateralChange = (event) => {
    setNewCollateralInput(event.target.value);
  };
  //
  const handleAddCollateral = () => {
    const trimmedInput = newCollateralInput.trim();
    if (trimmedInput) {
      setCollaterals((prevCollaterals) => [...prevCollaterals, trimmedInput]);
      setNewCollateralInput(""); // Xóa input sau khi thêm
    }
  };
  //
  // Xử lý xóa tài sản đảm bảo (theo index)
  const handleRemoveCollateral = (indexToRemove) => {
    setCollaterals((prevCollaterals) =>
      prevCollaterals.filter((_, index) => index !== indexToRemove)
    );
  };

  // Xử lý thay đổi input tiền cọc
  const handleDepositChange = (event) => {
    const value = parseFloat(event.target.value);
    setDepositAmount(isNaN(value) || value < 0 ? 0 : value);
  };
  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Tiêu đề và nút quay lại */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Xác Nhận Hợp Đồng</h1>
        <button
          onClick={() =>
            navigate(`/rental/vehicles/${customer.id}`, { state: { customer } })
          }
          className="text-md text-blue-600 hover:underline"
        >
          Quay lại chọn xe
        </button>
      </div>
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
          role="alert"
        >
          {error}
        </div>
      )}
      {/* =========================================== */}
      {/* Thông tin Khách hàng và Ngày thuê */}
      {/* =========================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Thông tin khách hàng */}
        <div className="border rounded p-4 bg-gray-50">
          <h3 className="font-semibold mb-2 text-gray-800">
            Thông tin khách hàng
          </h3>
          <p>
            <strong>Họ tên:</strong> {customer.user.fullName}
          </p>
          <p>
            <strong>Số điện thoại:</strong> {customer.user.phoneNumber}
          </p>
          <p>
            <strong>Email:</strong> {customer.user.email || "N/A"}
          </p>
          <p>
            <strong>Địa chỉ:</strong> {customer.user.address || "N/A"}
          </p>
        </div>
        {/* Thông tin thuê */}
        <div className="border rounded p-4 bg-gray-50">
          <h3 className="font-semibold mb-2 text-gray-800">Thông tin thuê</h3>
          <p>
            <strong>Từ ngày:</strong>{" "}
            {new Date(searchParams.startDate).toLocaleDateString("vi-VN")}
          </p>
          <p>
            <strong>Đến ngày:</strong>{" "}
            {new Date(searchParams.endDate).toLocaleDateString("vi-VN")}
          </p>
          <p className="mt-2 font-semibold text-indigo-700">
            Tổng tiền thuê dự kiến: {formatCurrency(totalRentalAmount)}
          </p>
        </div>
      </div>
      {/* =========================================== */}
      {/* Danh sách Xe thuê và Tình trạng */}
      {/* =========================================== */}
      <div className="border rounded p-4">
        <h3 className="font-semibold mb-3 text-gray-800">
          Xe Thuê ({vehiclesWithNotes.length})
        </h3>
        <div className="space-y-4">
          {vehiclesWithNotes.map((item) => (
            <div
              key={item.vehicle.id}
              className="border-b pb-4 last:border-b-0"
            >
              <div className="mr-3 flex-shrink-0 w-24 h-24 md:w-32 md:h-32">
                {item.vehicle.vehicleImages &&
                item.vehicle.vehicleImages.length > 0 &&
                item.vehicle.vehicleImages[0].imageUri ? (
                  <img
                    src={item.vehicle.vehicleImages[0].imageUri}
                    alt={item.vehicle.name}
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-gray-400 text-xs text-center">
                      Không có ảnh
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                <p className="font-medium text-lg">
                  {item.vehicle.name}{" "}
                  <span className="text-base font-normal text-gray-600">
                    ({item.vehicle.licensePlate})
                  </span>
                </p>
                <p className="text-sm text-gray-700 sm:ml-4">
                  Giá/ngày:{" "}
                  <span className="font-bold text-indigo-600">
                    {formatCurrency(item.vehicle.rentalPrice)}
                  </span>
                </p>
              </div>
              {/* Input Tình trạng xe */}
              <div>
                <label
                  htmlFor={`condition-${item.vehicle.id}`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Tình trạng xe khi giao (ghi chú):
                </label>
                <textarea
                  id={`condition-${item.vehicle.id}`}
                  rows="2"
                  value={item.conditionNotes}
                  onChange={(e) =>
                    handleConditionNotesChange(item.vehicle.id, e.target.value)
                  } // Gọi handler khi thay đổi
                  placeholder="Ví dụ: Trầy xước nhẹ cản trước, mức xăng còn 1 vạch,..."
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* =========================================== */}
      {/* Tài sản đảm bảo */}
      {/* =========================================== */}
      <div className="border rounded p-4">
        <h3 className="font-semibold mb-3 text-gray-800">Tài sản đảm bảo</h3>
        {/* Input thêm tài sản */}
        <div className="flex space-x-2 mb-3">
          <input
            type="text"
            value={newCollateralInput}
            onChange={handleNewCollateralChange} // Cập nhật state input
            placeholder="Mô tả tài sản (VD: CCCD 123xxx, Xe máy Dream biển số...)"
            className="flex-grow p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddCollateral} // Gọi hàm thêm
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            disabled={!newCollateralInput.trim()} // Vô hiệu hóa nếu input rỗng
          >
            Thêm
          </button>
        </div>
        {/* Danh sách tài sản đã thêm */}
        {collaterals.length > 0 ? (
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {collaterals.map((collateral, index) => (
              <li
                key={index}
                className="flex justify-between items-center group p-2 rounded hover:bg-gray-200 transition-all duration-200"
              >
                <span>{collateral}</span>
                <button
                  onClick={() => handleRemoveCollateral(index)} // Gọi hàm xóa theo index
                  className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity text-xs ml-2 px-1 hover:bg-red-100 rounded"
                  title="Xóa tài sản này"
                >
                  × Xóa
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">
            Chưa có tài sản đảm bảo nào được thêm.
          </p>
        )}
      </div>
      {/* =========================================== */}
      {/* Tiền đặt cọc */}
      {/* =========================================== */}
      <div className="border rounded p-4">
        <label
          htmlFor="depositAmount"
          className="block text-lg font-semibold text-gray-700 mb-2"
        >
          Tiền đặt cọc <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          id="depositAmount"
          name="depositAmount"
          value={depositAmount}
          onChange={handleDepositChange} // Gọi hàm cập nhật state
          min="0"
          placeholder="Nhập số tiền cọc"
          required // HTML5 validation
          className="block w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        <p className="text-sm text-gray-500 mt-1">
          Số tiền khách hàng đặt cọc khi làm hợp đồng.
        </p>
      </div>
      {/* =========================================== */}
      {/* Nút Xác nhận */}
      {/* =========================================== */}
      <div className="mt-6 pt-6 border-t flex justify-end">
        <button
          onClick={handleConfirmContract} // Gọi hàm xử lý cuối cùng
          className="px-8 py-3 bg-green-600 text-white font-bold rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out text-lg"
          disabled={
            isSaving || depositAmount <= 0 || vehiclesWithNotes.length === 0
          } // Vô hiệu hóa khi đang lưu hoặc thiếu thông tin
        >
          {isSaving ? "Đang xử lý..." : "Xác Nhận & Lưu Hợp Đồng"}
        </button>
      </div>
      {/* Có thể thêm thông báo phụ nếu nút bị vô hiệu hóa */}
      {depositAmount <= 0 && (
        <p className="text-red-500 text-sm text-right mt-1">
          Vui lòng nhập tiền đặt cọc.
        </p>
      )}
      {collaterals.length === 0 && (
        <p className="text-red-500 text-sm text-right mt-1">
          Vui lòng điền tài sản đảm bảo.
        </p>
      )}
      {vehiclesWithNotes.length === 0 && (
        <p className="text-red-500 text-sm text-right mt-1">
          Không có xe nào trong hợp đồng.
        </p>
      )}
    </div>
  );
};
