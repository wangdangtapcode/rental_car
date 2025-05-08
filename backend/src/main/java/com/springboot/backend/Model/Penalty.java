package com.springboot.backend.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "penalties")
public class Penalty {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "penalty_amount")
    private Float penaltyAmount;

    @Column(name = "note")
    private String note;

    @ManyToOne
    @JoinColumn(name = "contract_vehicle_detail_id")
    @JsonIgnore
    private ContractVehicleDetail contractVehicleDetail;

    @ManyToOne
    @JoinColumn(name = "penalty_type_id")
    private PenaltyType penaltyType;
}
