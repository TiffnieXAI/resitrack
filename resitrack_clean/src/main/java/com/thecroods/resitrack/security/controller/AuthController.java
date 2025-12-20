package com.thecroods.resitrack.security.controller;

import com.thecroods.resitrack.security.DTOS.AuthenticationRequest;
import com.thecroods.resitrack.security.DTOS.AuthenticationResponse;
import com.thecroods.resitrack.security.Repository.UserRepository;
import com.thecroods.resitrack.security.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/subs")
    public ResponseEntity<?> subscribeClient(
            @RequestBody AuthenticationRequest request) {

        if (userRepository.findByUsername(request.getUsername()) != null) {
            return ResponseEntity.badRequest()
                    .body(new AuthenticationResponse("User already exists"));
        }

        UserModel user = new UserModel();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepository.save(user);

        return ResponseEntity.ok(
                new AuthenticationResponse("Successful Subscription for client " + request.getUsername())
        );
    }

    @PostMapping("/auth")
    public ResponseEntity<?> authenticateClient(
            @RequestBody AuthenticationRequest request) {

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );
        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(401)
                    .body(new AuthenticationResponse("Invalid credentials"));
        }

        return ResponseEntity.ok(
                new AuthenticationResponse("Successful Authentication for client " + request.getUsername())
        );
    }
}
