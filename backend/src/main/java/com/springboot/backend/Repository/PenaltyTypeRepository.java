package com.springboot.backend.Repository;

import com.springboot.backend.Model.PenaltyType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PenaltyTypeRepository extends JpaRepository<PenaltyType, Long> {
}
