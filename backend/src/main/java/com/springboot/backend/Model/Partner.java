package com.springboot.backend.Model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "partners")
public class Partner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "partner_name")
    private String partnerName;

    @Column(name = "address")
    private String address;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "partnership_status")
    private String partnershipStatus;

    @Column(name = "note")
    private String note;

    @OneToMany(mappedBy = "partner")
    private List<ConsignmentContract> consignmentContract;
}
