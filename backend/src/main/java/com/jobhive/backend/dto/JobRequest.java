package com.jobhive.backend.dto;

import com.jobhive.backend.entity.JobType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class JobRequest {

    @NotBlank
    private String title;

    @Size(min = 10)
    private String description;

    @NotBlank
    private String location;

    @Min(0)
    private BigDecimal salary;

    @NotNull(message = "Job Type is required")
    private JobType type;

    @NotNull(message = "Requirements is necessary")
    private String requirements;
}
