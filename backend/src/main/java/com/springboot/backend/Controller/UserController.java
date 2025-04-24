package com.springboot.backend.Controller;

import com.springboot.backend.Model.User;
import com.springboot.backend.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class UserController {
    @Autowired
    private final UserService userService;

    @PostMapping(value = "/api/auth/login")
    public User login(@RequestBody Map<String,String> rq){
        String email = rq.get("email");
        String password = rq.get("password");

        return userService.login(email,password);
    }
}
