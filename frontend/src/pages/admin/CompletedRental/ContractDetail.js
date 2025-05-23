import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

export const ContractDetailPage = () => {
  const currentUser = useSelector((state) => state.user.user);
  const { contractId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [contractDetails, setContractDetails] = useState(null);
  const [vehiclesInContract, setVehiclesInContract] = useState([]);
  const [penaltyTypes, setPenaltyTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [returningVehicle, setReturningVehicle] = useState(null);

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

      // Fetch active vehicles for this contract
      const activeVehiclesResp = await axios.get(
        `http://localhost:8081/api/rentalContract/${contractData.id}/activeVehicles`
      );

      const penaltyResp = await axios.get(
        "http://localhost:8081/api/penalty-types/all"
      );
      const typesData = penaltyResp.data;
      console.log("Dữ liệu hợp đồng:", contractData);
      console.log("Dữ liệu loại phạt:", typesData);
      console.log("Xe đang hoạt động:", activeVehiclesResp.data);

      setContractDetails(contractData);
      setPenaltyTypes(typesData);
      setVehiclesInContract(
        activeVehiclesResp.data || contractData.contractVehicleDetails || []
      );
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu:", err);
      setError(
        err.response?.data?.message || "Không thể tải dữ liệu từ máy chủ."
      );
    } finally {
      setIsLoading(false);
    }
  }, [contractId, location.state, navigate]);

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
                      updatedPenalty.note = selectedType.description;
                    }
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

  // Function to handle returning a single vehicle
  const handleReturnSingleVehicle = useCallback((vehicleDetail) => {
    setReturningVehicle(vehicleDetail);
    setVehiclesInContract((prevVehicles) =>
      prevVehicles.map((vd) => {
        if (vd.id === vehicleDetail.id) {
          return {
            ...vd,
            penalties: vd.penalties || [],
            isReturning: true,
            actualReturnDate: new Date().toISOString().split("T")[0],
          };
        }
        return vd;
      })
    );
  }, []);

  // Function to confirm a single vehicle return
  const confirmVehicleReturn = useCallback(
    async (vehicleDetail) => {
      try {
        if (!currentUser || !currentUser.id) {
          setError("Bạn cần đăng nhập để thực hiện thao tác này");
          return;
        }

        const returnData = {
          returnDate: vehicleDetail.actualReturnDate,
          penalties: vehicleDetail.penalties.map((p) => ({
            penaltyTypeId: p.penaltyType.id,
            amount: p.penaltyAmount,
            note: p.note,
          })),
        };

        // Gửi yêu cầu kiểm tra và xác nhận xe được trả (chưa tạo hóa đơn)
        const response = await axios.post(
          `http://localhost:8081/api/rentalContract/returnVehicle/${vehicleDetail.id}?employeeId=${currentUser.id}`,
          returnData
        );

        if (response.data === "Trả xe thành công") {
          // Cập nhật trạng thái xe trong state
          const updatedVehicleDetail = {
            ...vehicleDetail,
            status: "PENDING_RETURN",
          };

          // Chuyển đến trang tạo hóa đơn để xác nhận thanh toán
          navigate(`/completedRental/invoice/single/${vehicleDetail.id}`, {
            state: {
              vehicleDetail: updatedVehicleDetail,
              contract: contractDetails,
            },
          });
        } else {
          setError("Có lỗi xảy ra khi kiểm tra xe. Vui lòng thử lại.");
        }
      } catch (err) {
        console.error("Lỗi khi trả xe:", err);
        setError("Không thể trả xe. Vui lòng thử lại sau.");
      }
    },
    [contractDetails, navigate, currentUser]
  );

  // Function to cancel returning a vehicle
  const cancelVehicleReturn = useCallback((vehicleDetailId) => {
    setVehiclesInContract((prevVehicles) =>
      prevVehicles.map((vd) => {
        if (vd.id === vehicleDetailId) {
          const { isReturning, ...rest } = vd;
          return rest;
        }
        return vd;
      })
    );
    setReturningVehicle(null);
  }, []);

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
      status: "COMPLETED",
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

      <h3 className="text-lg font-medium my-4 text-gray-800">
        Danh sách xe trong hợp đồng
      </h3>

      {error && (
        <div className="my-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {vehiclesInContract.length > 0 ? (
        vehiclesInContract.map((vehicleDetail) => (
          <div
            key={vehicleDetail.id}
            className="mb-6 p-4 border border-gray-200 rounded-lg shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-md font-medium text-gray-800">
                {vehicleDetail.vehicle?.name} -{" "}
                {vehicleDetail.vehicle?.licensePlate}
              </h4>
              <div className="flex space-x-2">
                {vehicleDetail.status === "ACTIVE" &&
                  !vehicleDetail.isReturning && (
                    <button
                      onClick={() => handleReturnSingleVehicle(vehicleDetail)}
                      className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                    >
                      Trả Xe Này
                    </button>
                  )}
                {vehicleDetail.status === "PENDING_RETURN" &&
                  !vehicleDetail.isReturning && (
                    <button
                      onClick={() =>
                        navigate(
                          `/completedRental/invoice/single/${vehicleDetail.id}`,
                          {
                            state: {
                              vehicleDetail,
                              contract: contractDetails,
                            },
                          }
                        )
                      }
                      className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                    >
                      Thanh Toán Xe Này
                    </button>
                  )}
                {vehicleDetail.status === "PENDING_RETURN" && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded">
                    Đang Chờ Thanh Toán
                  </span>
                )}
                {vehicleDetail.status === "RETURNED" && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded">
                    Đã Trả Ngày{" "}
                    {new Date(
                      vehicleDetail.actualReturnDate
                    ).toLocaleDateString("vi-VN")}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <span className="font-medium">Ngày thuê:</span>{" "}
                {vehicleDetail.startDate
                  ? new Date(vehicleDetail.startDate).toLocaleDateString(
                      "vi-VN"
                    )
                  : "N/A"}
              </div>
              <div>
                <span className="font-medium">Ngày trả dự kiến:</span>{" "}
                {vehicleDetail.endDate
                  ? new Date(vehicleDetail.endDate).toLocaleDateString("vi-VN")
                  : "N/A"}
              </div>
            </div>

            {vehicleDetail.isReturning && (
              <div className="mt-4 p-3 border border-blue-200 rounded-lg bg-blue-50">
                <h5 className="font-medium text-blue-800 mb-3">
                  Thông tin trả xe
                </h5>

                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày trả thực tế:
                  </label>
                  <input
                    type="date"
                    value={vehicleDetail.actualReturnDate}
                    onChange={(e) => {
                      setVehiclesInContract((prev) =>
                        prev.map((vd) =>
                          vd.id === vehicleDetail.id
                            ? { ...vd, actualReturnDate: e.target.value }
                            : vd
                        )
                      );
                    }}
                    className="border rounded px-2 py-1 w-full"
                  />
                </div>

                <h5 className="font-medium text-gray-700 mb-2">
                  Các lỗi vi phạm (nếu có)
                </h5>

                {vehicleDetail.penalties &&
                  vehicleDetail.penalties.map((penalty, idx) => (
                    <div
                      key={penalty.tempId || idx}
                      className="mb-3 p-2 border border-gray-200 rounded bg-white"
                    >
                      <div className="grid grid-cols-2 gap-3 mb-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Loại lỗi:
                          </label>
                          <select
                            className="border rounded px-2 py-1 w-full"
                            value={penalty.penaltyType?.id || ""}
                            onChange={(e) =>
                              handlePenaltyChange(
                                vehicleDetail.id,
                                penalty.tempId,
                                "penaltyType",
                                e.target.value
                              )
                            }
                          >
                            <option value="">Chọn loại lỗi</option>
                            {penaltyTypes.map((type) => (
                              <option key={type.id} value={type.id}>
                                {type.name} (
                                {type.defaultAmount.toLocaleString()} VND)
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tiền phạt (VND):
                          </label>
                          <input
                            type="number"
                            className="border rounded px-2 py-1 w-full"
                            value={penalty.penaltyAmount || 0}
                            onChange={(e) =>
                              handlePenaltyChange(
                                vehicleDetail.id,
                                penalty.tempId,
                                "penaltyAmount",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex-grow">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ghi chú:
                          </label>
                          <input
                            type="text"
                            className="border rounded px-2 py-1 w-full"
                            value={penalty.note || ""}
                            onChange={(e) =>
                              handlePenaltyChange(
                                vehicleDetail.id,
                                penalty.tempId,
                                "note",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <button
                          onClick={() =>
                            handleRemovePenalty(
                              vehicleDetail.id,
                              penalty.tempId
                            )
                          }
                          className="ml-2 mt-5 px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  ))}

                <div className="flex justify-between mt-3">
                  <button
                    onClick={() => handleAddPenalty(vehicleDetail.id)}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  >
                    + Thêm lỗi
                  </button>
                  <div className="space-x-2">
                    <button
                      onClick={() => cancelVehicleReturn(vehicleDetail.id)}
                      className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={() => confirmVehicleReturn(vehicleDetail)}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Xác Nhận Trả Xe
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-500 italic">
          Không có xe nào trong hợp đồng này.
        </p>
      )}

      <div className="mt-6 flex justify-between">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          Quay lại
        </button>
        {vehiclesInContract.some(
          (v) => v.status === "ACTIVE" && !v.isReturning
        ) && (
          <button
            onClick={goToSummaryPage}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={returningVehicle !== null}
          >
            Trả Tất Cả Xe & Tạo Hóa Đơn
          </button>
        )}
      </div>
    </div>
  );
};
