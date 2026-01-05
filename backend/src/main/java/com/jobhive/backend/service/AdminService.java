package com.jobhive.backend.service;

import com.jobhive.backend.dto.AdminStatsDTO;
import com.jobhive.backend.dto.UserDTO;
import com.jobhive.backend.entity.Job;
import com.jobhive.backend.repository.ApplicationRepository;
import com.jobhive.backend.repository.JobRepository;
import com.jobhive.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;

    // 1. Get Platform Stats
    public AdminStatsDTO getStats(){
        return AdminStatsDTO.builder()
                .totalUsers(userRepository.count())
                .totalJobs(jobRepository.count())
                .totalApplications(applicationRepository.count())
                .build();
    }

    // 2. Get All Users
    public List<UserDTO> getAllUsers(){
        return userRepository.findAll().stream().map(user -> {
            UserDTO dto = new UserDTO();
            dto.setId(user.getId());
            dto.setName(user.getName());
            dto.setEmail(user.getEmail());
            dto.setRole(user.getRole());

            return dto;
        }).collect(Collectors.toList());
    }

    // 3. Delete User
    public void deleteUser(Long id){
        userRepository.deleteById(id);
    }

    // 4. Get All Jobs
    public List<Job> getAllJobs(){
        return jobRepository.findAll();
    }

    // 5. Delete Job
    public void deleteJob(Long id){
        jobRepository.deleteById(id);
    }
}
