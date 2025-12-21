package com.jobhive.backend;

import com.jobhive.backend.entity.*;
import com.jobhive.backend.repository.ApplicationRepository;
import com.jobhive.backend.repository.JobRepository;
import com.jobhive.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;

    @Override
    public void run(String... args) throws Exception{
        // Only seed data if database is empty
        if(userRepository.count() > 0) return;

        System.out.println("Seeding Database with Test Data...");

        // 1. Create Users
        User recruiter = User.builder()
                .name("John Recruiter")
                .email("recruiter@jobhive.com")
                .password("pass123")
                .role(Role.RECRUITER)
                .build();
        userRepository.save(recruiter);

        User applicant = User.builder()
                .name("Jane Applicant")
                .email("jane@jobhive.com")
                .password("pass123")
                .role(Role.APPLICANT)
                .build();
        userRepository.save(applicant);

        // 2. Create a Job (Posted by Recruiter)
        Job job = Job.builder()
                .title("Junior Java Developer")
                .description("Great opportunity for juniors!")
                .location("Remote")
                .salary(new BigDecimal("1200000"))
                .type(JobType.REMOTE)
                .postedBy(recruiter)
                .build();
        jobRepository.save(job);

        // 3. Create an Application (Applicant applies to Job)
        Application app = Application.builder()
                .applicant(applicant)
                .job(job)
                .status(ApplicationStatus.PENDING)
                .build();
        applicationRepository.save(app);

        System.out.println("Data Seeding Completed!");
    }
}
