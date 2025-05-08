package com.springboot.backend.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "penalty_types")
public class PenaltyType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name="default_amount")
    private Float defaultAmount;

    @Column(name = "description")
    private String description;

    @OneToMany(mappedBy = "penaltyType")
    @JsonIgnore
    private List<Penalty> penaltyList;
}
