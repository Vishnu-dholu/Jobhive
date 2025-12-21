package com.jobhive.backend.dto;

import com.jobhive.backend.entity.ApplicationStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ApplicationDTO {

    private Long id;                    // Application ID
    private Long jobId;                 // Which job ?
    private String jobTitle;            // Job Title
    private String jobLocation;         // Location

    private Long applicantId;
    private String applicantName;
    private String applicantEmail;

    private ApplicationStatus status;
    private LocalDateTime appliedAt;
}
