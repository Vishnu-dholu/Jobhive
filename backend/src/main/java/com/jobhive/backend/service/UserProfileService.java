package com.jobhive.backend.service;

import com.jobhive.backend.entity.User;
import com.jobhive.backend.entity.UserProfile;
import com.jobhive.backend.repository.UserProfileRepository;
import com.jobhive.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class UserProfileService {

    private final UserProfileRepository userProfileRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    public UserProfile createOrUpdateProfile(String email, String city, String skills, MultipartFile resumeFile){

        // 1. Find User
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Store the File
        String resumeFileName = null;
        if(resumeFile != null && !resumeFile.isEmpty()){
            resumeFileName = fileStorageService.storeFile(resumeFile);
        }

        // 3. Check if profile exists
        UserProfile profile = userProfileRepository.findByUserId(user.getId())
                .orElse(new UserProfile()); // Create new if not exists

        // 4. Update fields
        profile.setUser(user);
        profile.setCity(city);
        profile.setSkills(skills);

        // Only update resume path if a new file was uploaded
        if(resumeFile != null){
            profile.setResumeFilePath(resumeFileName);
        }

        return userProfileRepository.save(profile);
    }

    // Helper to get profile
    public UserProfile getProfile(String email){
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return userProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Profile not found"));
    }

    // Get the resume file for the logged-in user
    public Resource getResume(String email){
        // 1. Get Profile
        UserProfile profile = getProfile(email);

        // 2. Check if resume exists
        if(profile.getResumeFilePath() == null){
            throw new RuntimeException("No resume uploaded for this user.");
        }

        // 3. Load file
        return fileStorageService.loadFileAsResource(profile.getResumeFilePath());
    }
}
