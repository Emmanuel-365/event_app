package com.example.event.dto.Subscription;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class SubscriptionResponse {
    private int montant;
    private int places;
    private LocalDateTime createdAt;
    private Long visitor_id;
    private String visitor_name;
    private String event_name;
    private String organizer_name;
    private String nom_ticket;
}
