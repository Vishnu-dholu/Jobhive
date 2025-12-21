package com.jobhive.backend.service;

import com.jobhive.backend.dto.JobRequest;
import com.jobhive.backend.dto.JobResponse;
import com.jobhive.backend.entity.Job;
import com.jobhive.backend.entity.JobType;
import com.jobhive.backend.entity.User;
import com.jobhive.backend.exception.ResourceNotFoundException;
import com.jobhive.backend.repository.JobRepository;
import com.jobhive.backend.repository.UserRepository;
import com.jobhive.backend.specification.JobSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    // 1. Get all jobs
    public List<JobResponse> getAllJobs(String location, BigDecimal minSalary, JobType type){

        // 1. Build the dynamic query
        Specification<Job> spec = JobSpecification.filterJobs(location, minSalary, type);

        // 2. Pass the 'spec' to findAll()
        return jobRepository.findAll(spec).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // 2. Create a job
    public JobResponse createJob(JobRequest request, String userEmail){
        // Find the use who is logged in
        User recruiter = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Convert DTO -> Entity
        Job job = mapToEntity(request);

        // Link the job to the user
        job.setPostedBy(recruiter);

        // Save to DB
        Job savedJob = jobRepository.save(job);

        // Return DTO
        return mapToResponse(savedJob);
    }

    // Helper 1: convert Entity -> DTO
    private JobResponse mapToResponse(Job job){
        return JobResponse.builder()
                .id(job.getId())
                .title(job.getTitle())
                .description(job.getDescription())
                .location(job.getLocation())
                .salary(job.getSalary())
                .type(job.getType())
                .postedAt(job.getPostedAt())
                .postedByRecruiterName(job.getPostedBy().getName())
                .build();
    }

    // Helper 2: convert DTO -> Entity
    private Job mapToEntity(JobRequest request){
        return Job.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .location(request.getLocation())
                .salary(request.getSalary())
                .type(request.getType())
                .build();
    }
}
