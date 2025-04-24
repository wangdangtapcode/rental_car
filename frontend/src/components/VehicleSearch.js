// src/pages/admin/rental/VehicleRentalPage.jsx (Viết trực tiếp, không dùng component con)

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

// --- Giả lập API và Dữ liệu mẫu (Nên tách ra file riêng) ---
// Cần dữ liệu fakeCustomers để fetch lại khi refresh trang
const fakeCustomers = [
  {
    id: 1,
    user: {
      id: 101,
      fullName: "Nguyễn Văn Test",
      phoneNumber: "0901112233",
      email: "test1@example.com",
      address: "1 Đường Demo, Q. Hoàn Kiếm, Hà Nội",
      userType: "CUSTOMER",
      status: "ACTIVE",
    },
  },
  {
    id: 2,
    user: {
      id: 102,
      fullName: "Trần Thị Mẫu",
      phoneNumber: "0918887766",
      email: "test2@example.com",
      address: "2 Phố Ví Dụ, Q. Ba Đình, Hà Nội",
      userType: "CUSTOMER",
      status: "ACTIVE",
    },
  },
  // ... thêm các khách hàng khác nếu cần
];

const fakeVehicles = [
  {
    id: 1,
    name: "Toyota Vios 1.5G",
    licensePlate: "29A-123.45",
    brand: "Toyota",
    type: "Sedan",
    seatCount: 5,
    manufactureYear: 2022,
    rentalPrice: 850000,
    vehicleCondition: "Mới 99%",
    status: "AVAILABLE",
    ownerType: "COMPANY",
    description: "Xe gia đình, tiết kiệm nhiên liệu.",
  },
  {
    id: 2,
    name: "Honda City RS",
    licensePlate: "30B-678.90",
    brand: "Honda",
    type: "Sedan",
    seatCount: 5,
    manufactureYear: 2021,
    rentalPrice: 800000,
    vehicleCondition: "Tốt, không trầy xước",
    status: "AVAILABLE",
    ownerType: "COMPANY",
    description: "Bản thể thao, cảm giác lái tốt.",
  },
  {
    id: 3,
    name: "Ford Ranger Wildtrak",
    licensePlate: "29C-111.22",
    brand: "Ford",
    type: "Pickup",
    seatCount: 5,
    manufactureYear: 2020,
    rentalPrice: 1200000,
    vehicleCondition: "Khá, có vài vết xước nhỏ",
    status: "AVAILABLE",
    ownerType: "CONSIGNMENT",
    description: "Xe bán tải mạnh mẽ, phù hợp đi địa hình.",
  },
  {
    id: 4,
    name: "Mitsubishi Xpander Cross",
    licensePlate: "30D-333.44",
    brand: "Mitsubishi",
    type: "MPV",
    seatCount: 7,
    manufactureYear: 2023,
    rentalPrice: 950000,
    vehicleCondition: "Như mới",
    status: "RENTED",
    ownerType: "COMPANY",
    description: "Xe 7 chỗ rộng rãi, phù hợp gia đình đông người.",
  },
  {
    id: 5,
    name: "Hyundai Accent 1.4AT",
    licensePlate: "29A-555.66",
    brand: "Hyundai",
    type: "Sedan",
    seatCount: 5,
    manufactureYear: 2021,
    rentalPrice: 700000,
    vehicleCondition: "Tốt",
    status: "AVAILABLE",
    ownerType: "COMPANY",
    description: "Giá thuê hợp lý, đầy đủ tiện nghi.",
  },
  {
    id: 6,
    name: "Kia Carnival Signature",
    licensePlate: "30E-777.88",
    brand: "Kia",
    type: "MPV",
    seatCount: 7,
    manufactureYear: 2022,
    rentalPrice: 1500000,
    vehicleCondition: "Mới",
    status: "MAINTENANCE",
    ownerType: "COMPANY",
    description: "Xe cao cấp, nội thất sang trọng.",
  },
  {
    id: 7,
    name: "VinFast VF e34",
    licensePlate: "88A-999.00",
    brand: "VinFast",
    type: "SUV",
    seatCount: 5,
    manufactureYear: 2022,
    rentalPrice: 1000000,
    vehicleCondition: "Tốt",
    status: "AVAILABLE",
    ownerType: "COMPANY",
    description: "Xe điện thân thiện môi trường.",
  },
];

// Hàm tìm xe (Giả lập)
const findAvailableVehicles = async (startDate, endDate) => {
  console.log(
    `API: Searching vehicles available from ${startDate} to ${endDate}`
  );
  await new Promise((resolve) => setTimeout(resolve, 500));
  let results = fakeVehicles.filter((v) => v.status === "AVAILABLE");
  results.sort((a, b) => a.name.localeCompare(b.name));
  return results;
};
// --- Kết thúc API giả lập ---

