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
@Table(name = "employees")
public class Employee {

    @Id
    private Long id;

    @Column(name = "position")
    private String position;

    @OneToOne(cascade = CascadeType.ALL)
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "employee")
    @JsonIgnore
    private List<RentalContract> rentalContracts;

    @OneToMany(mappedBy = "employee")
    @JsonIgnore
    private List<InvoiceDetail> invoiceDetails;
}
