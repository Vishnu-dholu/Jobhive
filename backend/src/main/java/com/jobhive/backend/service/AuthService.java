package com.jobhive.backend.service;

import com.jobhive.backend.dto.AuthRequest;
import com.jobhive.backend.dto.AuthResponse;
import com.jobhive.backend.dto.UserDTO;
import com.jobhive.backend.entity.User;
import com.jobhive.backend.repository.UserRepository;
import com.jobhive.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public String register(UserDTO userDTO){
        // 1. Check if email already exists
        if(userRepository.findByEmail(userDTO.getEmail()).isPresent()){
            throw new RuntimeException("Email already in use");
        }

        // 2. Hash the password
        String encodedPassword = passwordEncoder.encode(userDTO.getPassword());

        // 3. Save User
        User user = User.builder()
                .name(userDTO.getName())
                .email(userDTO.getEmail())
                .password(encodedPassword)
                .role(userDTO.getRole())
                .build();

        userRepository.save(user);

        return "User registered successfully";
    }

    public AuthResponse login(AuthRequest request){
        // 1. Find User
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));

        // 2. Check Password
        if(!passwordEncoder.matches(request.getPassword(), user.getPassword())){
            throw new RuntimeException("Invalid username or password");
        }

        // 3. Generate Token
        String token = jwtUtil.generateToken(user.getEmail());

        return new AuthResponse(token);
    }
}
