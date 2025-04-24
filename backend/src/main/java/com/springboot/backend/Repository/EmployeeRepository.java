package com.springboot.backend.Repository;

import com.springboot.backend.Model.Customer;
import com.springboot.backend.Model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee,Long> {
    Optional<Employee> findByUserId(Long id);
}
