package com.springboot.backend.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "payment_partners")
public class PaymentPartner {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "period")
    private String period;

    @Column(name = "total_rental_days")
    private Integer totalRentalDays;

    @Column(name = "start_period")
    private LocalDate startPeriod;

    @Column(name = "end_period")
    private LocalDate endPeriod;

    @Column(name = "total_amout")
    private float totalAmout;

    @Column(name = "status")
    private String status;

    @Column(name = "created_date")
    private LocalDate createdDate;

    @OneToMany(mappedBy = "paymentPartner")
    private List<ConsignmentPayment> consignmentPaymentList;
}
