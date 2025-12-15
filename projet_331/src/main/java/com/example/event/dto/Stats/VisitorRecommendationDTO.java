package com.example.event.dto.Stats;

import com.example.event.model.Event;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VisitorRecommendationDTO {
    private String recommandationGenerale;
    private String meilleurOrganisateur;
    private Double tauxOccupationMoyen;
    private List<Event> evenementsRecommandes; 
}