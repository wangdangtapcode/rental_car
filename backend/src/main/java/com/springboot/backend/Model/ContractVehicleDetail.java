package com.springboot.backend.Model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

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

    @ManyToOne
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    @OneToMany(mappedBy = "contractVehicleDetail")
    private List<Penalty> penalties;

    @ManyToOne
    @JoinColumn(name = "rental_contract_id")
    private RentalContract rentalContract;

}
