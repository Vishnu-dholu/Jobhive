package com.jobhive.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    // 1. The Hashing tool
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 2. The Security Filter Chain
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Disable CSRF (Cross-Site Request Forgery) because we are using stateless REST APIs
                .csrf(AbstractHttpConfigurer::disable)

                // Define who can access what
                .authorizeHttpRequests(auth -> auth
                        // Allow everyone to access these specific patterns
                        .requestMatchers("/api/auth/**", "/api/jobs/**").permitAll()

                        // Lock everything else (we will refine this later)
                        .anyRequest().authenticated()
                );

        return http.build();
    }
}
