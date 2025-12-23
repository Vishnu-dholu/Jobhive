package com.jobhive.backend.repository;

import com.jobhive.backend.entity.Job;
import com.jobhive.backend.entity.JobType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;

@Repository
public interface JobRepository extends JpaRepository<Job, Long>, JpaSpecificationExecutor<Job> {
    // The Query handles nulls: (:param IS NULL OR column = :param)
    @Query("SELECT j FROM Job j WHERE " +
        "(:location IS NULL OR j.location LIKE %:location%) AND " +
            "(:minSalary IS NULL OR j.salary >= :minSalary) AND " +
            "(:type IS NULL OR j.type = :type)")
    Page<Job> searchJobs(
            @Param("location") String location,
            @Param("minSalary")BigDecimal minSalary,
            @Param("type")JobType type,
            Pageable pageable
            );
}
