package com.jobhive.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminStatsDTO {
    private long totalUsers;
    private long totalJobs;
    private long totalApplications;
}
