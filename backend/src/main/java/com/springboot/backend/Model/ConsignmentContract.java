package com.springboot.backend.Model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "consignment_contracts")

public class ConsignmentContract {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "import_price")
    private Float importPrice;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "termination_date")
    private LocalDate terminationDate;

    @Column(name = "payment_cycle")
    private String paymentCycle;

    @Column(name = "status")
    private String status;

    @ManyToOne
    @JoinColumn(name="partner_id")
    private Partner partner;

    @OneToMany(mappedBy = "consignmentContract")
    private List<Vehicle> vehicles;

    @OneToMany(mappedBy = "consignmentContract")
    private List<ConsignmentPayment> consignmentPayments;
}
