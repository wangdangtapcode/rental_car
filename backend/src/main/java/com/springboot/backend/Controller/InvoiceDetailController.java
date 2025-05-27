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
    private final InvoiceDetailService invoiceDetailService;

    // Endpoint để tạo hóa đơn cho một hoặc nhiều xe
    @PostMapping(value = "/api/invoice/create")
    public ResponseEntity<String> createInvoice(@RequestBody InvoiceDetail invoiceData) {

        boolean success = invoiceDetailService.createInvoice(invoiceData);

        if (success) {
            return ResponseEntity.ok("Tạo hóa đơn thành công");
        } else {
            return ResponseEntity.badRequest().body("Tạo hóa đơn thất bại");
        }
    }

}
