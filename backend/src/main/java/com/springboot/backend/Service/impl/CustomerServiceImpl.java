package com.springboot.backend.Service.impl;

import com.springboot.backend.Model.Customer;
import com.springboot.backend.Model.User;
import com.springboot.backend.Repository.CustomerRepository;
import com.springboot.backend.Service.CustomerService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {
    @Autowired
    private final CustomerRepository customerRepository;


    @Override
    @Transactional
    public List<Customer> findByUserFullName(String fullName) {
        List<Customer> customers = customerRepository.findByUserFullNameContainingIgnoreCase(fullName);
        List<Customer> customerList = new ArrayList<>();
        for (Customer customer : customers) {
            customer.setRentalContracts(null);
            customerList.add(customer);
        }
        return customerList;
    }

    @Override
    @Transactional
    public List<Customer> findAll() {
        List<Customer> customers = customerRepository.findTop20ByOrderByIdAsc();
        List<Customer> customerList = new ArrayList<>();
        for (Customer customer : customers) {
            customer.setRentalContracts(null);
            customerList.add(customer);
        }
        return customerList;
    }

    @Override
    public Customer findById(Long id) {
        Optional<Customer> customerOptional = customerRepository.findById(id);
        if (customerOptional.isPresent()) {
            Customer customer = customerOptional.get();
            customer.setRentalContracts(null);  // Set null nếu không muốn trả về thông tin hợp đồng thuê
            return customer;
        } else {
            // Nếu không tìm thấy khách hàng, có thể ném exception hoặc trả về null, tùy theo yêu cầu
            throw new EntityNotFoundException("Customer not found with id: " + id);
        }
    }

    @Override
    @Transactional
    public Boolean createCustomer(Map<String, Object> customerData) {

        User user = new User();
        user.setFullName((String) customerData.get("fullName"));
        user.setEmail((String) customerData.get("email"));
        user.setPassword((String) customerData.get("password"));
        user.setPhoneNumber((String) customerData.get("phoneNumber"));
        user.setAddress((String) customerData.get("address"));
        user.setStatus((String) customerData.get("status"));
        user.setUserType((String) customerData.get("userType"));

//        userRepository.save(user);

        Customer customer = new Customer();
        customer.setUser(user);

        customerRepository.save(customer);

        return true;
    }

    @Override
    @Transactional
    public Boolean editCustomer(Map<String, Object> customerData) {
        Long customerId = ((Number) customerData.get("id")).longValue();

        Optional<Customer> optionalCustomer = customerRepository.findById(customerId);
        if(optionalCustomer.isPresent()){
            Customer customer = optionalCustomer.get();
            User user = customer.getUser();
            user.setFullName((String) customerData.get("fullName"));
            user.setEmail((String) customerData.get("email"));
            user.setPassword((String) customerData.get("password"));
            user.setPhoneNumber((String) customerData.get("phoneNumber"));
            user.setAddress((String) customerData.get("address"));
            user.setStatus((String) customerData.get("status"));
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
