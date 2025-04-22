package com.springboot.backend.DTO;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor

public class CustomerInvoiceDetail {
    private Long id;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDate paymentDate;
    private Integer vehicleCount;
    private double rentalAmount;
    private double penaltyAmount;
    private double totalAmount;

    public CustomerInvoiceDetail(Long id,
                                 LocalDate startDate,
                                 LocalDate endDate,
                                 LocalDate paymentDate,
                                 Integer vehicleCount,
                                 double rentalAmount,
                                 double penaltyAmount,
                                 double totalAmount) {
        this.id = id;
        this.startDate = startDate;
        this.endDate = endDate;
        this.paymentDate = paymentDate;
        this.vehicleCount = vehicleCount;
        this.rentalAmount = rentalAmount;
        this.penaltyAmount = penaltyAmount;
        this.totalAmount = totalAmount;
    }
}
