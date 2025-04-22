package com.springboot.backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Setter
public class VehicleImageDTO {
    private Long id;
    private String name;
    private String type;
    private String base64Image;
    private Boolean isThumbnail;
}
