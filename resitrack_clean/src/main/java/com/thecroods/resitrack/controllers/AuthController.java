package com.thecroods.resitrack.controllers;

import com.thecroods.resitrack.models.Roles;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

public class AuthController {

    @Autowired
    UserRepository userRepo;

    @PostMapping("/signup")
    public ResponseEntity<?> signupUser (@Valid @RequestBody SignupRequest signupRequest) {
        if(userRepo.existsByUsername(signupRequest.getUsername())){
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
        }

        if(userRepo.existsByEmail(signupRequest.getEmail())){
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already taken!"));
        }


        return ResponseEntity.ok().build();
    }
}
