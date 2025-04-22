package com.springboot.backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VehicleSearchDTO {
    private Long id;
    private String thumbnailImage;
    private String name;
    private String brand;
    private String type;
    private Integer manufactureYear;
    private Integer seatCount;
    private String description;
    private String licensePlate;
    private Float rentalPrice;
    private String ownerType;
    private String status;

}
