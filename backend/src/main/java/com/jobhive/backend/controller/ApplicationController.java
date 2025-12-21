package com.jobhive.backend.controller;

import com.jobhive.backend.dto.ApplicationDTO;
import com.jobhive.backend.entity.ApplicationStatus;
import com.jobhive.backend.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping("/{jobId}/apply")
    @PreAuthorize("hasRole('APPLICANT')")
    public ResponseEntity<String> applyForJob(@PathVariable Long jobId, Authentication authentication) {
        // 1. Get current user's email
        String email = authentication.getName();

        // 2. Call service
        applicationService.applyForJob(jobId, email);

        return new ResponseEntity<>("Application submitted successfully!", HttpStatus.CREATED);
    }

    @GetMapping("/my-applications")
    @PreAuthorize("hasRole('APPLICANT')")
    public ResponseEntity<List<ApplicationDTO>> getMyApplications(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(applicationService.getMyApplications(email));
    }

    @GetMapping("/jobs/{jobId}")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<List<ApplicationDTO>> getApplicationsForJob(@PathVariable Long jobId, Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(applicationService.getApplicationsForJob(jobId, email));
    }

    @PutMapping("/{applicationId}/status")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<String> updateStatus(
            @PathVariable Long applicationId,
            @RequestParam ApplicationStatus status,
            Authentication authentication
            ){
        String email = authentication.getName();

        applicationService.updateApplicationStatus(applicationId, status, email);

        return ResponseEntity.ok("Application status updated to " + status);
    }
}
