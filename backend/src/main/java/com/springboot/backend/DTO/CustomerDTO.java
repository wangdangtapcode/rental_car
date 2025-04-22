package com.springboot.backend.DTO;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CustomerDTO {
    private Long id;
    private String fullName;
    private String phoneNumber;
    private String email;
    private String password;
    private String address;
    private String userType;
    private String status;
}
