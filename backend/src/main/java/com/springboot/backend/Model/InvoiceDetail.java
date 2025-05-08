package com.springboot.backend.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "invoice_details")
public class InvoiceDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "payment_date")
    private LocalDate paymentDate;

    @Column(name = "penalty_amount")
    private Float penaltyAmount;

    @Column(name = "due_amount")
    private Float dueAmount;

    @Column(name = "total_amount")
    private Float totalAmount;

    @ManyToOne(cascade = {CascadeType.MERGE})
    @JoinColumn(name = "rental_contract_id")
    private RentalContract rentalContract;

    @ManyToOne(cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "employee_id")
    private Employee employee;
}
