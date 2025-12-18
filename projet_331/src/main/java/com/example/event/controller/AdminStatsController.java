package com.example.event.controller;

import com.example.event.dto.Stats.AdminDashboardStatsDto;
import com.example.event.service.AdminStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/stats")
@RequiredArgsConstructor
public class AdminStatsController {

    private final AdminStatsService adminStatsService;

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardStatsDto> getAdminDashboardStats() {
        AdminDashboardStatsDto stats = adminStatsService.getAdminDashboardStats();
        return ResponseEntity.ok(stats);
    }
}
