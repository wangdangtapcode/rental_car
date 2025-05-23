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
    public boolean createRentalContract(@RequestBody  RentalContract rentalContract){
        return rentalContractService.createRentalContract(rentalContract);
    }

    @PostMapping(value = "/api/rentalContract/update/{id}")
    public boolean updateContract( @PathVariable("id") Long id,@RequestBody  RentalContract rentalContract){
        return rentalContractService.updateContract(rentalContract);
    }

    @GetMapping(value = "/api/rental/contractSearch")
    public List<RentalContract> getContractBookingByFullNameCustomer(@RequestParam String name){
        return rentalContractService.getContractBookingByFullNameCustomer(name);
    }
    @GetMapping(value = "/api/completedRental")
    public List<RentalContract> getContractActiveByFullNameCustomer(@RequestParam String name){
        return rentalContractService.getContractActiveByFullNameCustomer(name);
    }
    
    // Endpoint mới để trả xe riêng lẻ
    @PostMapping(value = "/api/rentalContract/returnVehicle/{contractVehicleDetailId}")
    public ResponseEntity<String> returnVehicle(
        @PathVariable("contractVehicleDetailId") Long contractVehicleDetailId,
        @RequestParam("employeeId") Long employeeId,
        @RequestBody Map<String, Object> returnData) {
        
        LocalDate returnDate = LocalDate.parse(returnData.get("returnDate").toString());
        List<Map<String, Object>> penalties = (List<Map<String, Object>>) returnData.getOrDefault("penalties", List.of());
        
        boolean success = rentalContractService.returnVehicle(contractVehicleDetailId, employeeId, returnDate, penalties);
        
        if (success) {
            return ResponseEntity.ok("Trả xe thành công");
        } else {
            return ResponseEntity.badRequest().body("Trả xe thất bại");
        }
    }
    
    // Lấy thông tin chi tiết xe thuê
    @GetMapping(value = "/api/rentalContract/vehicleDetail/{id}")
    public ResponseEntity<ContractVehicleDetail> getContractVehicleDetail(@PathVariable("id") Long id) {
        ContractVehicleDetail detail = rentalContractService.getContractVehicleDetail(id);
        if (detail != null) {
            return ResponseEntity.ok(detail);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Lấy danh sách xe đang thuê của một hợp đồng
    @GetMapping(value = "/api/rentalContract/{contractId}/activeVehicles")
    public ResponseEntity<List<ContractVehicleDetail>> getActiveVehiclesForContract(@PathVariable("contractId") Long contractId) {
        List<ContractVehicleDetail> vehicles = rentalContractService.getActiveVehiclesForContract(contractId);
        return ResponseEntity.ok(vehicles);
    }
}
