package com.jobhive.backend.dto;

import com.jobhive.backend.entity.JobType;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class JobResponse {
    private Long id;
    private String title;
    private String description;
    private String location;
    private BigDecimal salary;
    private JobType type;
    private LocalDateTime postedAt;
    private String postedByRecruiterName;   // Just the name
}
