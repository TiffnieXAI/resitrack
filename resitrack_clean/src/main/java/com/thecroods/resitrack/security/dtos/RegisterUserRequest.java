package com.thecroods.resitrack.security.dtos;

import com.thecroods.resitrack.security.models.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterUserRequest {
    private String username;
    private String password;
    private Role role;
}
