package com.springboot.backend.Controller;

import com.springboot.backend.DTO.CustomerDTO;
import com.springboot.backend.Service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController

public class CustomerController {
    @Autowired
    private  CustomerService customerService;

    @GetMapping(value = "/api/management/customer/search")
    public List<CustomerDTO> findByName(@RequestParam String fullName){
            return customerService.findByUserFullName(fullName);
    }

    @GetMapping(value = "/api/management/customer/search/all")
    public List<CustomerDTO> findByName(){
        return customerService.findAll();
    }

    @PostMapping(value = "/api/management/customer/add")
    public boolean createCustomer(@RequestBody CustomerDTO customerDTO){
        return customerService.createCustomer(customerDTO);
    }
    @PostMapping(value = "/api/management/customer/edit/{id}")
    public boolean editCustomer(@RequestBody CustomerDTO customerDTO){
        return customerService.editCustomer(customerDTO);
    }
    @DeleteMapping(value = "/api/management/customer/del/{id}")
    public boolean deleteCustomer(@PathVariable Long id){
        return customerService.delCustomer(id);
    }
}
