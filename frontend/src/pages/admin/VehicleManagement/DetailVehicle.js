import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import axios from "axios";
export const DetailVehicle = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [vehicle, setVehicle] = useState({
    id: "",
    name: "",
    licensePlate: "",
    brand: "",
    type: "",
    seatCount: "",
    manufactureYear: "",
    description: "",
    rentalPrice: "",
    vehicleCondition: "",
    ownerType: "",
    status: "",
    vehicleImages: [],
  });
  useEffect(() => {
    if (id) {
      const fetchVehicle = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8081/api/management/vehicle/detail/${id}`
          );
          if (response.data) {
            const data = response.data;
            console.log(data);
            setVehicle({
              id: data.id || "",
              name: data.name || "",
              licensePlate: data.licensePlate || "",
              brand: data.brand || "",
              type: data.type || "",
              seatCount: data.seatCount || "",
              manufactureYear: data.manufactureYear || "",
              description: data.description || "",
              rentalPrice: data.rentalPrice || "",
              vehicleCondition: data.vehicleCondition || "",
              ownerType: data.ownerType || "",
              status: data.status || "",
              vehicleImages: data.vehicleImages.map((img, index) => ({
                id: img.id,
                name: img.name,
                type: img.type,
                url: img.base64Image
                  ? `data:${img.type};base64,${img.base64Image}`
                  : "",
                isThumbnail: img.isThumbnail,
                file: null,
              })),
            });
            // setThumbnailIndex(
            //   data.vehicleImages.findIndex((img) => img.isThumbnail) !== -1
            //     ? data.vehicleImages.findIndex((img) => img.isThumbnail)
            //     : null
            // );
          } else {
            console.error("Failed to fetch vehicle:", await response.text());
          }
        } catch (error) {
          console.error("Error fetching vehicle:", error);
        }
      };
      fetchVehicle();
    }
  }, [id]);
  const [current, setCurrent] = useState(0);
  const thumbnailImg = vehicle.vehicleImages.find((img) => img.isThumbnail);
  const otherImgs = vehicle.vehicleImages.filter((img) => !img.isThumbnail);
  console.log(otherImgs);
  const allImages = thumbnailImg
    ? [thumbnailImg.url, ...otherImgs.map((img) => img.url)]
    : otherImgs.map((img) => img.url);
  const prev = () => {
    setCurrent((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const next = () => {
    setCurrent((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };
  const [showFullDescription, setShowFullDescription] = useState(false);
  const renderDescription = () => {
    // Nếu không có description, trả về thông báo
    if (!vehicle.description)
      return <p className="text-gray-500 italic">Không có mô tả</p>;

    // Tách description thành mảng các dòng
    const lines = vehicle.description.split("\n");

    // Hiển thị mô tả rút gọn hoặc đầy đủ
    const displayLines = showFullDescription ? lines : lines.slice(0, 3);

    return (
      <div className="space-y-1">
        {displayLines.map((line, index) => (
          <p
            key={index}
            className={`${line.trim().endsWith(":") ? "font-medium" : ""}`}
          >
            {line.trim() || <br />}
          </p>
        ))}

        {/* Hiển thị nút "Xem thêm" nếu có nhiều dòng */}
        {lines.length > 3 && (
          <button
            onClick={() => setShowFullDescription(!showFullDescription)}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm mt-2"
          >
            {showFullDescription
              ? "Thu gọn"
              : `Xem thêm (${lines.length - 3} dòng)`}
          </button>
        )}
      </div>
    );
  };
  return (
    <div className="w-full h-full mx-auto p-6 bg-white rounded shadow relative">
      <FaRegEdit
        className=" absolute top-2 right-2 text-yellow-500 cursor-pointer text-2xl"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/admin/management/vehicle/edit/${id}`);
        }}
      />
      <h1 className="text-2xl text-center font-bold ">Chi tiết xe</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full mx-auto p-4 mt-10">
        {/* Bên trái: Slider ảnh */}
        {vehicle.vehicleImages.length > 0 ? (
          <div className="w-full relative">
            <img
              src={allImages[current]}
              alt="vehicle"
              className="w-full h-80 object-cover rounded-xl shadow"
            />
            {allImages.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/70 p-2 rounded-full shadow hover:bg-white"
                >
                  ◀
                </button>
                <button
                  onClick={next}
                  className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/70 p-2 rounded-full shadow hover:bg-white"
                >
                  ▶
                </button>
              </>
            )}

            <div className="flex gap-2 mt-4 justify-center flex-wrap">
              {allImages.map((img, index) => (
                <img
                  src={img}
                  onClick={() => setCurrent(index)}
                  className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                    index === current ? "border-blue-500" : "border-transparent"
                  }`}
                  alt={`vehicle`}
                />
              ))}
            </div>
          </div>
        ) : (
          <h2 className="w-full text-center"> Xe chưa có ảnh</h2>
        )}

        {/* Bên phải: Thông tin xe */}
        <div className="grid grid-cols-1 gap-4 text-sm text-gray-700">
          <div className=" text-lg ml-20 space-y-4">
            <p>
              <strong>Xe:</strong> {vehicle.name} {vehicle.type}{" "}
              {vehicle.manufactureYear}
            </p>
            <p>
              <strong>Hãng:</strong> {vehicle.brand}
            </p>
            <p>
              <strong>Biển số:</strong> {vehicle.licensePlate}
            </p>
            <p>
              <strong>Số chỗ:</strong> {vehicle.seatCount}
            </p>
            <p>
              <strong>Tình trạng:</strong> {vehicle.vehicleCondition}
            </p>

            <p className="flex items-center gap-2">
              <strong>Trạng thái:</strong>
              <span
                className={`px-2 py-0.5 text-xs font-medium rounded-full 
          ${
            vehicle.status === "ACTIVE"
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
              >
                {vehicle.status === "ACTIVE"
                  ? "Đang hoạt động"
                  : "Ngừng hoạt động"}
              </span>
            </p>

            <p>
              <strong>Chủ xe:</strong> {vehicle.ownerType}
            </p>

            <div className="inline-block bg-yellow-400 border border-yellow-700 rounded-lg p-3 mt-2">
              <p className="text-yellow-800 font-semibold ">
                Giá thuê: {vehicle.rentalPrice?.toLocaleString()} vnd/ngày
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="my-6">
        <h3 className="text-lg font-semibold mb-4 border-b pb-2">
          Mô tả chi tiết
        </h3>
        <div className="bg-gray-50 p-4 rounded-md">{renderDescription()}</div>
      </div>
    </div>
  );
};
