package com.example.event.dto.Subscription;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class SubscriptionResponse {
    private Long id;
    private int montant;
    private int places;
    private LocalDateTime createdAt;
    private Long visitor_id;
    private String visitor_name;
    private Long event_id;
    private String event_name;
    private LocalDate event_debut;
    private String event_lieu;
    private String organizer_name;
    private String nom_ticket;
}
