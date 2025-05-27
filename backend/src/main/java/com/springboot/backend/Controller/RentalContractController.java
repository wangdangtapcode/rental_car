package com.springboot.backend.Controller;

import com.springboot.backend.Model.Collateral;
import com.springboot.backend.Model.ContractVehicleDetail;
import com.springboot.backend.Model.RentalContract;
import com.springboot.backend.Service.RentalContractService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
    public boolean createRentalContract(@RequestBody RentalContract rentalContract) {
        return rentalContractService.createRentalContract(rentalContract);
    }

    @PostMapping(value = "/api/rentalContract/update/{id}")
    public boolean updateContract(@PathVariable("id") Long id, @RequestBody RentalContract rentalContract) {
        return rentalContractService.updateContract(rentalContract);
    }

    @GetMapping(value = "/api/rentalContract/search")
    public List<RentalContract> getContractBookingByFullNameCustomer(@RequestParam String name) {
        return rentalContractService.getContractBookingByFullNameCustomer(name);
    }

    @GetMapping(value = "/api/rentalContract/completedRental/search")
    public List<RentalContract> getContractActiveByFullNameCustomer(@RequestParam String name) {
        return rentalContractService.getContractActiveByFullNameCustomer(name);
    }

}
