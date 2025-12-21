package com.jobhive.backend.specification;

import com.jobhive.backend.entity.Job;
import com.jobhive.backend.entity.JobType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class JobSpecification {

    // This static method returns the logic to filter jobs
    public static Specification<Job> filterJobs(String location, BigDecimal minSalary, JobType type){
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // 1. Filter by Location (Partial Match, Case Insensitive)
            // SQL: WHERE LOWER(location) LIKE %mumbai%
            if(location != null && !location.isEmpty()){
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("location")),
                        "%" + location.toLowerCase() + "%"));
            }

            // 2. Filter by Minimum Salary
            // SQL: WHERE salary >= 500000
            if(minSalary != null){
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("salary"), minSalary));
            }

            // 3. Filter by Job Type (Exact Match)
            // SQL: WHERE type = 'REMOTE'
            if(type != null){
                predicates.add(criteriaBuilder.equal(root.get("type"), type));
            }

            // Combine all conditions with AND
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
