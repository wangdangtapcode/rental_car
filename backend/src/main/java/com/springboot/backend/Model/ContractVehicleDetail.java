package com.springboot.backend.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "contract_vehicle_details")
public class ContractVehicleDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "rental_price")
    private Float rentalPrice;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "condition_notes")
    private String conditionNotes;

    @Column(name = "total_estimated_amount")
    private Float totalEstimatedAmount;

    @Column(name = "status")
    private String status;

    @Column(name = "actual_return_date")
    private LocalDate actualReturnDate;

    @ManyToOne()
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    @OneToMany(mappedBy = "contractVehicleDetail", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Penalty> penalties;

    @ManyToOne()
    @JsonIgnore
    @JoinColumn(name = "invoice_detail_id")
    private InvoiceDetail invoiceDetail;

    @ManyToOne
    @JoinColumn(name = "rental_contract_id")
    @JsonIgnore
    private RentalContract rentalContract;

}
