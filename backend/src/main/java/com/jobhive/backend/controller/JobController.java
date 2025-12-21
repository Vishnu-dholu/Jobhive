package com.jobhive.backend.controller;

import com.jobhive.backend.dto.JobRequest;
import com.jobhive.backend.dto.JobResponse;
import com.jobhive.backend.entity.JobType;
import com.jobhive.backend.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    // GET  /api/jobs
    @GetMapping
    public ResponseEntity<List<JobResponse>> getAllJobs(
            @RequestParam(required = false) String location,
            @RequestParam(required = false)BigDecimal minSalary,
            @RequestParam(required = false)JobType type
            ){
        return ResponseEntity.ok(jobService.getAllJobs(location, minSalary, type));
    }

    // POST /api/jobs
    @PostMapping
    public ResponseEntity<JobResponse> createJob(@Valid @RequestBody JobRequest request){
        return new ResponseEntity<>(jobService.createJob(request), HttpStatus.CREATED);
    }
}
