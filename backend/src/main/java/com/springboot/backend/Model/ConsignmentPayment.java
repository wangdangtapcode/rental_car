package com.springboot.backend.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "consignment_payments")
public class ConsignmentPayment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "rental_days")
    private Integer rentalDays;

    @Column(name = "payment_amount")
    private Float paymentAmount;

    @ManyToOne
    @JoinColumn(name = "consignment_contract_id")
    private ConsignmentContract consignmentContract;

    @ManyToOne
    @JoinColumn(name = "payment_partner_id")
    private PaymentPartner paymentPartner;
}
