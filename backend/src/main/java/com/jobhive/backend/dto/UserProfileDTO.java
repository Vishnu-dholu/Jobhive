package com.jobhive.backend.dto;

import com.jobhive.backend.entity.Role;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserProfileDTO {
    private Long id;
    private String name;
    private String email;
    private Role role;

    private String headline;
    private String bio;
    private String location;
    private String skills;
}
