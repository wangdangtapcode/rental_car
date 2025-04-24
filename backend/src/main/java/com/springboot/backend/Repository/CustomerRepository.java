package com.springboot.backend.Repository;

import com.springboot.backend.Model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer,Long> {
    List<Customer> findFirst20ByUserFullNameContaining(String fullName);
    List<Customer> findTop20ByOrderByIdAsc();
    List<Customer> findByUserFullNameContainingIgnoreCase(String fullName);
    Optional<Customer> findByUserId(Long id);
}
