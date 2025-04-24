package com.springboot.backend.Service.impl;

import com.springboot.backend.Model.User;
import com.springboot.backend.Repository.UserRepository;
import com.springboot.backend.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    @Autowired
    private final UserRepository userRepository;
    @Override
    public User login(String email, String password) {

        Optional<User> u = userRepository.findByEmailAndStatus(email,"ACTIVE");
        if(u.isPresent()){
            User user = u.get();
            if(user.getPassword().equals(password)){
                if(user.getUserType().equals("CUSTOMER")){
                    user.getCustomer().setRentalContracts(null);
                    return user;
                } else if (user.getUserType().equals("EMPLOYEE")) {
                    user.getEmployee().setInvoiceDetails(null);
                    user.getEmployee().setRentalContracts(null);
                    return user;
                }
            }else {
                return null;
            }

        }

        return null;
    }
}
