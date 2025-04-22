package com.springboot.backend.Controller;

import com.springboot.backend.DTO.CustomerInvoiceDetail;
import com.springboot.backend.DTO.CustomerRevenue;
import com.springboot.backend.Service.CustomerStatisticsService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
public class CustomerStatisticsController {
    @Autowired
    private CustomerStatisticsService customerStatisticsService;

    @GetMapping(value = "/api/statistics/customer")
    public List<CustomerRevenue> getCustomerRevenueStatistics(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
            ){
        return customerStatisticsService.getCustomerStatistics(startDate,endDate);
    }


    @GetMapping(value = "/api/statistics/customer/{id}")
    public List<CustomerInvoiceDetail> getCustomerInvoiceDetails(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate                                                     ){
        return customerStatisticsService.getCustomerInvoiceDetails(id,startDate,endDate);
    }
}
