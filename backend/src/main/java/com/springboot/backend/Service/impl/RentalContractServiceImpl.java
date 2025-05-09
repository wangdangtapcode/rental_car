package com.springboot.backend.Service.impl;

import com.springboot.backend.Model.*;
import com.springboot.backend.Repository.CustomerRepository;
import com.springboot.backend.Repository.EmployeeRepository;
import com.springboot.backend.Repository.RentalContractRepository;
import com.springboot.backend.Repository.VehicleRepository;
import com.springboot.backend.Service.RentalContractService;
import com.springboot.backend.Utils.ImageUtils;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
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
    @Override
    @Transactional
    public boolean createRentalContract(
            Long customerId,
            Long employeeId,
            RentalContract rentalContract,
            List<Map<String, Object>> contractVehicleDetails,
            List<Map<String, Object>> collaterals
    ) {

        if (customerId == null || employeeId == null ) {
            throw new IllegalArgumentException("Required fields are missing");
        }

        Customer customer = customerRepository.findByUserId(customerId)
                .orElseThrow(() -> new EntityNotFoundException("Customer not found with ID: " + customerId));

        Employee employee = employeeRepository.findByUserId(employeeId)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found with ID: " + employeeId));


        rentalContract.setCustomer(customer);
        rentalContract.setEmployee(employee);


        rentalContract.setContractVehicleDetails(new ArrayList<>());
        rentalContract.setCollaterals(new ArrayList<>());


        if (contractVehicleDetails != null) {
            for (Map<String, Object> detail : contractVehicleDetails) {
                Long vehicleId = ((Number) detail.get("vehicleId")).longValue();
                Float rentalPrice = ((Number) detail.get("rentalPrice")).floatValue();
                String vehicleCondition = (String) detail.get("vehicleCondition");
                if (vehicleId == null || rentalPrice == null) {
                    throw new IllegalArgumentException("Vehicle ID or rental price is missing in contract vehicle details");
                }

                Vehicle vehicle = vehicleRepository.findById(vehicleId)
                        .orElseThrow(() -> new EntityNotFoundException("Vehicle not found with ID: " + vehicleId));

                vehicle.setStatus("RENTED");
                vehicle.setVehicleCondition(vehicleCondition);
                vehicleRepository.save(vehicle);

                ContractVehicleDetail contractDetail = new ContractVehicleDetail();
                contractDetail.setVehicle(vehicle);
                contractDetail.setRentalPrice(rentalPrice.floatValue());
                contractDetail.setRentalContract(rentalContract); //

                rentalContract.getContractVehicleDetails().add(contractDetail);
            }

            if (collaterals != null) {
                for (Map<String, Object> collateral : collaterals) {
                    String description = (String) collateral.get("description");

                    if (description == null) {
                        throw new IllegalArgumentException("Collateral description is missing");
                    }

                    Collateral collateralEntity = new Collateral();
                    collateralEntity.setDescription(description);
                    collateralEntity.setRentalContract(rentalContract);

                    rentalContract.getCollaterals().add(collateralEntity);
                }
            }
        }
        try {
            rentalContractRepository.save(rentalContract);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    @Transactional
    public boolean updateContract(Long employeeId,
                                  Long rentalContractId,
                                  List<Map<String, Object>> updatedVehicleConditions) {

        RentalContract rentalContract = rentalContractRepository
                .findById(rentalContractId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hợp đồng thuê"));

        if ( employeeId == null ) {
            throw new IllegalArgumentException("Required fields are missing");
        }
        Employee employee = employeeRepository.findByUserId(employeeId)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found with ID: " + employeeId));

        rentalContract.setEmployee(employee);
        rentalContract.setStatus("ACTIVE");

        if (updatedVehicleConditions != null) {
            for (Map<String, Object> detail : updatedVehicleConditions) {
                Long vehicleId = ((Number) detail.get("vehicleId")).longValue();
                Long contractVehicleDetailId = ((Number) detail.get("contractVehicleDetailId")).longValue();
                String vehicleCondition = (String) detail.get("conditionNotes");
                if (vehicleId == null) {
                    throw new IllegalArgumentException("Vehicle ID is missing in contract vehicle details");
                }
                Vehicle vehicle = vehicleRepository.findById(vehicleId)
                        .orElseThrow(() -> new EntityNotFoundException("Vehicle not found with ID: " + vehicleId));

                vehicle.setVehicleCondition(vehicleCondition);
                vehicleRepository.save(vehicle);
                for (ContractVehicleDetail contractDetail:rentalContract.getContractVehicleDetails() ){
                    if(contractDetail.getId().equals(contractVehicleDetailId)){
                        contractDetail.setVehicle(vehicle);
                        break;
                    }
                }
            }
        }
        try {
            rentalContractRepository.save(rentalContract);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public List<RentalContract> getContractBookingByFullNameCustomer(String name) {
        List<RentalContract> rentalContracts =rentalContractRepository.findByCustomerNameAndStatusWithFetch(name,"BOOKING");
        for (RentalContract contract : rentalContracts) {
            for(ContractVehicleDetail contractVehicleDetail : contract.getContractVehicleDetails()){
                Vehicle vehicle = contractVehicleDetail.getVehicle();
                if (vehicle != null && vehicle.getVehicleImages() != null) {
                    for (VehicleImage image : vehicle.getVehicleImages()) {
                        String imgBase64 = ImageUtils.encodeToBase64(image.getImageData());
                        String imageUri = "data:" + image.getType() + ";base64," + imgBase64;
                        image.setImageData(null);
                        image.setImageUri(imageUri);
                    }
                }
            }
        }


        return rentalContracts;
    }

    @Override
    public List<RentalContract> getContractActiveByFullNameCustomer(String name) {
        List<RentalContract> rentalContracts = rentalContractRepository.findByCustomerNameAndStatusWithFetch(name,"ACTIVE");
        for (RentalContract contract : rentalContracts) {
            for(ContractVehicleDetail contractVehicleDetail : contract.getContractVehicleDetails()){
                Vehicle vehicle = contractVehicleDetail.getVehicle();
                if (vehicle != null && vehicle.getVehicleImages() != null) {
                    for (VehicleImage image : vehicle.getVehicleImages()) {
                        String imgBase64 = ImageUtils.encodeToBase64(image.getImageData());
                        String imageUri = "data:" + image.getType() + ";base64," + imgBase64;
                        image.setImageData(null);
                        image.setImageUri(imageUri);
                    }
                }
            }
        }
        return rentalContracts;
    }
}
