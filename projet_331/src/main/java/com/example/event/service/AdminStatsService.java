package com.example.event.service;

import com.example.event.dto.Stats.AdminDashboardStatsDto;
import com.example.event.repository.EventRepository;
import com.example.event.repository.SubscriptionRepository;
import com.example.event.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminStatsService {

    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final SubscriptionRepository subscriptionRepository;

    @Transactional(readOnly = true)
    public AdminDashboardStatsDto getAdminDashboardStats() {
        long totalUsers = userRepository.count();
        long totalEvents = eventRepository.count();
        long totalSubscriptions = subscriptionRepository.count();
        long totalRevenue = subscriptionRepository.sumSuccessfulMontant().orElse(0L);

        return new AdminDashboardStatsDto(totalUsers, totalEvents, totalSubscriptions, totalRevenue);
    }
}

