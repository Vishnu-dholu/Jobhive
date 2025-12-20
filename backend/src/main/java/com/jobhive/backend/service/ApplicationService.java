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

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public void applyForJob(Long jobId, String applicantEmail){

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

        // 4. Create and Save Application
        Application application = Application.builder()
                .job(job)
                .applicant(applicant)
                .status(ApplicationStatus.PENDING)
                .build();

        applicationRepository.save(application);
    }

    // Get all applications for the logged-in Applicant
    public List<ApplicationDTO> getMyApplication(String email){

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
                        .build())
                .collect(Collectors.toList());
    }
}
