package com.springboot.backend.Service;

import com.springboot.backend.DTO.CustomerDTO;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public interface CustomerService {
    List<CustomerDTO> findByUserFullName(String fullName);
    List<CustomerDTO> findAll( );
    Boolean createCustomer(CustomerDTO customerDTO);
    Boolean editCustomer(CustomerDTO customerDTO);
    Boolean delCustomer(Long id);
}
