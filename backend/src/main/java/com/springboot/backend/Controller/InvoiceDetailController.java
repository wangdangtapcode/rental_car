package com.springboot.backend.Controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.springboot.backend.Model.InvoiceDetail;
import com.springboot.backend.Model.RentalContract;
import com.springboot.backend.Service.InvoiceDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class InvoiceDetailController {
    @Autowired
    private final  InvoiceDetailService invoiceDetailService;

    @PostMapping(value = "/api/invoice/create")
    public boolean createInvoiceDetail(@RequestBody Map<String, Object> invoicePayload) {
        // Truy xuất dữ liệu từ Map
        String paymentDate = (String) invoicePayload.get("paymentDate");
        Float penaltyAmount = ((Number) invoicePayload.get("penaltyAmount")).floatValue();
        Float dueAmount = ((Number) invoicePayload.get("dueAmount")).floatValue();
        Float totalAmount = ((Number) invoicePayload.get("totalAmount")).floatValue();
        Long employeeId = ((Number) invoicePayload.get("employeeId")).longValue();

        // Sử dụng ObjectMapper từ Jackson để chuyển đổi dữ liệu
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());

        // Chuyển đổi Map thành Invoice
        InvoiceDetail invoice = new InvoiceDetail();
        invoice.setPaymentDate(LocalDate.parse(paymentDate));
        invoice.setPenaltyAmount(penaltyAmount);
        invoice.setDueAmount(dueAmount);
        invoice.setTotalAmount(totalAmount);

        // Chuyển đổi contractDetails thành RentalContract
        Map<String, Object> contractMap = (Map<String, Object>) invoicePayload.get("rentalContract");


        RentalContract contract = mapper.convertValue(contractMap, RentalContract.class);

        invoice.setRentalContract(contract);

        return invoiceDetailService.createInvoiceDetail(invoice,employeeId);
    }
}
