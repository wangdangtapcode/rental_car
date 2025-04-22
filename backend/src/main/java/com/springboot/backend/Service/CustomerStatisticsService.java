package com.springboot.backend.Service;

import com.springboot.backend.DTO.CustomerInvoiceDetail;
import com.springboot.backend.DTO.CustomerRevenue;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
@Service
public interface CustomerStatisticsService {
    List<CustomerRevenue> getCustomerStatistics(LocalDate startDate, LocalDate endDate);
    List<CustomerInvoiceDetail> getCustomerInvoiceDetails(Long id, LocalDate startDate, LocalDate endDate);
}
