package com.thecroods.resitrack.security.service;

import com.thecroods.resitrack.security.dtos.RegisterUserRequest;
import com.thecroods.resitrack.security.dtos.UserResponse;
import com.thecroods.resitrack.security.models.UserModel;
import com.thecroods.resitrack.security.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public UserResponse registerUser(RegisterUserRequest registerUserRequest) {

        if(userRepository.existsById(registerUserRequest.getUsername())) {
            throw new RuntimeException("Username is already in use!");
        }

        UserModel users = new UserModel();
        users.setUsername(registerUserRequest.getUsername());
        users.setPassword(passwordEncoder.encode(registerUserRequest.getPassword()));
        users.setRole(registerUserRequest.getRole());
        UserModel savedUser = userRepository.save(users);

        return new UserResponse(savedUser.getId(), savedUser.getUsername(), savedUser.getRole().name());
    }
}
