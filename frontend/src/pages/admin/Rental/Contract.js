import { useLocation, useNavigate } from "react-router";
import { useState, useEffect, useCallback } from "react";
import { formatCurrency } from "../../../utils/formatters";
import axios from "axios";
import { useSelector } from "react-redux";
export const ContractDraft = () => {
  const user = useSelector((state) => state.user.user);
  const location = useLocation();
  const navigate = useNavigate();
  // Lấy dữ liệu đầu vào và mode
  const contractInputData = location.state;
  const mode = contractInputData?.mode || "new"; // Mặc định là 'new'
  const originalContract = contractInputData?.originalContractData;
  // State chính của trang này
  const [customer, setCustomer] = useState(null);
  const [searchParams, setSearchParams] = useState(null);
  const [vehiclesWithNotes, setVehiclesWithNotes] = useState([]);
  const [collaterals, setCollaterals] = useState([]);
  const [newCollateralInput, setNewCollateralInput] = useState("");

  const [displayValues, setDisplayValues] = useState({
    totalEstimatedAmount: 0,
    depositAmount: 0,
    dueAmount: 0,
  });

  const [isSaving, setIsSaving] = useState(false); // Trạng thái đang lưu
  const [error, setError] = useState(null); // Lỗi chung

  // --- Effect để kiểm tra và lấy dữ liệu đầu vào ---
  useEffect(() => {
    if (!contractInputData) {
      console.error("ContractDraft: Missing input data. Navigating back.");
      navigate("/rental/customerSearch", { replace: true });
      return;
    }
    console.log("ContractDraft: Input data:", contractInputData);
    if (contractInputData.customer) setCustomer(contractInputData.customer);
    if (contractInputData.searchParams)
      setSearchParams(contractInputData.searchParams);

    if (contractInputData.selectedVehicles) {
      setVehiclesWithNotes(contractInputData.selectedVehicles);
    }

    if (mode === "booking" && originalContract) {
      setDisplayValues({
        totalEstimatedAmount: originalContract.totalEstimatedAmount || 0,
        depositAmount: originalContract.depositAmount || 0,
        dueAmount: originalContract.dueAmount || 0,
      });

      setCollaterals(
        originalContract.collaterals?.map((c) => c.description) || []
      );
    } else if (mode === "new") {
      setCollaterals([]);
    }
  }, [contractInputData, mode, originalContract, navigate]);

  // Sửa hàm calculateNewFinancials
  const calculateNewFinancials = useCallback(() => {
    // Chỉ tính toán nếu là mode 'new' và có đủ dữ liệu
    if (mode !== "new" || !searchParams || vehiclesWithNotes.length === 0) {
      return { total: 0, deposit: 0, due: 0 };
    }
    const start = new Date(searchParams.startDate);
    const end = new Date(searchParams.endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) {
      return { total: 0, deposit: 0, due: 0 };
    }
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    if (isNaN(diffDays) || diffDays <= 0) {
      return { total: 0, deposit: 0, due: 0 };
    }
    const totalEstimated = vehiclesWithNotes.reduce((total, item) => {
      const price = Number(item.vehicle?.rentalPrice);
      if (isNaN(price) || price < 0) return total;
      return total + price * diffDays;
    }, 0);
    const deposit = totalEstimated * 0.2;
    const due = totalEstimated - deposit;
    return { total: totalEstimated, deposit: deposit, due: due };
  }, [mode, searchParams, vehiclesWithNotes]); // Bỏ displayValues khỏi dependencies

  useEffect(() => {
    if (mode === "new") {
      const { total, deposit, due } = calculateNewFinancials();
      setDisplayValues((prevValues) => {
        if (
          prevValues.totalEstimatedAmount !== total ||
          prevValues.depositAmount !== deposit ||
          prevValues.dueAmount !== due
        ) {
          return {
            totalEstimatedAmount: total,
            depositAmount: deposit,
            dueAmount: due,
          };
        }
        return prevValues;
      });
    }
  }, [mode, searchParams, vehiclesWithNotes, calculateNewFinancials]);

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
  }, []);

  //
  const handleNewCollateralChange = (event) => {
    if (mode === "new") {
      // Chỉ cho phép thay đổi nếu là mode 'new'
      setNewCollateralInput(event.target.value);
    }
  };
  //
  const handleAddCollateral = () => {
    if (mode !== "new") return; // Không làm gì nếu không phải mode 'new'
    const trimmedInput = newCollateralInput.trim();
    if (trimmedInput) {
      setCollaterals((prevCollaterals) => [...prevCollaterals, trimmedInput]);
      setNewCollateralInput("");
    }
  };
  //
  // Xử lý xóa tài sản đảm bảo (theo index)
  const handleRemoveCollateral = (indexToRemove) => {
    if (mode !== "new") return;
    setCollaterals((prevCollaterals) =>
      prevCollaterals.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleConfirmContract = useCallback(async () => {
    setError(null);
    setIsSaving(true);
    // Kiểm tra chung
    if (
      !customer ||
      !searchParams ||
      vehiclesWithNotes.length === 0 ||
      collaterals.length === 0
    ) {
      setError("Vui lòng điền đầy đủ thông tin hợp đồng và tài sản đảm bảo.");
      setIsSaving(false);
      return;
    }
    if (!user || !user.id) {
      setError(
        "Không xác định được thông tin nhân viên. Vui lòng đăng nhập lại."
      );
      setIsSaving(false);
      return;
    }
    // Kiểm tra tiền cọc cho mode 'new'
    if (mode === "new" && displayValues.depositAmount <= 0) {
      setError(
        "Tiền cọc dự kiến phải lớn hơn 0. Kiểm tra lại ngày hoặc xe đã chọn."
      );
      setIsSaving(false);
      return;
    }
    const now = new Date();
    const formattedCreatedDate = now.toISOString().slice(0, 10);

    let payload;
    let apiUrl;
    let successMessage;
    if (mode === "new") {
      apiUrl = `http://localhost:8081/api/rentalContract/create`;
      successMessage = "Thêm hợp đồng mới thành công!";
      payload = {
        customerId: customer.id,
        employeeId: user.id,
        rentalContract: {
          startDate: searchParams.startDate,
          endDate: searchParams.endDate,
          depositAmount: displayValues.depositAmount,
          totalEstimatedAmount: displayValues.totalEstimatedAmount,
          dueAmount: displayValues.dueAmount,
          createdDate: formattedCreatedDate,
          contractVehicleDetails: vehiclesWithNotes.map((item) => ({
            vehicleId: item.vehicle.id,
            vehicleCondition: item.conditionNotes,
            rentalPrice: item.vehicle.rentalPrice,
          })),
          collaterals: collaterals.map((desc) => ({ description: desc })),
        },
      };
    } else if (mode === "booking" && originalContract) {
      apiUrl = `http://localhost:8081/api/rentalContract/update/${originalContract.id}`;
      successMessage = `Xác nhận nhận xe cho hợp đồng ${originalContract.id} thành công!`;
      payload = {
        employeeId: user.id,
        updatedVehicleConditions: vehiclesWithNotes.map((item) => ({
          contractVehicleDetailId: originalContract.contractVehicleDetails.find(
            (sv) => sv.vehicle.id === item.vehicle.id
          )?.id,
          vehicleId: item.vehicle.id,
          conditionNotes: item.conditionNotes, // Ghi chú tình trạng mới khi giao
        })),
        // Backend sẽ tự động chuyển status của RentalContract sang ACTIVE
        // và có thể tạo Invoice cho phần dueAmount nếu cần thu ngay
      };
      // Quan trọng: Đối với `updatedVehicleConditions`, bạn cần cách để liên kết `conditionNotes` mới
      // với `ContractVehicleDetail` cụ thể trong DB.
      // Nếu `contractInputData.selectedVehicles` (từ `transformedState`) có chứa ID của `ContractVehicleDetail`
      // thì bạn có thể dùng nó. Nếu không, backend có thể cần `vehicleId` và `rentalContractId` để tìm.
      // Ví dụ trên giả sử `contractVehicleDetailId` có thể không có, backend sẽ dựa vào `vehicleId`
      // và ID của hợp đồng (từ URL) để tìm ContractVehicleDetail tương ứng.
    } else {
      setError("Chế độ hoạt động không hợp lệ.");
      setIsSaving(false);
      return;
    }

    console.log(
      `Payload cho mode '${mode}':`,
      JSON.stringify(payload, null, 2)
    );

    try {
      const response = await axios.post(apiUrl, payload);
      if (response.data === true) {
        alert(successMessage);
        navigate(`/rental/customerSearch`, { replace: true });
      } else {
        setError("Lưu hợp đồng thất bại. Phản hồi từ server không hợp lệ.");
        setIsSaving(false);
      }
    } catch (err) {
      let errorMsg = `Đã xảy ra lỗi (Mode: ${mode}).`;
      if (err.response) {
        const serverError =
          err.response.data?.message ||
          err.response.data?.error ||
          JSON.stringify(err.response.data);
        errorMsg += ` Server: ${serverError} (${err.response.status})`;
      } else if (err.request) {
        errorMsg += ` Không thể kết nối server.`;
      } else {
        errorMsg += ` Lỗi: ${err.message}`;
      }
      setError(errorMsg);
      console.error("Save contract error:", err);
    } finally {
      setIsSaving(false);
    }
  }, [
    customer,
    searchParams,
    vehiclesWithNotes,
    collaterals,
    user,
    navigate,
    mode,
    originalContract,
    displayValues,
    contractInputData,
  ]);

  if (!customer || !searchParams) {
    return <div className="container mx-auto p-4">Đang tải dữ liệu...</div>;
  }

  const pageTitle =
    mode === "new"
      ? "Xác Nhận Tạo Hợp Đồng Mới"
      : `Xác Nhận Nhận Xe - HĐ #${originalContract?.id || ""}`;
  const submitButtonText =
    mode === "new" ? "Xác Nhận & Lưu Hợp Đồng" : "Xác Nhận Nhận Xe";
  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Tiêu đề và nút quay lại */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{pageTitle}</h1>
        <button
          onClick={() => {
            if (mode === "new") {
              navigate(`/rental/vehicles/${customer.id}`, {
                state: customer,
              });
            } else {
              navigate("/rental/contractSearch", { replace: true });
            }
          }}
          className="text-md text-blue-600 hover:underline"
        >
          {mode === "new" ? "Quay lại chọn xe" : "Quay lại tìm hợp đồng"}
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
          <p className="mt-2 font-semibold">
            Tổng tiền thuê dự kiến:{" "}
            <span className="text-indigo-700">
              {formatCurrency(displayValues.totalEstimatedAmount)}
            </span>
          </p>
          <p className="font-semibold">
            Tiền đặt cọc ({mode === "new" ? "20% - Tự động" : "Đã cọc"}):{" "}
            <span className="text-green-700">
              {formatCurrency(displayValues.depositAmount)}
            </span>
          </p>
          <p className="font-semibold">
            Số tiền còn lại cần thanh toán khi trả xe
            <span className="text-orange-700 ml-1">
              {formatCurrency(displayValues.dueAmount)}
            </span>
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
                item.vehicle.vehicleImages.length > 0 ? (
                  (() => {
                    const thumbnail = item.vehicle.vehicleImages.find(
                      (img) => img.isThumbnail
                    );
                    return (
                      thumbnail &&
                      thumbnail.imageUri && (
                        <img
                          src={thumbnail.imageUri}
                          alt={thumbnail.name}
                          className="w-full h-full object-cover rounded"
                        />
                      )
                    );
                  })()
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
        {mode === "new" ? (
          <>
            <div className="flex space-x-2 mb-3">
              <input
                type="text"
                value={newCollateralInput}
                onChange={handleNewCollateralChange}
                placeholder="Mô tả tài sản (VD: CCCD 123xxx, Xe máy Dream biển số...)"
                className="flex-grow p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                // disabled={mode !== 'new'} // Không cần nữa vì đã có điều kiện ở handleNewCollateralChange
              />
              <button
                onClick={handleAddCollateral}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                disabled={!newCollateralInput.trim() /* || mode !== 'new' */}
              >
                Thêm
              </button>
            </div>
            {collaterals.length === 0 && (
              <p className="text-sm text-gray-500">
                Chưa có tài sản đảm bảo nào được thêm.
              </p>
            )}
          </>
        ) : (
          collaterals.length > 0 && (
            <p className="text-sm text-gray-600 mb-2">
              Thông tin tài sản đảm bảo đã được ghi nhận từ đơn đặt trước.
            </p>
          )
          // Hoặc nếu mode 'booking' mà originalContract.collaterals rỗng, bạn có thể muốn cho phép thêm mới
          // Nhưng theo yêu cầu "không cho thêm sửa xoá", thì chỉ hiển thị.
        )}
        {/* Danh sách tài sản đã thêm */}
        {collaterals.length > 0 ? (
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {collaterals.map((collateral, index) => (
              <li
                key={index}
                className={`flex justify-between items-center group p-2 rounded ${
                  mode === "new" ? "hover:bg-gray-200" : ""
                } transition-all duration-200`}
              >
                <span>{collateral}</span>
                {mode === "new" && ( // Chỉ hiển thị nút xóa khi mode là 'new'
                  <button
                    onClick={() => handleRemoveCollateral(index)}
                    className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity text-xs ml-2 px-1 hover:bg-red-100 rounded"
                    title="Xóa tài sản này"
                  >
                    × Xóa
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          mode !== "new" && (
            <p className="text-sm text-gray-500 italic">
              Không có tài sản đảm bảo nào được ghi nhận cho hợp đồng này.
            </p>
          )
        )}
      </div>
      {/* =========================================== */}
      {/* Nút Xác nhận */}
      {/* =========================================== */}
      <div className="mt-6 pt-6 border-t flex justify-end">
        <button
          onClick={handleConfirmContract} // Gọi hàm xử lý cuối cùng
          className="px-8 py-3 bg-green-600 text-white font-bold rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out text-lg"
          disabled={
            isSaving ||
            (mode === "new" && displayValues.totalEstimatedAmount <= 0) || // Cho mode new
            vehiclesWithNotes.length === 0 ||
            collaterals.length === 0
          }
        >
          {isSaving ? "Đang xử lý..." : submitButtonText}
        </button>
      </div>
      {/* Thông báo lỗi phụ */}
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
      {mode === "new" &&
        displayValues.totalEstimatedAmount <= 0 &&
        vehiclesWithNotes.length > 0 && (
          <p className="text-red-500 text-sm text-right mt-1">
            Tổng tiền thuê dự kiến không hợp lệ. Kiểm tra lại ngày hoặc xe.
          </p>
        )}
    </div>
  );
};
