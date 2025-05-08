package com.springboot.backend.Controller;

import com.springboot.backend.Model.RentalContract;
import com.springboot.backend.Service.RentalContractService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class RentalContractController {
    @Autowired
    private final RentalContractService rentalContractService;

    @PostMapping(value = "/api/rentalContract/create")
    public boolean createRentalContract(@RequestBody Map<String, Object> payload){
        Long customerId = ((Number) payload.get("customerId")).longValue();
        Long employeeId = ((Number) payload.get("employeeId")).longValue();

        Map<String, Object> rentalContractData = (Map<String, Object>) payload.get("rentalContract");
        RentalContract rentalContract = new RentalContract();
        rentalContract.setCreatedDate(LocalDate.parse((String) rentalContractData.get("createdDate")));
        rentalContract.setStartDate(LocalDate.parse((String) rentalContractData.get("startDate")));
        rentalContract.setEndDate(LocalDate.parse((String) rentalContractData.get("endDate")));
        rentalContract.setDepositAmount(((Number) rentalContractData.get("depositAmount")).floatValue());
        rentalContract.setTotalEstimatedAmount(((Number) rentalContractData.get("totalEstimatedAmount")).floatValue());
        rentalContract.setDueAmount(((Number) rentalContractData.get("dueAmount")).floatValue());
        rentalContract.setStatus("ACTIVE");

        List<Map<String, Object>> contractVehicleDetails = (List<Map<String, Object>>) rentalContractData.get("contractVehicleDetails");
        List<Map<String, Object>> collaterals = (List<Map<String, Object>>) rentalContractData.get("collaterals");
        return rentalContractService.createRentalContract(
                customerId, employeeId, rentalContract, contractVehicleDetails, collaterals
        );
    }
    @GetMapping(value = "/api/rental/contractSearch")
    public List<RentalContract> getContractBookingByFullNameCustomer(@RequestParam String name){
        return rentalContractService.getContractBookingByFullNameCustomer(name);
    }
    @GetMapping(value = "/api/completedRental")
    public List<RentalContract> getContractActiveByFullNameCustomer(@RequestParam String name){
        return rentalContractService.getContractActiveByFullNameCustomer(name);
    }
}
