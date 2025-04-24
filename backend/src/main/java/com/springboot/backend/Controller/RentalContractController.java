package com.springboot.backend.Controller;

import com.springboot.backend.Service.RentalContractService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
        String startDate = (String) payload.get("startDate");
        String endDate = (String) payload.get("endDate");
        Float depositAmount = ((Number) payload.get("depositAmount")).floatValue();
        List<Map<String, Object>> contractVehicleDetails = (List<Map<String, Object>>) payload.get("contractVehicleDetails");
        List<Map<String, Object>> collaterals = (List<Map<String, Object>>) payload.get("collaterals");
        return rentalContractService.createRentalContract(
                customerId, employeeId, startDate, endDate, depositAmount, contractVehicleDetails, collaterals
        );
    }


}
