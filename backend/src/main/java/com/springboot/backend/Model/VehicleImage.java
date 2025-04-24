package com.springboot.backend.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "vehicle_images")
public class VehicleImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "name")
    private String name;

    @Column(name = "type")
    private String type;

    @Lob
    private byte[] imageData;

    @Transient // Không lưu vào cơ sở dữ liệu
    private String imageUri;

    @Column(name = "is_thumbnail")
    private Boolean isThumbnail;

    @ManyToOne
    @JoinColumn(name = "vehicle_id")
    @JsonIgnore
    private Vehicle vehicle;
}
