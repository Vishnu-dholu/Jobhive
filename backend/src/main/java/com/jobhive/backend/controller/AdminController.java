package com.jobhive.backend.controller;

import com.jobhive.backend.dto.AdminStatsDTO;
import com.jobhive.backend.dto.UserDTO;
import com.jobhive.backend.entity.Job;
import com.jobhive.backend.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsDTO> getStats(){
        return ResponseEntity.ok(adminService.getStats());
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getALlUsers(){
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id){
        adminService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully");
    }

    @GetMapping("/jobs")
    public ResponseEntity<List<Job>> getAllJobs(){
        return ResponseEntity.ok(adminService.getAllJobs());
    }

    @DeleteMapping("/job/{id}")
    public ResponseEntity<String> deleteJob(@PathVariable Long id){
        adminService.deleteJob(id);
        return ResponseEntity.ok("Job deleted successfully");
    }
}
