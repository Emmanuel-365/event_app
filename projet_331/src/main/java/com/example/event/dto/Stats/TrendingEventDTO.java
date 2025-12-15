package com.example.event.dto.Stats;

import lombok.Data;

@Data
public class TrendingEventDTO {
    private Long id;
    private String title;
    private String lieu;
    private int places;
    private double occupancyRate; // Le score d'occupation
    
    
    public TrendingEventDTO(Long id, String title, String lieu, int places, double occupancyRate) {
        this.id = id;
        this.title = title;
        this.lieu = lieu;
        this.places = places;
        this.occupancyRate = occupancyRate;
    }
}