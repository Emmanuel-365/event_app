package com.example.event.repository;

import com.example.event.model.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubscriptionRepository extends JpaRepository<Subscription,Long> {
    boolean existsByCodeticket(String codeticket);

}
