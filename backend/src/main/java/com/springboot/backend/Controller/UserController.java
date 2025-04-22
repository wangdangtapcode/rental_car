package com.springboot.backend.Controller;

import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
public class UserController {

    @PostMapping(value = "/auth/login")
    public boolean Login(@RequestBody Map<String,String> rq){
        String username = rq.get("username");
        String password = rq.get("password");

        // Giả sử username: admin, password: 123 là đúng
        if ("admin".equals(username) && "123".equals(password)) {
            return true;
        }
        return false;
    }
}
