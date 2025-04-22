package com.springboot.backend.Repository;

import com.springboot.backend.Model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface CustomerRepository extends JpaRepository<Customer,Long> {
    List<Customer> findFirst20ByUserFullNameContaining(String fullName);
    List<Customer> findTop20ByOrderByIdAsc();
}
