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
//
//                Vehicle vehicle = vehicleRepository.findById(contractVehicleDetail.getVehicle().getId())
//                        .orElseThrow(() -> new RuntimeException("Vehicle not found"));
//
//                vehicle.setVehicleCondition(contractVehicleDetail.getVehicle().getVehicleCondition());
//                vehicleRepository.save(vehicle);
//                contractVehicleDetail.setVehicle(vehicle);
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
//                Vehicle vehicle = vehicleRepository.findById(contractVehicleDetail.getVehicle().getId())
//                        .orElseThrow(() -> new RuntimeException("Vehicle not found"));

                // Cập nhật trạng thái và tình trạng xe
//                vehicle.setVehicleCondition(contractVehicleDetail.getVehicle().getVehicleCondition());
//                vehicleRepository.save(vehicle);
                for (ContractVehicleDetail detail : rentalContractReal.getContractVehicleDetails()) {
                    if (detail.getVehicle().getId().equals(contractVehicleDetail.getVehicle().getId())) {
                        detail.setStatus("ACTIVE");
                        detail.setConditionNotes(contractVehicleDetail.getConditionNotes());
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

        return rentalContracts;
    }
}
