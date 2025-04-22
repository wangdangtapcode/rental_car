package com.springboot.backend.DTO;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor

public class CustomerRevenue {
    private Long userId;
    private String fullName;
    private String address;
    private String phoneNumber;
    private Integer totalRentals;
    private Integer totalRentalDays;
    private double totalRevenue;

    public CustomerRevenue(Long userId,
                           String fullName,
                           String address,
                           String phoneNumber,
                           Integer totalRentals,
                           Integer totalRentalDays,
                           double totalRevenue) {
        this.userId = userId;
        this.fullName = fullName;
        this.address = address;
        this.phoneNumber = phoneNumber;
        this.totalRentals = totalRentals;
        this.totalRentalDays = totalRentalDays;
        this.totalRevenue = totalRevenue;
    }
}
