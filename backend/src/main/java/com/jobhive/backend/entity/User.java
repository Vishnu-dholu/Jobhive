package com.jobhive.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data   // Lombok: Generates Getters, Setters, toString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)     // Auto Increment
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;    // Will store hashed password later

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)    // Stores "ADMIN" as a string in DB, not a number
    @Column(nullable = false)
    private Role role;
}
