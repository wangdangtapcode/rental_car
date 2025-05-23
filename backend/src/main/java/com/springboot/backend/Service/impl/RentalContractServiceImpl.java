package com.springboot.backend.Service.impl;

import com.springboot.backend.Model.*;
import com.springboot.backend.Repository.*;
import com.springboot.backend.Service.RentalContractService;
import com.springboot.backend.Utils.ImageUtils;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RentalContractServiceImpl implements RentalContractService {
    @Autowired
    private final RentalContractRepository rentalContractRepository;
    @Autowired
    private final CustomerRepository customerRepository;
    @Autowired
    private final EmployeeRepository employeeRepository;
    @Autowired
    private final VehicleRepository vehicleRepository;
    @Autowired
    private final ContractVehicleDetailRepository contractVehicleDetailRepository;
    @Autowired
    private final InvoiceDetailRepository invoiceDetailRepository;

    @Override
    @Transactional
    public boolean createRentalContract(RentalContract rentalContract) {
        try {
            Customer customer = customerRepository.findById(rentalContract.getCustomer().getId())
                    .orElseThrow(() -> new RuntimeException("Customer not found"));

            rentalContract.setCustomer(customer);

            Employee employee = employeeRepository.findById(rentalContract.getEmployee().getId())
                    .orElseThrow(() -> new RuntimeException("Employee not found"));

            rentalContract.setEmployee(employee);

            for (ContractVehicleDetail contractVehicleDetail : rentalContract.getContractVehicleDetails()) {

                Vehicle vehicle = vehicleRepository.findById(contractVehicleDetail.getVehicle().getId())
                        .orElseThrow(() -> new RuntimeException("Vehicle not found"));
                vehicle.setStatus("RENTED");
                vehicle.setVehicleCondition(contractVehicleDetail.getVehicle().getVehicleCondition());
                vehicleRepository.save(vehicle);
                contractVehicleDetail.setVehicle(vehicle);
                contractVehicleDetail.setRentalContract(rentalContract);
            }
            List<Collateral> collaterals = rentalContract.getCollaterals();
            for (Collateral collateral : collaterals) {
                collateral.setRentalContract(rentalContract);
            }
            rentalContract.setCollaterals(collaterals);

            rentalContractRepository.save(rentalContract);

            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    @Transactional
    public boolean updateContract(RentalContract rentalContract) {
        try {
            RentalContract rentalContractReal = rentalContractRepository.findById(rentalContract.getId())
                    .orElseThrow(() -> new RuntimeException("Contract not found"));

            // Cập nhật thông tin nhân viên và trạng thái hợp đồng
            rentalContractReal.setEmployee(rentalContract.getEmployee());
            rentalContractReal.setStatus("ACTIVE");

            // Cập nhật thông tin chi tiết xe
            for (ContractVehicleDetail contractVehicleDetail : rentalContract.getContractVehicleDetails()) {
                // Lấy thông tin xe
                Vehicle vehicle = vehicleRepository.findById(contractVehicleDetail.getVehicle().getId())
                        .orElseThrow(() -> new RuntimeException("Vehicle not found"));

                // Cập nhật trạng thái và tình trạng xe
                vehicle.setStatus("RENTED");
                vehicle.setVehicleCondition(contractVehicleDetail.getVehicle().getVehicleCondition());
                vehicleRepository.save(vehicle);
                for (ContractVehicleDetail detail : rentalContractReal.getContractVehicleDetails()){
                    if(detail.getVehicle().getId().equals(vehicle.getId())){
                        detail.setVehicle(vehicle);
                        detail.setStatus("ACTIVE");
                        detail.setRentalContract(rentalContractReal);
                        break;
                    }
                }
            }
            // Lưu hợp đồng
            rentalContractRepository.save(rentalContractReal);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    @Transactional
    public boolean returnVehicle(Long contractVehicleDetailId, Long employeeId, LocalDate returnDate,
            List<Map<String, Object>> penalties) {
        try {
            // Tìm thông tin xe cần trả
            ContractVehicleDetail contractVehicleDetail = getContractVehicleDetail(contractVehicleDetailId);
            if (contractVehicleDetail == null) {
                throw new EntityNotFoundException(
                        "Không tìm thấy thông tin xe thuê với ID: " + contractVehicleDetailId);
            }

            // Kiểm tra trạng thái
            if (!"ACTIVE".equals(contractVehicleDetail.getStatus())) {
                throw new RuntimeException("Xe này không trong trạng thái đang thuê");
            }

            // Tìm hợp đồng
            RentalContract rentalContract = contractVehicleDetail.getRentalContract();

            // Tìm nhân viên
            Employee employee = employeeRepository.findById(employeeId)
                    .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy nhân viên với ID: " + employeeId));

            // Cập nhật thông tin xe - chuyển sang trạng thái chờ trả (PENDING_RETURN)
            contractVehicleDetail.setStatus("PENDING_RETURN");
            contractVehicleDetail.setActualReturnDate(returnDate);

            // Xử lý tiền phạt (nếu có)
            if (penalties != null && !penalties.isEmpty()) {
                for (Map<String, Object> penaltyData : penalties) {
                    Penalty penalty = new Penalty();
                    penalty.setPenaltyAmount(Float.valueOf(penaltyData.get("amount").toString()));
                    penalty.setNote(penaltyData.get("note").toString());

                    // Kiểm tra và set PenaltyType nếu có
                    if (penaltyData.containsKey("penaltyTypeId")) {
                        PenaltyType penaltyType = new PenaltyType();
                        penaltyType.setId(Long.valueOf(penaltyData.get("penaltyTypeId").toString()));
                        penalty.setPenaltyType(penaltyType);
                    }

                    penalty.setContractVehicleDetail(contractVehicleDetail);
                    contractVehicleDetail.getPenalties().add(penalty);
                }
            }

            // Lưu thông tin mà không tạo hóa đơn hoặc cập nhật trạng thái xe
            rentalContractRepository.save(rentalContract);

            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public ContractVehicleDetail getContractVehicleDetail(Long id) {
        try {
            // Lấy chi tiết xe thuê từ hợp đồng
            RentalContract contract = rentalContractRepository.findContractByVehicleDetailId(id);
            if (contract == null) {
                return null;
            }

            // Tìm chi tiết xe trong danh sách
            ContractVehicleDetail targetDetail = null;
            for (ContractVehicleDetail detail : contract.getContractVehicleDetails()) {
                if (detail.getId().equals(id)) {
                    targetDetail = detail;
                    break;
                }
            }

            if (targetDetail == null) {
                return null;
            }

            // Fetch vehicle images separately to avoid MultipleBagFetchException
            Vehicle vehicleWithImages = rentalContractRepository
                    .findVehicleWithImagesById(targetDetail.getVehicle().getId());
            if (vehicleWithImages != null && vehicleWithImages.getVehicleImages() != null) {
                // Xử lý hình ảnh
                for (VehicleImage image : vehicleWithImages.getVehicleImages()) {
                    String imgBase64 = ImageUtils.encodeToBase64(image.getImageData());
                    String imageUri = "data:" + image.getType() + ";base64," + imgBase64;
                    image.setImageData(null);
                    image.setImageUri(imageUri);
                }
                // Set the processed images to the vehicle in the target detail
                targetDetail.getVehicle().setVehicleImages(vehicleWithImages.getVehicleImages());
            }

            return targetDetail;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public List<ContractVehicleDetail> getActiveVehiclesForContract(Long contractId) {
        try {
            RentalContract contract = rentalContractRepository.findById(contractId)
                    .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy hợp đồng với ID: " + contractId));

            List<ContractVehicleDetail> activeVehicles = new ArrayList<>();

            for (ContractVehicleDetail detail : contract.getContractVehicleDetails()) {
                if ("ACTIVE".equals(detail.getStatus()) || "PENDING_RETURN".equals(detail.getStatus())) {
                    // Fetch vehicle images separately to avoid MultipleBagFetchException
                    Vehicle vehicleWithImages = rentalContractRepository
                            .findVehicleWithImagesById(detail.getVehicle().getId());
                    if (vehicleWithImages != null && vehicleWithImages.getVehicleImages() != null) {
                        // Xử lý hình ảnh
                        for (VehicleImage image : vehicleWithImages.getVehicleImages()) {
                            String imgBase64 = ImageUtils.encodeToBase64(image.getImageData());
                            String imageUri = "data:" + image.getType() + ";base64," + imgBase64;
                            image.setImageData(null);
                            image.setImageUri(imageUri);
                        }
                        // Set the processed images to the vehicle in the detail
                        detail.getVehicle().setVehicleImages(vehicleWithImages.getVehicleImages());
                    }
                    activeVehicles.add(detail);
                }
            }

            return activeVehicles;
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    @Override
    public List<RentalContract> getContractBookingByFullNameCustomer(String name) {
        List<RentalContract> rentalContracts = rentalContractRepository.findByCustomerNameAndStatusWithFetch(name,
                "BOOKING");
        for (RentalContract contract : rentalContracts) {
            for (ContractVehicleDetail contractVehicleDetail : contract.getContractVehicleDetails()) {
                // Fetch vehicle images separately
                Vehicle vehicleWithImages = rentalContractRepository
                        .findVehicleWithImagesById(contractVehicleDetail.getVehicle().getId());
                if (vehicleWithImages != null && vehicleWithImages.getVehicleImages() != null) {
                    for (VehicleImage image : vehicleWithImages.getVehicleImages()) {
                        String imgBase64 = ImageUtils.encodeToBase64(image.getImageData());
                        String imageUri = "data:" + image.getType() + ";base64," + imgBase64;
                        image.setImageUri(imageUri);
                        image.setImageData(null);
                    }
                    // Set the processed images to the vehicle in contract detail
                    contractVehicleDetail.getVehicle().setVehicleImages(vehicleWithImages.getVehicleImages());
                }
            }
        }
        return rentalContracts;
    }

    @Override
    public List<RentalContract> getContractActiveByFullNameCustomer(String name) {
        // Sử dụng phương thức repository mới để lấy hợp đồng có xe ACTIVE hoặc
        // PENDING_RETURN
        List<RentalContract> rentalContracts = rentalContractRepository
                .findByCustomerNameWithActiveOrPendingVehicles(name);

        // Xử lý hình ảnh xe cho các hợp đồng tìm được
        for (RentalContract contract : rentalContracts) {
            for (ContractVehicleDetail contractVehicleDetail : contract.getContractVehicleDetails()) {
                // Chỉ xử lý xe đang ở trạng thái ACTIVE hoặc PENDING_RETURN
                if ("ACTIVE".equals(contractVehicleDetail.getStatus())
                        || "PENDING_RETURN".equals(contractVehicleDetail.getStatus())) {
                    // Fetch vehicle images separately
                    Vehicle vehicleWithImages = rentalContractRepository
                            .findVehicleWithImagesById(contractVehicleDetail.getVehicle().getId());
                    if (vehicleWithImages != null && vehicleWithImages.getVehicleImages() != null) {
                        for (VehicleImage image : vehicleWithImages.getVehicleImages()) {
                            String imgBase64 = ImageUtils.encodeToBase64(image.getImageData());
                            String imageUri = "data:" + image.getType() + ";base64," + imgBase64;
                            image.setImageData(null);
                            image.setImageUri(imageUri);
                        }
                        // Set the processed images to the vehicle in contract detail
                        contractVehicleDetail.getVehicle().setVehicleImages(vehicleWithImages.getVehicleImages());
                    }
                }
            }
        }

        return rentalContracts;
    }
}
