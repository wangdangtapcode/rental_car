package com.springboot.backend.Service.impl;

import com.springboot.backend.Model.*;
import com.springboot.backend.Repository.CustomerRepository;
import com.springboot.backend.Repository.EmployeeRepository;
import com.springboot.backend.Repository.RentalContractRepository;
import com.springboot.backend.Repository.VehicleRepository;
import com.springboot.backend.Service.RentalContractService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

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
    public List<RentalContract> getContractBookingByFullNameCustomer(String name) {
        return rentalContractRepository.findByCustomerNameAndStatusWithFetch(name,"BOOKING");
    }

    @Override
    public List<RentalContract> getContractActiveByFullNameCustomer(String name) {
        return rentalContractRepository.findByCustomerNameAndStatusWithFetch(name,"ACTIVE");
    }
}
