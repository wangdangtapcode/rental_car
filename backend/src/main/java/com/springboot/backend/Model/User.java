package com.springboot.backend.Model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name ="users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "email")
    private String email;

    @Column(name="password")
    private String password;

    @Column(name = "address")
    private String address;

    @Column(name = "user_type")
    private String userType;

    @Column(name = "status",columnDefinition = "varchar(255) default 'ACTIVE'")
    private String status;

    @OneToOne(mappedBy = "user")
    @JsonIgnore
    private Customer customer;

    @OneToOne(mappedBy = "user")
    @JsonIgnore
    private Employee employee;
}