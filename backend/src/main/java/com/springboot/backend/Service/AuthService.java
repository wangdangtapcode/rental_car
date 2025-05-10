package com.springboot.backend.Service;

import org.springframework.stereotype.Service;

@Service
public interface AuthService {
    Object login(String email, String password);
}

