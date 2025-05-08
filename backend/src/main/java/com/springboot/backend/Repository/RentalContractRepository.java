package com.springboot.backend.Repository;

import com.springboot.backend.Model.RentalContract;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RentalContractRepository extends JpaRepository<RentalContract,Long> {

    @Query("SELECT DISTINCT rc FROM RentalContract rc " +
            "JOIN FETCH rc.customer c " +  // Tải Customer cùng với RentalContract
            "JOIN FETCH c.user cu " +      // Tải User của Customer cùng một lúc
            "LEFT JOIN FETCH rc.employee e " +  // Tải Employee nếu có
            "LEFT JOIN FETCH e.user eu " +      // Tải User của Employee nếu có
            "WHERE LOWER(cu.fullName) LIKE LOWER(CONCAT('%', :customerName, '%')) " +
            "AND rc.status = :status")
    List<RentalContract> findByCustomerNameAndStatusWithFetch(
            @Param("customerName") String customerName,
            @Param("status") String status);

}