// --- Hàm tiện ích ---
const formatCurrency = (amount) => {
  if (typeof amount !== "number") return amount;
  try {
    return amount.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  } catch (error) {
    return `${amount} VND`;
  }
};
// --- Kết thúc Hàm tiện ích ---

function VehicleRentalPage() {
  const { customerId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // --- State ---
  const initialCustomer = location.state?.customer;
  const [customer, setCustomer] = useState(initialCustomer); // Thông tin khách hàng
  const [isLoadingCustomer, setIsLoadingCustomer] = useState(!initialCustomer); // Cờ báo đang load KH nếu chưa có

  const [searchParams, setSearchParams] = useState({
    startDate: "",
    endDate: "",
  }); // Ngày tìm kiếm
  const [availableVehicles, setAvailableVehicles] = useState([]); // Kết quả tìm kiếm
  const [selectedVehicles, setSelectedVehicles] = useState([]); // Xe đã chọn [{ vehicle: {}, conditionNotes: '' }]
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(false); // Cờ báo đang tìm xe
  const [didSearchVehicle, setDidSearchVehicle] = useState(false); // Cờ báo đã tìm xe ít nhất 1 lần
  const [error, setError] = useState(null); // Lỗi chung của trang

  // --- Effect để fetch lại KH nếu cần (khi refresh) ---
  useEffect(() => {
    if (!customer && customerId) {
      setIsLoadingCustomer(true); // Bắt đầu load
      console.log("Fetching customer details for ID:", customerId);
      // Giả lập fetch
      const foundCustomer = fakeCustomers.find(
        (c) => c.id === parseInt(customerId)
      );
      setTimeout(() => {
        // Thêm độ trễ giả lập
        if (foundCustomer) {
          setCustomer(foundCustomer);
          setError(null); // Xóa lỗi cũ nếu có
        } else {
          setError(`Không tìm thấy khách hàng với ID: ${customerId}.`);
        }
        setIsLoadingCustomer(false); // Kết thúc load
      }, 500); // Giả lập độ trễ mạng
    } else {
      setIsLoadingCustomer(false); // Nếu đã có customer thì không load
    }
  }, [customer, customerId]); // Chỉ chạy khi customer hoặc customerId thay đổi

  // --- Handlers ---

  // Xử lý thay đổi input ngày tháng
  const handleDateChange = (event) => {
    const { name, value } = event.target;
    setSearchParams((prevParams) => ({
      ...prevParams,
      [name]: value,
    }));
    // Reset trạng thái tìm kiếm khi ngày thay đổi
    setDidSearchVehicle(false);
    setAvailableVehicles([]);
    setError(null); // Xóa lỗi cũ
  };

  // Xử lý bấm nút "Tìm Xe"
  const handleSearchSubmit = useCallback(
    async (event) => {
      event.preventDefault(); // Ngăn form submit
      setError(null); // Xóa lỗi cũ

      // Kiểm tra ngày hợp lệ
      if (!searchParams.startDate || !searchParams.endDate) {
        setError("Vui lòng chọn cả ngày bắt đầu và ngày kết thúc.");
        return;
      }
      if (new Date(searchParams.startDate) >= new Date(searchParams.endDate)) {
        setError("Ngày bắt đầu phải trước ngày kết thúc.");
        return;
      }

      setIsLoadingVehicles(true);
      setDidSearchVehicle(true); // Đánh dấu đã tìm
      setAvailableVehicles([]); // Xóa kết quả cũ

      try {
        const results = await findAvailableVehicles(
          searchParams.startDate,
          searchParams.endDate
        );
        // Lọc bỏ những xe đã có trong danh sách chọn
        const currentlySelectedIds = new Set(
          selectedVehicles.map((item) => item.vehicle.id)
        );
        setAvailableVehicles(
          results.filter((v) => !currentlySelectedIds.has(v.id))
        );
        if (results.length === 0) {
          // Có thể set thông báo riêng thay vì dùng error chung
          // setError('Không tìm thấy xe phù hợp trong khoảng thời gian này.');
        }
      } catch (err) {
        setError("Lỗi trong quá trình tìm kiếm xe.");
        console.error(err);
      } finally {
        setIsLoadingVehicles(false);
      }
    },
    [searchParams, selectedVehicles]
  ); // Phụ thuộc vào ngày và danh sách xe đã chọn

  // Xử lý chọn xe từ danh sách available
  const handleSelectVehicleClick = useCallback((vehicle) => {
    // Thêm xe vào danh sách chọn
    setSelectedVehicles((prev) => [
      ...prev,
      {
        vehicle: vehicle,
        conditionNotes: vehicle.vehicleCondition || "Như hiện trạng",
      },
    ]);
    // Xóa xe khỏi danh sách available
    setAvailableVehicles((prev) => prev.filter((v) => v.id !== vehicle.id));
  }, []); // Không cần dependency vì nó dùng state setter

  // Xử lý bỏ chọn xe từ danh sách selected
  const handleRemoveVehicleClick = useCallback(
    (vehicleId) => {
      const removedItem = selectedVehicles.find(
        (item) => item.vehicle.id === vehicleId
      );
      if (!removedItem) return;

      // Xóa khỏi selectedVehicles
      setSelectedVehicles((prev) =>
        prev.filter((item) => item.vehicle.id !== vehicleId)
      );

      // Thêm lại vào availableVehicles nếu nó có trong kq tìm kiếm gần nhất
      // (Logic này đã được sửa ở bước trước, kiểm tra trạng thái AVAILABLE)
      const originalVehicle = fakeVehicles.find((v) => v.id === vehicleId);
      if (
        originalVehicle &&
        didSearchVehicle &&
        originalVehicle.status === "AVAILABLE"
      ) {
        setAvailableVehicles((prev) => {
          if (!prev.some((v) => v.id === vehicleId)) {
            // Thêm lại vào danh sách, có thể sắp xếp lại nếu muốn
            const newList = [originalVehicle, ...prev];
            newList.sort((a, b) => a.name.localeCompare(b.name)); // Sắp xếp lại
            return newList;
          }
          return prev;
        });
      }
    },
    [selectedVehicles, didSearchVehicle]
  ); // Phụ thuộc state này

  // Xử lý chuyển sang trang tạo hợp đồng
  const handleGoToDraft = () => {
    if (
      customer &&
      selectedVehicles.length > 0 &&
      searchParams.startDate &&
      searchParams.endDate
    ) {
      const draftState = {
        customer: customer,
        selectedVehicles: selectedVehicles, // Truyền cả conditionNotes
        searchParams: searchParams,
      };
      navigate("/rental/contract/draft", { state: draftState });
    } else {
      setError("Vui lòng chọn ít nhất một xe và đảm bảo có ngày thuê hợp lệ.");
    }
  };

  // --- Render Logic ---

  // Xử lý trạng thái loading hoặc lỗi khi fetch khách hàng
  if (isLoadingCustomer) {
    return (
      <div className="container mx-auto p-4">
        Đang tải thông tin khách hàng...
      </div>
    );
  }
  if (error && !customer) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <button
          onClick={() => navigate("/rental/customer")}
          className="text-blue-600 hover:underline"
        >
          Quay lại chọn khách hàng
        </button>
      </div>
    );
  }
  // Nếu không có customer vì lý do nào đó (dù không loading và không lỗi)
  if (!customer) {
    console.warn("VehicleRentalPage rendered without customer data.");
    return (
      <div className="container mx-auto p-4">
        Không có thông tin khách hàng.{" "}
        <button
          onClick={() => navigate("/rental/customer")}
          className="text-blue-600 hover:underline"
        >
          Quay lại
        </button>
      </div>
    );
  }

  // --- JSX Render ---
  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Hiển thị thông tin khách hàng */}
      <div>
        <h1 className="text-2xl font-bold mb-2">
          Bước 2: Chọn Xe cho Khách Hàng
        </h1>
        <div className="bg-blue-100 border border-blue-300 text-blue-800 px-4 py-3 rounded mb-6 flex justify-between items-center">
          <div>
            <span className="font-semibold">Khách hàng:</span>{" "}
            {customer.user.fullName} ({customer.user.phoneNumber})
          </div>
          <button
            onClick={() => navigate("/rental/customer")}
            className="text-sm text-blue-600 hover:underline font-medium"
          >
            Chọn KH khác
          </button>
        </div>
      </div>

      {/* Hiển thị lỗi chung */}
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
          role="alert"
        >
          {error}
        </div>
      )}

      {/* =========================================== */}
      {/* Phần Tìm kiếm Xe (Viết trực tiếp) */}
      {/* =========================================== */}
      <div className="p-4 border rounded shadow-sm bg-white">
        <h2 className="text-xl font-semibold mb-3">Tìm Xe Theo Ngày</h2>
        <form
          onSubmit={handleSearchSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
        >
          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-700"
            >
              Ngày bắt đầu
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={searchParams.startDate}
              onChange={handleDateChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-700"
            >
              Ngày kết thúc
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={searchParams.endDate}
              onChange={handleDateChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 h-10"
            disabled={isLoadingVehicles}
          >
            {isLoadingVehicles ? "Đang tìm..." : "Tìm Xe"}
          </button>
        </form>
      </div>

      {/* =========================================== */}
      {/* Phần Hiển thị Xe Đã Chọn (Viết trực tiếp) */}
      {/* =========================================== */}
      {selectedVehicles.length > 0 && (
        <div className="mt-6 border rounded shadow-sm bg-white p-4">
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Xe đã chọn ({selectedVehicles.length}):
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {selectedVehicles.map((item) => (
              <div
                key={`selected-${item.vehicle.id}`}
                className="border rounded p-3 flex flex-col md:flex-row justify-between md:items-center bg-gray-50 shadow-sm"
              >
                {/* Thông tin xe */}
                <div className="flex-grow mb-2 md:mb-0 md:mr-4">
                  <p className="font-semibold text-lg">
                    {item.vehicle.name}{" "}
                    <span className="text-sm font-normal text-gray-600">
                      ({item.vehicle.manufactureYear})
                    </span>
                  </p>
                  <p className="text-sm text-gray-700">
                    Biển số:{" "}
                    <span className="font-medium">
                      {item.vehicle.licensePlate}
                    </span>
                  </p>
                  <p className="text-sm text-gray-700">
                    Giá thuê/ngày:{" "}
                    <span className="font-bold text-indigo-600">
                      {formatCurrency(item.vehicle.rentalPrice)}
                    </span>
                  </p>
                  {/* Có thể hiển thị conditionNotes ở đây nếu muốn */}
                  {/* <p className="text-xs text-gray-500 mt-1">Ghi chú: {item.conditionNotes}</p> */}
                </div>
                {/* Nút bỏ chọn */}
                <button
                  onClick={() => handleRemoveVehicleClick(item.vehicle.id)} // Gọi hàm bỏ chọn
                  className="px-3 py-1 rounded text-white text-sm bg-red-500 hover:bg-red-600 transition duration-150 ease-in-out"
                >
                  Bỏ Chọn
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* Phần Hiển thị Kết quả Tìm kiếm Xe (Viết trực tiếp) */}
      {/* ================================================= */}
      <div className="mt-6 border rounded shadow-sm bg-white p-4">
        <h3 className="text-lg font-medium text-gray-800 mb-2">
          Kết quả tìm kiếm xe phù hợp:
        </h3>
        {/* Trạng thái loading */}
        {isLoadingVehicles && (
          <p className="text-gray-500">Đang tải danh sách xe...</p>
        )}
        {/* Chưa tìm hoặc không có kết quả */}
        {!isLoadingVehicles && !didSearchVehicle && (
          <p className="text-gray-500">Nhập ngày thuê và bấm "Tìm Xe".</p>
        )}
        {!isLoadingVehicles &&
          didSearchVehicle &&
          availableVehicles.length === 0 && (
            <p className="text-gray-500">
              Không tìm thấy xe nào phù hợp hoặc còn trống trong khoảng thời
              gian này.
            </p>
          )}
        {/* Hiển thị danh sách xe tìm được */}
        {!isLoadingVehicles && availableVehicles.length > 0 && (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {availableVehicles.map((vehicle) => (
              <div
                key={`available-${vehicle.id}`}
                className="border rounded p-3 flex flex-col md:flex-row justify-between md:items-center bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Thông tin xe */}
                <div className="flex-grow mb-2 md:mb-0 md:mr-4">
                  <p className="font-semibold text-lg">
                    {vehicle.name}{" "}
                    <span className="text-sm font-normal text-gray-600">
                      ({vehicle.manufactureYear})
                    </span>
                  </p>
                  <p className="text-sm text-gray-700">
                    Biển số:{" "}
                    <span className="font-medium">{vehicle.licensePlate}</span>
                  </p>
                  <p className="text-sm text-gray-700">
                    Hãng: {vehicle.brand} - Loại: {vehicle.type} - Số chỗ:{" "}
                    {vehicle.seatCount}
                  </p>
                  <p className="text-sm text-gray-700">
                    Giá thuê/ngày:{" "}
                    <span className="font-bold text-indigo-600">
                      {formatCurrency(vehicle.rentalPrice)}
                    </span>
                  </p>
                  {vehicle.ownerType === "CONSIGNMENT" && (
                    <span className="text-xs font-semibold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                      Xe ký gửi
                    </span>
                  )}
                  {vehicle.description && (
                    <p className="text-xs text-gray-500 mt-1">
                      Mô tả: {vehicle.description}
                    </p>
                  )}
                </div>
                {/* Nút chọn xe */}
                <button
                  onClick={() => handleSelectVehicleClick(vehicle)} // Gọi hàm chọn xe
                  className="px-3 py-1 rounded text-white text-sm bg-blue-500 hover:bg-blue-600 transition duration-150 ease-in-out"
                >
                  Chọn Xe
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Nút chuyển sang tạo hợp đồng */}
      {selectedVehicles.length > 0 && (
        <div className="mt-6 text-right">
          <button
            onClick={handleGoToDraft}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-150 ease-in-out"
          >
            Tiến tới Tạo Hợp Đồng ({selectedVehicles.length} xe)
          </button>
        </div>
      )}
    </div>
  );
}

export default VehicleRentalPage;
