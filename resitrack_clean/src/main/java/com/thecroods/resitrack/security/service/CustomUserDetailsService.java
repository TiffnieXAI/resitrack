package com.thecroods.resitrack.security.service;

import com.thecroods.resitrack.security.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {


    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        if(userRepository.findByUsername(username) == null) {
            throw new UsernameNotFoundException(username + " not found");
        }

        return userRepository.findByUsername(username);
    }
}
