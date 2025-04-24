package com.springboot.backend.Repository;

import com.springboot.backend.Model.RentalContract;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RentalContractRepository extends JpaRepository<RentalContract,Long> {
}
