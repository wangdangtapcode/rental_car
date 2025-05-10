package com.springboot.backend.Service.impl;

import com.springboot.backend.Model.Customer;
import com.springboot.backend.Model.Employee;
import com.springboot.backend.Model.User;
import com.springboot.backend.Repository.CustomerRepository;
import com.springboot.backend.Repository.EmployeeRepository;
import com.springboot.backend.Repository.UserRepository;
import com.springboot.backend.Service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    @Autowired
    private final UserRepository userRepository;

    @Override
    public Object login(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmailAndPassword(email, password);

        if (userOpt.isPresent()) {
            User user = userOpt.get();

            if (!"ACTIVE".equalsIgnoreCase(user.getStatus())) {
                return null;
            }

            if (user.getEmployee() != null) {
                return user.getEmployee();
            }

            if (user.getCustomer() != null) {
                return user.getCustomer();
            }
        }

        return null;
    }
}
