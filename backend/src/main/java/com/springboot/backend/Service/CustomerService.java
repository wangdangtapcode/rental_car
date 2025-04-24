package com.springboot.backend.Service;

import com.springboot.backend.Model.Customer;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public interface CustomerService {
    List<Customer> findByUserFullName(String fullName);
    List<Customer> findAll( );
    Customer findById(Long id);
    Boolean createCustomer(Map<String, Object> customerData);
    Boolean editCustomer(Map<String, Object> customerData);
    Boolean delCustomer(Long id);
}
