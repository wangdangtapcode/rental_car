package com.springboot.backend.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "vehicles")
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "license_plate")
    private String licensePlate;

    @Column(name = "brand")
    private String brand;

    @Column(name = "type")
    private String type;

    @Column(name = "seat_count")
    private Integer seatCount;

    @Column(name = "manufacture_year")
    private Integer manufactureYear;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "rental_price")
    private Float rentalPrice;

    @Column(name = "vehicle_condition")
    private String vehicleCondition;

    @Column(name = "owner_type")
    private String ownerType;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "consignment_contract_id")
    private ConsignmentContract consignmentContract;

    @OneToMany(mappedBy = "vehicle")
    @JsonIgnore
    private List<ContractVehicleDetail> contractVehicleDetails;

    @OneToMany(mappedBy = "vehicle", cascade = { CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.REMOVE }, orphanRemoval = true)
    private List<VehicleImage> vehicleImages;
}
