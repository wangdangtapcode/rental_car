import { useLocation, useNavigate, useParams } from "react-router";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { formatCurrency } from "../../../utils/formatters";
export const VehicleSearch = () => {
  const { customerId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const initialCustomer = location.state?.customer;
  const [customer, setCustomer] = useState(initialCustomer);
  const [isLoadingCustomer, setIsLoadingCustomer] = useState(!initialCustomer);
  const [error, setError] = useState(null);
  // xe

  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(false);
  const [didSearchVehicle, setDidSearchVehicle] = useState(false);

  const [searchParams, setSearchParams] = useState({
    startDate: "",
    endDate: "",
  });

  const handleDateChange = (event) => {
    const { name, value } = event.target;
    setSearchParams((prevParams) => ({
      ...prevParams,
      [name]: value,
    }));
    // Reset trạng thái tìm kiếm khi ngày thay đổi
    setDidSearchVehicle(false);
    setAvailableVehicles([]);
    setError(null);
  };
  //

  //
  const handleSearchSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setError(null);

      if (!searchParams.startDate || !searchParams.endDate) {
        setError("Vui lòng chọn cả ngày bắt đầu và ngày kết thúc.");
        return;
      }
      if (new Date(searchParams.startDate) >= new Date(searchParams.endDate)) {
        setError("Ngày bắt đầu phải trước ngày kết thúc.");
        return;
      }

      setIsLoadingVehicles(true);
      setDidSearchVehicle(true);
      setAvailableVehicles([]);

      try {
        const response = await axios.get(
          "http://localhost:8081/api/vehicle/all",
          {
            params: {
              startDate: searchParams.startDate,
              endDate: searchParams.endDate,
            },
          }
        );
        console.log(response.data);
        const results = response.data;

        const currentlySelectedIds = new Set(
          selectedVehicles.map((item) => item.vehicle.id)
        );
        setAvailableVehicles(
          results.filter((v) => !currentlySelectedIds.has(v.id))
        );
        if (results.length === 0) {
          setError("Không tìm thấy xe phù hợp trong khoảng thời gian này.");
        }
      } catch (err) {
        setError("Lỗi trong quá trình tìm kiếm xe.");
        console.error(err);
      } finally {
        setIsLoadingVehicles(false);
      }
    },
    [searchParams, selectedVehicles]
  );
  //
  const handleSelectVehicleClick = useCallback((vehicle) => {
    setSelectedVehicles((prev) => [
      ...prev,
      {
        vehicle: vehicle,
        conditionNotes: vehicle.vehicleCondition || "Như hiện trạng",
      },
    ]);

    setAvailableVehicles((prev) => prev.filter((v) => v.id !== vehicle.id));
  }, []);
  //
  const handleRemoveVehicleClick = useCallback(
    (vehicleId) => {
      const removedItem = selectedVehicles.find(
        (item) => item.vehicle.id === vehicleId
      );
      if (!removedItem) return;

      setSelectedVehicles((prev) =>
        prev.filter((item) => item.vehicle.id !== vehicleId)
      );

      if (didSearchVehicle) {
        setAvailableVehicles((prev) => {
          // Kiểm tra xem xe đã tồn tại trong danh sách availableVehicles chưa
          if (!prev.some((v) => v.id === vehicleId)) {
            const newList = [...prev, removedItem.vehicle];

            newList.sort((a, b) => a.name.localeCompare(b.name));
            return newList;
          }
          return prev;
        });
      }
    },
    [selectedVehicles, didSearchVehicle]
  );
  //
  const handleGoToDraft = () => {
    if (
      customer &&
      selectedVehicles.length > 0 &&
      searchParams.startDate &&
      searchParams.endDate
    ) {
      const draftState = {
        customer: customer,
        selectedVehicles: selectedVehicles,
        searchParams: searchParams,
      };
      navigate("/rental/contract/draft", { state: draftState });
    } else {
      setError("Vui lòng chọn ít nhất một xe và đảm bảo có ngày thuê hợp lệ.");
    }
  };

  //
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
          onClick={() => navigate("/rental/customerSearch")}
          className="text-blue-600 hover:underline"
        >
          Quay lại chọn khách hàng
        </button>
      </div>
    );
  }
  if (!customer) {
    console.warn("VehicleRentalPage rendered without customer data.");
    return (
      <div className="container mx-auto p-4">
        Không có thông tin khách hàng.{" "}
        <button
          onClick={() => navigate("/rental/customerSearch")}
          className="text-blue-600 hover:underline"
        >
          Quay lại
        </button>
      </div>
    );
  }
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">
          Chọn Xe theo yêu cầu của Khách Hàng
        </h1>
        <div className="bg-blue-100 border border-blue-300 text-blue-800 px-4 py-3 rounded mb-6 flex justify-between items-center">
          <div>
            <span className="font-semibold">Khách hàng:</span>{" "}
            {customer.user.fullName} ({customer.user.phoneNumber})
          </div>
          <button
            onClick={() => navigate("/rental/customerSearch")}
            className="text-sm text-blue-600 hover:underline font-medium"
          >
            Chọn KH khác
          </button>
        </div>
      </div>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
          role="alert"
        >
          {error}
        </div>
      )}

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
            disabled={isLoadingVehicles} // Vô hiệu hóa khi đang tìm
          >
            {isLoadingVehicles ? "Đang tìm..." : "Tìm Xe"}
          </button>
        </form>
      </div>

      <div className="mt-6 border rounded shadow-sm bg-white p-4">
        <h3 className="text-lg font-medium text-gray-800 mb-2">
          Kết quả tìm kiếm xe phù hợp:
        </h3>
        {isLoadingVehicles && (
          <p className="text-gray-500">Đang tải danh sách xe...</p>
        )}
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
                    <p className="text-xs text-gray-500 mt-1">
                      Ghi chú: {item.vehicle.vehicleCondition}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveVehicleClick(item.vehicle.id)}
                    className="px-3 py-1 rounded text-white text-sm bg-red-500 hover:bg-red-600 transition duration-150 ease-in-out"
                  >
                    Bỏ Chọn
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        {!isLoadingVehicles && availableVehicles.length > 0 && (
          <div className=" mt-20 space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {availableVehicles.map((vehicle) => (
              <div
                key={`available-${vehicle.id}`}
                className="border rounded p-3 flex flex-col md:flex-row justify-between md:items-center bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mr-3 flex-shrink-0 w-24 h-24 md:w-32 md:h-32">
                  {vehicle.vehicleImages && vehicle.vehicleImages.length > 0 ? (
                    (() => {
                      const thumbnail = vehicle.vehicleImages.find(
                        (img) => img.isThumbnail
                      );
                      return (
                        thumbnail &&
                        thumbnail.imageUri && (
                          <img
                            src={thumbnail.imageUri}
                            alt={vehicle.name}
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
                      Mô tả:{" "}
                      {vehicle.description.length > 50
                        ? `${vehicle.description.substring(0, 50)}...`
                        : vehicle.description}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleSelectVehicleClick(vehicle)}
                  className="px-3 py-1 rounded text-white text-sm bg-blue-500 hover:bg-blue-600 transition duration-150 ease-in-out"
                >
                  Chọn Xe
                </button>
              </div>
            ))}
          </div>
        )}

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
    </div>
  );
};
