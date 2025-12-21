package com.jobhive.backend.controller;

import com.jobhive.backend.entity.UserProfile;
import com.jobhive.backend.service.UserProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/users/profile")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserProfileService userProfileService;

    @PostMapping
    public ResponseEntity<UserProfile> updateProfile(
            @RequestParam("city") String city,
            @RequestParam("skills") String skills,
            @RequestParam(value = "resume", required = false)MultipartFile resume,
            Authentication authentication
            ){
        String email = authentication.getName();
        UserProfile profile = userProfileService.createOrUpdateProfile(email, city, skills, resume);

        return ResponseEntity.ok(profile);
    }

    @GetMapping
    public ResponseEntity<UserProfile> getMyProfile(Authentication authentication){
        String email = authentication.getName();
        return ResponseEntity.ok(userProfileService.getProfile(email));
    }

    @GetMapping("/resume")
    public ResponseEntity<Resource> downloadResume(Authentication authentication){
        String email = authentication.getName();
        Resource resource = userProfileService.getResume(email);

        // We try to determine the file name
        String filename = resource.getFilename();

        return ResponseEntity.ok()
                // Content-Type: application/pdf (Force browser to handle it as file)
                .contentType(MediaType.APPLICATION_PDF)
                // Content-Disposition: inline (View in browser) or attachment (Download)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename\"" + filename + "\"")
                .body(resource);
    }
}
