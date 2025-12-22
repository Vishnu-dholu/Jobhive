package com.jobhive.backend.service;

import com.jobhive.backend.dto.ApplicationDTO;
import com.jobhive.backend.entity.Application;
import com.jobhive.backend.entity.ApplicationStatus;
import com.jobhive.backend.entity.Job;
import com.jobhive.backend.entity.User;
import com.jobhive.backend.exception.ResourceNotFoundException;
import com.jobhive.backend.repository.ApplicationRepository;
import com.jobhive.backend.repository.JobRepository;
import com.jobhive.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    private final String UPLOAD_DIR = "uploads/";

    public void applyForJob(Long jobId, String applicantEmail, MultipartFile resumeFile) throws IOException {

        // 1. Find the Job
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        // 2. Find the User (applicant)
        User applicant = userRepository.findByEmail(applicantEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // 3. Check if already applied
        boolean alreadyApplied = applicationRepository.existsByApplicantIdAndJobId(applicant.getId(), jobId);
        if(alreadyApplied){
            throw new RuntimeException("You have already applied for this job!");
        }

        String filename = UUID.randomUUID() + "_" + resumeFile.getOriginalFilename();
        Path path = Paths.get(UPLOAD_DIR + filename);

        // Create directory if it doesn't exist
        Files.createDirectories(path.getParent());
        // Save file
        Files.write(path, resumeFile.getBytes());


        // 4. Create and Save Application
        Application application = Application.builder()
                .job(job)
                .applicant(applicant)
                .status(ApplicationStatus.PENDING)
                .resumeUrl(path.toString())
                .build();

        applicationRepository.save(application);
    }

    // Get all applications for the logged-in Applicant
    public List<ApplicationDTO> getMyApplications(String email){

        // 1. Find User
        User applicant = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // 2. Fetch from DB
        List<Application> applications = applicationRepository.findByApplicantId(applicant.getId());

        // 3. Convert to DTOs
        return applications.stream()
                .map(app -> ApplicationDTO.builder()
                        .id(app.getId())
                        .jobId(app.getJob().getId())
                        .jobTitle(app.getJob().getTitle())
                        .jobLocation(app.getJob().getLocation())
                        .status(app.getStatus())
                        .appliedAt(app.getAppliedAt())
                        .applicantId(app.getApplicant().getId())
                        .applicantName(app.getApplicant().getName())
                        .applicantEmail(app.getApplicant().getEmail())
                        .build())
                .collect(Collectors.toList());
    }

    // Get all applications for a specific Job (Recruiter Only)
    public List<ApplicationDTO> getApplicationsForJob(Long jobId, String recruiterEmail){

        // 1. Find the Job
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        // 2. SECURITY CHECK: Is this YOUR job?
        // We check if the email of the person calling this API matches the email of the person who posted the job.
        if(!job.getPostedBy().getEmail().equals(recruiterEmail)){
            throw new RuntimeException("You are not authorized to view applications for this job.");
        }

        // 3. Fetch Applications
        List<Application> applications = applicationRepository.findByJobId(jobId);

        // 4. Convert to DTOs
        return applications.stream()
                .map(app -> ApplicationDTO.builder()
                        .id(app.getId())
                        .jobId(app.getJob().getId())
                        .jobTitle(app.getJob().getTitle())
                        .jobLocation(app.getJob().getLocation())
                        .applicantId(app.getApplicant().getId())
                        .applicantName(app.getApplicant().getName())
                        .applicantEmail(app.getApplicant().getEmail())
                        .status(app.getStatus())
                        .appliedAt(app.getAppliedAt())
                        .build()
                ).collect(Collectors.toList());
    }

    // Update Application Status (Recruiter Only)
    public void updateApplicationStatus(Long applicationId, ApplicationStatus newStatus, String recruiterEmail){

        // 1. Find the Application
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        // 2. Security Check: Does this job belong to the logged-in Recruiter?
        // We get the Job -> PostedBy -> Email and compare it.
        String ownerEmail = application.getJob().getPostedBy().getEmail();

        if(!ownerEmail.equals(recruiterEmail)){
            throw new RuntimeException("Unauthorized: You cannot update applications for jobs you didn't post.");
        }

        // 3. Update Status
        application.setStatus(newStatus);

        applicationRepository.save(application);

        // SEND EMAIL NOTIFICATION
        String applicantEmail = application.getApplicant().getEmail();
        String jobTitle = application.getJob().getTitle();

        String subject = "Update on your application for " + jobTitle;
        String body = "Hello " + application.getApplicant().getName() + ",\n\n" +
                "Your application status for " + jobTitle + " has been updated to: " + newStatus + ".\n\n" +
                "Best Regards,\nJobHive Team";

        emailService.sendEmail(applicantEmail, subject, body);
    }
}
