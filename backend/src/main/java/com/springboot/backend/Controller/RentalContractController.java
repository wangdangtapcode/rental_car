package com.springboot.backend.Controller;

import com.springboot.backend.Model.Collateral;
import com.springboot.backend.Model.ContractVehicleDetail;
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
    public boolean createRentalContract(@RequestBody  RentalContract rentalContract){
        return rentalContractService.createRentalContract(rentalContract);
    }


    @PostMapping(value = "/api/rentalContract/update/{id}")
    public boolean updateContract( @PathVariable("id") Long id,@RequestBody Map<String, Object> payload){
        Long employeeId = ((Number) payload.get("employeeId")).longValue();
        Long RentalContractId = id;

        List<Map<String, Object>> updatedVehicleConditions = (List<Map<String, Object>>) payload.get("updatedVehicleConditions");
        return rentalContractService.updateContract(employeeId,
                RentalContractId,
                updatedVehicleConditions);
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
