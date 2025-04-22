package com.springboot.backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VehicleDetailDTO {
    private Long id;
    private String name;
    private String licensePlate;
    private String brand;
    private String type;
    private Integer seatCount;
    private Integer manufactureYear;
    private String description;
    private Float rentalPrice;
    private String vehicleCondition;
    private String ownerType;
    private String status;
    private List<VehicleImageDTO> vehicleImages;
}
