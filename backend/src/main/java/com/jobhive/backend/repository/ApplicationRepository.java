package com.jobhive.backend.repository;


import com.jobhive.backend.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    // 1. Check if this specific user has already applied for this specific job
    boolean existsByApplicantIdAndJobId(Long applicantId, Long jobId);

    // 2. Find all applications for a specific Job (For Recruiters)
    List<Application> findByJobId(Long jobId);

    // 3. Find all applications by a specific User (For Applicants)
    List<Application> findByApplicantId(Long applicantId);

    List<Application> findByJobPostedByEmail(String email);
}
