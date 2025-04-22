package com.springboot.backend.Service.impl;

import com.springboot.backend.DTO.CustomerDTO;
import com.springboot.backend.Model.Customer;
import com.springboot.backend.Model.User;
import com.springboot.backend.Repository.CustomerRepository;
import com.springboot.backend.Repository.UserRepository;
import com.springboot.backend.Service.CustomerService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service

public class CustomerServiceImpl implements CustomerService {
    @Autowired
    private CustomerRepository customerRepository;



    @Override
    @Transactional
    public List<CustomerDTO> findByUserFullName(String fullName) {
        List<Customer> customerList = customerRepository.findFirst20ByUserFullNameContaining(fullName);
        List<CustomerDTO> customerDTOList = new ArrayList<>();
        for(Customer customer: customerList){
            CustomerDTO customerDTO = new CustomerDTO();
            customerDTO.setId(customer.getId());
            customerDTO.setFullName(customer.getUser().getFullName());
            customerDTO.setAddress(customer.getUser().getAddress());
            customerDTO.setEmail(customer.getUser().getEmail());
            customerDTO.setPassword(customer.getUser().getPassword());
            customerDTO.setStatus(customer.getUser().getStatus());
            customerDTO.setUserType(customer.getUser().getUserType());
            customerDTO.setPhoneNumber(customer.getUser().getPhoneNumber());
            customerDTOList.add(customerDTO);
        }
        System.out.println("OK");
        return customerDTOList;
    }

    @Override
    @Transactional
    public List<CustomerDTO> findAll() {
        List<Customer> customerList = customerRepository.findTop20ByOrderByIdAsc();
        List<CustomerDTO> customerDTOList = new ArrayList<>();
        for(Customer customer: customerList){
            CustomerDTO customerDTO = new CustomerDTO();
            customerDTO.setId(customer.getId());
            customerDTO.setFullName(customer.getUser().getFullName());
            customerDTO.setAddress(customer.getUser().getAddress());
            customerDTO.setEmail(customer.getUser().getEmail());
            customerDTO.setPassword(customer.getUser().getPassword());
            customerDTO.setStatus(customer.getUser().getStatus());
            customerDTO.setUserType(customer.getUser().getUserType());
            customerDTO.setPhoneNumber(customer.getUser().getPhoneNumber());
            customerDTOList.add(customerDTO);
        }
        System.out.println("OK");
        return customerDTOList;
    }

    @Override
    @Transactional
    public Boolean createCustomer(CustomerDTO customerDTO) {

        User user = new User();
        user.setFullName(customerDTO.getFullName());
        user.setEmail(customerDTO.getEmail());
        user.setPassword(customerDTO.getPassword());
        user.setPhoneNumber(customerDTO.getPhoneNumber());
        user.setAddress(customerDTO.getAddress());
        user.setUserType("CUSTOMER");
        user.setStatus("ACTIVE");

//        userRepository.save(user);

        Customer customer = new Customer();
        customer.setUser(user);

        customerRepository.save(customer);

        return true;
    }

    @Override
    @Transactional
    public Boolean editCustomer(CustomerDTO customerDTO) {
        Optional<Customer> optionalCustomer = customerRepository.findById(customerDTO.getId());
        if(optionalCustomer.isPresent()){
            Customer customer = optionalCustomer.get();
            customer.getUser().setFullName(customerDTO.getFullName());
            customer.getUser().setEmail(customerDTO.getEmail());
            customer.getUser().setPassword(customerDTO.getPassword());
            customer.getUser().setPhoneNumber(customerDTO.getPhoneNumber());
            customer.getUser().setAddress(customerDTO.getAddress());
            customer.getUser().setStatus(customerDTO.getStatus());
            customerRepository.save(customer);
            return true;
        }
        return false;
    }

    @Override
    @Transactional
    public Boolean delCustomer(Long id) {
        if (customerRepository.existsById(id)) {
            customerRepository.deleteById(id);
            return true;
        } else {
            return false;
        }
    }
}
