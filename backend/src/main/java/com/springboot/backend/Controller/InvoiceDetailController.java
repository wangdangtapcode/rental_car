package com.springboot.backend.Controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.springboot.backend.Model.InvoiceDetail;
import com.springboot.backend.Model.RentalContract;
import com.springboot.backend.Service.InvoiceDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class InvoiceDetailController {
    @Autowired
    private final  InvoiceDetailService invoiceDetailService;

//    @PostMapping(value = "/api/invoice/create")
//    public boolean createInvoiceDetail(@RequestBody InvoiceDetail invoicePayload) {
//        return invoiceDetailService.createInvoiceDetail(invoicePayload);
//    }
    
    // Endpoint mới để tạo hóa đơn cho xe riêng lẻ
    @PostMapping(value = "/api/invoice/createSingle/{contractVehicleDetailId}")
    public ResponseEntity<String> createSingleVehicleInvoice(
            @PathVariable("contractVehicleDetailId") Long contractVehicleDetailId,
            @RequestParam("employeeId") Long employeeId,
            @RequestBody Map<String, Object> invoiceData) {
        
        boolean success = invoiceDetailService.createSingleVehicleInvoice(
                contractVehicleDetailId, employeeId, invoiceData);
        
        if (success) {
            return ResponseEntity.ok("Tạo hóa đơn thành công");
        } else {
            return ResponseEntity.badRequest().body("Tạo hóa đơn thất bại");
        }
    }
    
    // Lấy danh sách hóa đơn theo ID khách hàng
    @GetMapping(value = "/api/invoice/customer/{customerId}")
    public ResponseEntity<List<InvoiceDetail>> getInvoicesByCustomerId(
            @PathVariable("customerId") Long customerId) {
        
        List<InvoiceDetail> invoices = invoiceDetailService.getInvoicesByCustomerId(customerId);
        return ResponseEntity.ok(invoices);
    }
    
    // Lấy hóa đơn theo ID chi tiết xe thuê
    @GetMapping(value = "/api/invoice/vehicleDetail/{contractVehicleDetailId}")
    public ResponseEntity<InvoiceDetail> getInvoiceByContractVehicleDetailId(
            @PathVariable("contractVehicleDetailId") Long contractVehicleDetailId) {
        
        InvoiceDetail invoice = invoiceDetailService.getInvoiceByContractVehicleDetailId(contractVehicleDetailId);
        
        if (invoice != null) {
            return ResponseEntity.ok(invoice);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
