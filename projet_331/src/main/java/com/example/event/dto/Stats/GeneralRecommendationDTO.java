package com.example.event.dto.Stats;

import lombok.Data;

@Data
public class GeneralRecommendationDTO {
    private String meilleurMois;
    private String meilleurLieu;
    private Double revenuMoyenMois;
    private Double revenuMoyenLieu;
    private String recommandationGenerale;
}