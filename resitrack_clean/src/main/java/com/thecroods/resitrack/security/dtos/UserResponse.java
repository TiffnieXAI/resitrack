package com.thecroods.resitrack.security.dtos;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserResponse {
    private String id;
    private String username;
    private String role;

    public UserResponse(String id, String username, String role) {
        this.id = id;
        this.username = username;
        this.role = role;
    }
}
