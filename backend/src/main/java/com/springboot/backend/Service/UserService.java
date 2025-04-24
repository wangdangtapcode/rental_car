package com.springboot.backend.Service;

import com.springboot.backend.Model.User;
import org.springframework.stereotype.Service;

@Service
public interface UserService {
    User login(String email,String password);

}
