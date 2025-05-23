package com.springboot.backend.Repository;

import com.springboot.backend.Model.ContractVehicleDetail;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ContractVehicleDetailRepository extends JpaRepository<ContractVehicleDetail, Long> {

    @Query("SELECT cvd FROM ContractVehicleDetail cvd " +
            "WHERE cvd.id = :contractVehicleDetailId")
    Optional<ContractVehicleDetail> findContractVehicleDetailById(@Param("contractVehicleDetailId") Long contractVehicleDetailId);
}
