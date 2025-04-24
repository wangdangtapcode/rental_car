import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
export const VehicleList = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRandomVehicles = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/api/vehicle/all`
        );
        console.log(response.data);
        setVehicles(response.data);
        setLoading(false);
      } catch (err) {
        setError("Không thể tải dữ liệu xe. Vui lòng thử lại sau.");
        setLoading(false);
        console.error("Error fetching vehicles:", err);
      }
    };

    fetchRandomVehicles();
  }, []);

  // Function to truncate description
  const truncateDescription = (text, maxLength = 100) => {
    if (!text) return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };
  const handleClickVehicle = (id) => {
    navigate(`/vehicle/view/${id}`);
  };
  return (
    <div className="flex flex-col min-h-screen mx-10 my-10">
      <main className="flex-1 p-6">
        <h2 className="text-2xl font-semibold mb-6">Danh sách xe đang có</h2>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:bg-gray-200 transition"
                onClick={() => handleClickVehicle(vehicle.id)}
              >
                <div className="h-48 overflow-hidden">
                  {vehicle.vehicleImages &&
                  vehicle.vehicleImages.length > 0 &&
                  vehicle.vehicleImages[0].imageUri ? (
                    <img
                      src={vehicle.vehicleImages[0].imageUri}
                      alt={vehicle.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">Không có ảnh</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">
                    {vehicle.name} {vehicle.type} {vehicle.manufactureYear}
                  </h3>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Thương hiệu:</span>{" "}
                      {vehicle.brand}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Loại xe:</span>{" "}
                      {vehicle.type}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Số ghế:</span>{" "}
                      {vehicle.seatCount}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      {truncateDescription(vehicle.description)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
