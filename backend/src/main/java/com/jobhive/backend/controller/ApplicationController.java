package com.jobhive.backend.controller;

import com.jobhive.backend.dto.ApplicationDTO;
import com.jobhive.backend.entity.ApplicationStatus;
import com.jobhive.backend.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping("/{jobId}/apply")
    @PreAuthorize("hasRole('APPLICANT')")
    // Added 'throws IOException' so the Global Handler catches it
    public ResponseEntity<String> applyForJob(
            @PathVariable Long jobId,
            @RequestParam("resume") MultipartFile resume,
            Authentication authentication) throws IOException {

        String email = authentication.getName();
        applicationService.applyForJob(jobId, email, resume);

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

    @GetMapping("/{applicationId}/resume")
    @PreAuthorize("hasAnyRole('RECRUITER', 'APPLICANT')")
    // Added 'throws MalformedURLException'
    public ResponseEntity<Resource> downloadResume(@PathVariable Long applicationId, Authentication authentication) throws MalformedURLException {
        String email = authentication.getName();

        Resource resource = applicationService.getResumeFile(applicationId, email);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("application/pdf"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}