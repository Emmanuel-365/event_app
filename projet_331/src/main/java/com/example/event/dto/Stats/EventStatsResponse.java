package com.example.event.dto.Stats;

import lombok.Data;
import java.util.List;

@Data
public class EventStatsResponse {
    
    private Long eventId;
    private String eventTitle;
    
    // Somme des places des abonnements avec statut REUSSI
    private Long totalSuccessfulSubscriptions; 
    
    // Somme des montants des abonnements avec statut REUSSI
    private Long totalRevenue; 
    
    // Capacité maximale définie dans Event.places
    private int maxCapacity; 
    
    // Taux d'occupation 
    private double occupancyRate; 
    
    // Répartition des places vendues par catégorie de billet
    private List<SubscriptionCountDTO> categoryDistribution;
}