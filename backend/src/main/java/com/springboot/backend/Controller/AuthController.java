package com.springboot.backend.Controller;

import com.springboot.backend.Service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class AuthController {
    @Autowired
    private final AuthService authService;

    @PostMapping(value = "/api/auth/login")
    public Object login(@RequestBody Map<String,String> rq){
        String email = rq.get("email");
        String password = rq.get("password");

        return authService.login(email,password);
    }
}
