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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
    public Page<JobResponse> getAllJobs(String location, BigDecimal minSalary, JobType type, int page, int size){

        // 1. Create Pagination Request (Sort by Posted Date DESC)
        Pageable pageable = PageRequest.of(page, size, Sort.by("postedAt").descending());

        // 2. Fetch Paginated Data from Repo
        Page<Job> jobPage = jobRepository.searchJobs(location, minSalary, type, pageable);

        // 3. Map Page<Job> to Page<JobResponse>
        // .map() here is a special Spring Data method, not Stream .map()
        return jobPage.map(job -> JobResponse.builder()
                .id(job.getId())
                .title(job.getTitle())
                .description(job.getDescription())
                .location(job.getLocation())
                .salary(job.getSalary())
                .type(job.getType())
                .postedAt(job.getPostedAt())
                .postedByRecruiterName(job.getPostedBy().getName())
                .build()
        );
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

    // 3. Get jobs by id
    public JobResponse getJobById(Long id){
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));

        return mapToResponse(job);
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
