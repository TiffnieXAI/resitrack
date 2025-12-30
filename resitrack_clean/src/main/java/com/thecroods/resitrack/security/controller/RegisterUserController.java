package com.thecroods.resitrack.security.controller;

import com.thecroods.resitrack.security.dtos.RegisterUserRequest;
import com.thecroods.resitrack.security.dtos.UserResponse;
import com.thecroods.resitrack.security.models.Role;
import com.thecroods.resitrack.security.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class RegisterUserController {

    private final UserService userService;

    public RegisterUserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> registerUser(@RequestBody RegisterUserRequest registerUserRequest) {
        registerUserRequest.setRole(Role.ROLE_USER);
        UserResponse userResponse = userService.registerUser(registerUserRequest);

        return ResponseEntity.ok(userResponse);
    }

    @PostMapping("/admin/create")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> registerByAdmin(@RequestBody RegisterUserRequest registerUserRequest){
        UserResponse userResponse = userService.registerUser(registerUserRequest);
        return ResponseEntity.ok(userResponse);
    }
}
