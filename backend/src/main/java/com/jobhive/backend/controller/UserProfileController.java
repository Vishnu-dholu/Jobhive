package com.jobhive.backend.controller;

import com.jobhive.backend.dto.UserProfileDTO;
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
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserProfileService userProfileService;

    @PostMapping(value = "/profile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserProfileDTO> updateProfile(
            @RequestParam(value = "headline", required = false) String headline,
            @RequestParam(value = "bio", required = false) String bio,
            @RequestParam(value = "location", required = false) String location,
            @RequestParam(value = "skills", required = false) String skills,
            @RequestParam(value = "resume", required = false)MultipartFile resume,
            Authentication authentication
            ){
        // Construct a temporary DTO to pass to the service
        UserProfileDTO requestDTO = UserProfileDTO.builder()
                .headline(headline)
                .bio(bio)
                .location(location)
                .skills(skills)
                .build();

        String email = authentication.getName();

        // Call the service and return the UPDATED DTO
        UserProfileDTO updatedProfile = userProfileService.createOrUpdateProfile(email, requestDTO, resume);

        return ResponseEntity.ok(updatedProfile);
    }

    @GetMapping("/profile")
    public ResponseEntity<UserProfileDTO> getMyProfile(Authentication authentication){
        String email = authentication.getName();
        return ResponseEntity.ok(userProfileService.getProfile(email));
    }

    @GetMapping("/profile/resume")
    public ResponseEntity<Resource> downloadResume(Authentication authentication){
        String email = authentication.getName();
        Resource resource = userProfileService.getResume(email);

        // We try to determine the file name
        String filename = resource.getFilename();

        return ResponseEntity.ok()
                // Content-Type: application/pdf (Force browser to handle it as file)
                .contentType(MediaType.APPLICATION_PDF)
                // Content-Disposition: inline (View in browser) or attachment (Download)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                .body(resource);
    }
}
