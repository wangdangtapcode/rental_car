package com.springboot.backend.Controller;

import com.springboot.backend.Model.Customer;
import com.springboot.backend.Service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class CustomerController {
    @Autowired
    private  final CustomerService customerService;

    @GetMapping(value = "/api/management/customer/search")
    public List<Customer> findByName(@RequestParam String fullName){
            return customerService.findByUserFullName(fullName);
    }

    @GetMapping(value = "/api/management/customer/search/all")
    public List<Customer> findByName(){
        return customerService.findAll();
    }

    @GetMapping (value = "/api/management/customer/search/{id}")
    public Customer findById(@PathVariable Long id){

        return customerService.findById(id);
    }

    @PostMapping(value = "/api/management/customer/add")
    public boolean createCustomer(@RequestBody Map<String, Object> customerData){
        return customerService.createCustomer(customerData);
    }
    @PostMapping(value = "/api/management/customer/edit/{id}")
    public boolean editCustomer(@RequestBody Map<String, Object> customerData){
        return customerService.editCustomer(customerData);
    }
    @DeleteMapping(value = "/api/management/customer/del/{id}")
    public boolean deleteCustomer(@PathVariable Long id){
        return customerService.delCustomer(id);
    }




}
