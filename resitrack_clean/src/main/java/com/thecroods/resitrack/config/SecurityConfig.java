package com.thecroods.resitrack.config;

import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                // WebSocket + REST APIs don't need CSRF
                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth
                                // 🔓 allow websocket handshake
                                .requestMatchers("/ws/**").permitAll()

                                // 🔓 allow metrics read (optional)
                                .requestMatchers("/api/metrics/**").permitAll()

                                // 🔓 allow auth endpoints if you have them
                                .requestMatchers("/api/auth/**").permitAll()
                                // change den to later
                                .requestMatchers("/api/status/**").permitAll()


                                // 🔐 everything else secured, (permitAll muna, change this later)
                                .anyRequest().permitAll()
                        //.anyRequest().authenticated()

                )

                // disable default login form
                .httpBasic(httpBasic -> httpBasic.disable())
                .formLogin(form -> form.disable());

        return http.build();
    }

    @PostConstruct
    public void loaded() {
        System.out.println("🔥 SecurityConfig LOADED");
    }

}
