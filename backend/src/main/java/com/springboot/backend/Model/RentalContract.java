package com.springboot.backend.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "rental_contracts")
public class RentalContract {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(name = "created_date")
    private LocalDate createdDate;

    @Column(name = "deposit_amount")
    private Float depositAmount;

    @Column(name = "due_amount")
    private Float dueAmount;

    @Column(name = "total_estimated_amount")
    private Float totalEstimatedAmount	;

    @Column(name = "status")
    private String status;

    @OneToMany(mappedBy = "rentalContract",cascade = CascadeType.ALL,orphanRemoval = true)
    private List<ContractVehicleDetail> contractVehicleDetails;

    @OneToMany(mappedBy = "rentalContract",cascade = CascadeType.ALL,orphanRemoval = true)
    private List<Collateral> collaterals;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;

//    @OneToMany(mappedBy = "rentalContract")
//    @JsonIgnore
//    private List<InvoiceDetail> invoiceDetails;
}
