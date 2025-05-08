import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export const ContractDetailPage = () => {
  const { contractId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [contractDetails, setContractDetails] = useState(null);
  const [vehiclesInContract, setVehiclesInContract] = useState([]);
  const [penaltyTypes, setPenaltyTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let contractData = location.state?.contract;

      if (!contractData) {
        setError("Không tìm thấy thông tin hợp đồng.");
        setTimeout(() => navigate(-1), 2000);
        return;
      }

      const penaltyResp = await axios.get(
        "http://localhost:8081/api/penalty-types/all"
      );
      const typesData = penaltyResp.data;
      console.log("Dữ liệu hợp đồng:", contractData);
      console.log("Dữ liệu loại phạt:", typesData);
      setContractDetails(contractData);
      setPenaltyTypes(typesData);
      setVehiclesInContract(contractData.contractVehicleDetails || []);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu:", err);
      setError(
        err.response?.data?.message || "Không thể tải dữ liệu từ máy chủ."
      );
    } finally {
      setIsLoading(false);
    }
  }, [contractId, location.state]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddPenalty = useCallback((contractVehicleDetailId) => {
    setVehiclesInContract((prevVehicles) =>
      prevVehicles.map((vehicleDetail) => {
        if (vehicleDetail.id === contractVehicleDetailId) {
          return {
            ...vehicleDetail,
            penalties: [
              ...vehicleDetail.penalties,
              {
                tempId: Date.now(),
                penaltyType: {},
                penaltyAmount: 0,
                note: "",
                isDirty: true,
              },
            ],
          };
        }
        return vehicleDetail;
      })
    );
  }, []);

  const handleRemovePenalty = useCallback(
    (contractVehicleDetailId, tempPenaltyId) => {
      setVehiclesInContract((prevVehicles) =>
        prevVehicles.map((vehicleDetail) => {
          if (vehicleDetail.id === contractVehicleDetailId) {
            return {
              ...vehicleDetail,
              penalties: vehicleDetail.penalties.filter(
                (p) => p.tempId !== tempPenaltyId
              ),
            };
          }
          return vehicleDetail;
        })
      );
    },
    []
  );

  const handlePenaltyChange = useCallback(
    (contractVehicleDetailId, tempPenaltyId, field, value) => {
      setVehiclesInContract((prevVehicles) =>
        prevVehicles.map((vehicleDetail) => {
          if (vehicleDetail.id === contractVehicleDetailId) {
            return {
              ...vehicleDetail,
              penalties: vehicleDetail.penalties.map((penalty) => {
                if (penalty.tempId === tempPenaltyId) {
                  const updatedPenalty = { ...penalty };

                  if (field === "penaltyType") {
                    const selectedType = penaltyTypes.find(
                      (pt) => pt.id.toString() === value
                    );
                    if (selectedType) {
                      updatedPenalty.penaltyType = selectedType;
                      if (selectedType.defaultAmount > 0) {
                        updatedPenalty.penaltyAmount =
                          selectedType.defaultAmount;
                      }
                    }
                    updatedPenalty.note = selectedType.description;
                  }

                  if (field === "penaltyAmount") {
                    updatedPenalty.penaltyAmount = parseFloat(value) || 0;
                  }

                  if (field === "note") {
                    updatedPenalty.note = value;
                  }

                  return updatedPenalty;
                }
                return penalty;
              }),
            };
          }
          return vehicleDetail;
        })
      );
    },
    [penaltyTypes]
  );

  const goToSummaryPage = () => {
    let hasIncompletePenalty = false;
    vehiclesInContract.forEach((vd) => {
      vd.penalties.forEach((p) => {
        if (!p.penaltyType || !p.penaltyAmount || p.penaltyAmount <= 0) {
          hasIncompletePenalty = true;
        }
      });
    });
    if (hasIncompletePenalty) {
      setError(
        "Vui lòng chọn loại phạt và nhập số tiền phạt hợp lệ (> 0) cho tất cả các lỗi đã thêm."
      );
      return;
    }
    setError(null);

    const updatedContract = {
      ...contractDetails,
      contractVehicleDetails: vehiclesInContract.map((vehicleDetail) => ({
        ...vehicleDetail,
        penalties: (vehicleDetail.penalties || []).map((penalty) => {
          const { tempId, isDirty, ...cleanPenalty } = penalty;
          return cleanPenalty;
        }),
      })),
    };

    console.log("Dữ liệu phạt sẽ được chuyển:", updatedContract);

    navigate(`/completedRental/invoice/${contractId}`, {
      state: { contract: updatedContract },
    });
  };

  if (isLoading)
    return (
      <p className="text-center mt-10 text-gray-600">
        Đang tải thông tin hợp đồng...
      </p>
    );
  if (error && !contractDetails)
    return <p className="mt-10 text-center text-red-600">Lỗi: {error}</p>;
  if (!contractDetails)
    return (
      <p className="text-center mt-10 text-gray-600">
        Không có thông tin hợp đồng.
      </p>
    );

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-5 text-center">
        Chi tiết Hợp đồng Trả Xe - Mã HĐ: {contractDetails.id}
      </h2>
      <div className="mb-6 p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
        <h3 className="text-lg font-medium mb-3 text-gray-800">
          Thông tin Hợp đồng
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <p>
              <span className="font-semibold text-gray-600">Khách hàng:</span>{" "}
              {contractDetails.customer?.user?.fullName || "N/A"}
            </p>

            <p>
              <span className="font-semibold text-gray-600">Ngày bắt đầu:</span>{" "}
              {contractDetails.startDate}
            </p>
            <p>
              <span className="font-semibold text-gray-600">
                Ngày kết thúc:
              </span>{" "}
              {contractDetails.endDate}
            </p>
            <p>
              <span className="font-semibold text-gray-600">Trạng thái:</span>
              <span
                className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${
                  contractDetails.status === "ACTIVE"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {contractDetails.status}
              </span>
            </p>
            <p>
              <span className="font-semibold text-gray-600">
                Nhân viên tạo:
              </span>{" "}
              {contractDetails.employee?.user?.fullName || "N/A"}
            </p>
            <p>
              <span className="font-semibold text-gray-600">Ngày tạo:</span>{" "}
              {contractDetails.createdDate}
            </p>
          </div>

          <div className="space-y-2">
            <p>
              <span className="font-semibold text-gray-600">
                Tiền cọc đã trả:
              </span>{" "}
              {contractDetails.depositAmount?.toLocaleString() || 0} VND
            </p>
            <p>
              <span className="font-semibold text-gray-600">
                Tổng Tiền ước tính:
              </span>{" "}
              {contractDetails.totalEstimatedAmount?.toLocaleString() || 0} VND
            </p>
            <p>
              <span className="font-semibold text-gray-600">
                Tiền còn phải trả:
              </span>{" "}
              {contractDetails.dueAmount?.toLocaleString() || 0} VND
            </p>
            <div>
              <span className="font-semibold text-gray-600">
                Tài sản thế chấp:
              </span>
              {contractDetails.collaterals?.length > 0 ? (
                <ul className="list-disc list-inside ml-4 mt-1">
                  {contractDetails.collaterals.map((c) => (
                    <li key={c.id}>{c.description}</li>
                  ))}
                </ul>
              ) : (
                <span className="ml-2 text-gray-500">Không có</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {error && <p className="mb-4 text-center text-red-600">Lỗi: {error}</p>}

      <h3 className="text-xl font-medium mb-4 text-gray-800">
        Kiểm tra & Ghi nhận Phí phát sinh
      </h3>
      <div className="space-y-5">
        {vehiclesInContract.map((vehicleDetail) => (
          <div
            key={vehicleDetail.id}
            className="border border-gray-300 p-4 rounded-lg shadow bg-white"
          >
            <h4 className="text-lg font-semibold mb-2">
              {vehicleDetail.vehicle?.name || "N/A"}{" "}
              {vehicleDetail.vehicle?.type || "N/A"}{" "}
              {vehicleDetail.vehicle?.manufactureYear || "N/A"} (
              {vehicleDetail.vehicle?.licensePlate || "N/A"})
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              Giá thuê trong HĐ:{" "}
              {vehicleDetail.rentalPrice?.toLocaleString() || 0} VND
            </p>
            <div className="mb-4">
              <img
                src={
                  vehicleDetail.vehicle.vehicleImages.find(
                    (img) => img.isThumbnail
                  )?.imageUri || ""
                }
                alt={`Ảnh xe ${vehicleDetail.vehicle?.name || ""}`}
                className="w-32 h-20 object-cover rounded border border-gray-300 bg-gray-100 text-gray-400 flex items-center justify-center text-xs italic"
              />
            </div>

            <div>
              <strong className="text-sm font-medium text-gray-700 block mb-2">
                Phí phạt/Chi phí phát sinh mới:
              </strong>
              {vehicleDetail.penalties.map((penalty) => (
                <div
                  key={penalty.id}
                  className="border border-dashed border-gray-300 my-3 p-3 rounded bg-gray-50 relative"
                >
                  <button
                    onClick={() =>
                      handleRemovePenalty(vehicleDetail.id, penalty.tempId)
                    }
                    className="absolute top-1 right-1 text-red-500 hover:text-red-700 text-xl font-bold leading-none p-1"
                    title="Xóa lỗi này"
                  >
                    ×
                  </button>
                  <div className="grid grid-cols-3  gap-3 items-center">
                    {/* Loại phạt */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Loại phạt
                      </label>
                      <select
                        value={penalty.penaltyType.id || ""}
                        onChange={(e) =>
                          handlePenaltyChange(
                            vehicleDetail.id,
                            penalty.tempId,
                            "penaltyType",
                            e.target.value
                          )
                        }
                        required
                        className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">-- Chọn --</option>
                        {penaltyTypes.map((pt) => (
                          <option key={pt.id} value={pt.id}>
                            {pt.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* Số tiền */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Số tiền (VND)
                      </label>
                      <input
                        type="number"
                        value={penalty.penaltyAmount}
                        onChange={(e) =>
                          handlePenaltyChange(
                            vehicleDetail.id,
                            penalty.tempId,
                            "penaltyAmount",
                            e.target.value
                          )
                        }
                        placeholder="Nhập số tiền"
                        min="0"
                        step="1000"
                        required
                        className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    {/* Ghi chú */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Ghi chú
                      </label>
                      <input
                        type="text"
                        value={penalty.note}
                        onChange={(e) =>
                          handlePenaltyChange(
                            vehicleDetail.id,
                            penalty.tempId,
                            "note",
                            e.target.value
                          )
                        }
                        placeholder="Mô tả lỗi/vi phạm..."
                        className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={() => handleAddPenalty(vehicleDetail.id)}
                className="mt-2 py-1 px-3 bg-blue-100 text-blue-700 text-sm rounded hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
              >
                + Thêm lỗi/phát sinh
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={goToSummaryPage}
          className="py-2 px-6 text-lg bg-indigo-600 text-white rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60"
          disabled={vehiclesInContract.length === 0}
        >
          Tiếp tục đến trang Tính toán & Hoàn tất
        </button>
      </div>
    </div>
  );
};
