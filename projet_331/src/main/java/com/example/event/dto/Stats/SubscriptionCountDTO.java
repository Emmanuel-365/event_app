package com.example.event.dto.Stats;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor 
public class SubscriptionCountDTO {
    
    // Intitulé du billet (ex: "VIP", "Standard")
    private String categoryIntitule; 
    
    // Nombre total de places vendues pour cette catégorie
    private Long totalPlaces; 
}