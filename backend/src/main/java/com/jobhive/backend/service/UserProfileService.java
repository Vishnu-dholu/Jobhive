package com.jobhive.backend.service;

import com.jobhive.backend.dto.UserProfileDTO;
import com.jobhive.backend.entity.User;
import com.jobhive.backend.entity.UserProfile;
import com.jobhive.backend.exception.ResourceNotFoundException;
import com.jobhive.backend.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class UserProfileService {

    private final UserProfileRepository userProfileRepository;
    private final UserService userService; // Inject Service, not Repo
    private final FileStorageService fileStorageService;

    // 1. GET PROFILE (Merges User + UserProfile data)
    public UserProfileDTO getProfile(String email) {
        User user = userService.getUserByEmail(email);

        // Find profile or return an empty temporary one if not created yet
        UserProfile profile = userProfileRepository.findByUserId(user.getId())
                .orElse(new UserProfile());

        return UserProfileDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                // Fields from UserProfile entity
                .headline(profile.getHeadline())
                .bio(profile.getBio())
                .location(profile.getLocation())
                .skills(profile.getSkills())
                .build();
    }

    // 2. CREATE OR UPDATE PROFILE (Handles File + Text)
    public UserProfileDTO createOrUpdateProfile(String email, UserProfileDTO dto, MultipartFile resumeFile) {
        User user = userService.getUserByEmail(email);

        // Fetch existing or create new
        UserProfile profile = userProfileRepository.findByUserId(user.getId())
                .orElse(UserProfile.builder().user(user).build());

        // Update Text Fields
        profile.setHeadline(dto.getHeadline());
        profile.setBio(dto.getBio());
        profile.setLocation(dto.getLocation());
        profile.setSkills(dto.getSkills());

        // Handle File Upload (Optional)
        if (resumeFile != null && !resumeFile.isEmpty()) {
            String fileName = fileStorageService.storeFile(resumeFile);
            profile.setResumeFilePath(fileName);
        }

        // Save
        userProfileRepository.save(profile);

        // Update Name in User table if changed
        if (dto.getName() != null && !dto.getName().equals(user.getName())) {
            // Note: You might want a specific method in UserService for this
            user.setName(dto.getName());
            // Saving via UserProfile doesn't save User automatically unless Cascade is set.
            // For now, let's assume we aren't updating the name here to keep it simple.
        }

        return getProfile(email); // Return the updated DTO
    }

    // 3. GET RESUME
    public Resource getResume(String email) {
        User user = userService.getUserByEmail(email);
        UserProfile profile = userProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));

        if (profile.getResumeFilePath() == null) {
            throw new RuntimeException("No resume uploaded.");
        }
        return fileStorageService.loadFileAsResource(profile.getResumeFilePath());
    }
}