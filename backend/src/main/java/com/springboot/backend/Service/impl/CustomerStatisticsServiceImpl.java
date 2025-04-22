package com.springboot.backend.Service.impl;

import com.springboot.backend.DTO.CustomerInvoiceDetail;
import com.springboot.backend.DTO.CustomerRevenue;

import com.springboot.backend.Repository.InvoiceDetailRepository;
import com.springboot.backend.Service.CustomerStatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.sql.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerStatisticsServiceImpl implements CustomerStatisticsService {

    @Autowired
    private final InvoiceDetailRepository invoiceDetailRepository;

    @Override
    public List<CustomerRevenue> getCustomerStatistics(LocalDate startDate, LocalDate endDate) {
        List<Object[]> rawData = invoiceDetailRepository.getCustomerRevenueBetweenNative(startDate, endDate);

        List<CustomerRevenue> result = rawData.stream()
                .map(row -> new CustomerRevenue(
                        ((Number) row[0]).longValue(),     // userId
                        (String) row[1],                   // fullName
                        (String) row[2],                   // address
                        (String) row[3],                   // phoneNumber
                        ((Number) row[4]).intValue(),      // totalContracts
                        ((Number) row[5]).intValue(),     // totalRentalDays
                        ((Number) row[6]).doubleValue()    // totalRevenue
                ))
                .toList();
        return result;
    }

    @Override
    public List<CustomerInvoiceDetail> getCustomerInvoiceDetails(Long id, LocalDate startDate, LocalDate endDate) {
        List<Object[]> rawInvoices = invoiceDetailRepository.getInvoicesForCustomerInPeriodNative(id, startDate, endDate);

        List<CustomerInvoiceDetail> invoiceList = rawInvoices.stream()
                .map(row -> new CustomerInvoiceDetail(
                        ((Number) row[0]).longValue(),     // invoiceId
                        ((Date) row[1]).toLocalDate(),     // startDate
                        ((Date) row[2]).toLocalDate(),     // endDate
                        ((Date) row[3]).toLocalDate(),     // paymentDate
                        ((Number) row[4]).intValue(),      // vehicleCount
                        ((Number) row[5]).doubleValue(),   // amountExcludingPenalty
                        ((Number) row[6]).doubleValue(),   // penaltyAmount
                        ((Number) row[7]).doubleValue()    // totalAmount
                ))
                .toList();
        return invoiceList;
    }


}
