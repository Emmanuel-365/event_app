package com.example.event.controller;

import com.example.event.dto.Stats.EventStatsResponse;
import com.example.event.dto.Stats.GeneralRecommendationDTO;
import com.example.event.dto.Stats.TrendingEventDTO;
import com.example.event.dto.Stats.VisitorRecommendationDTO;
//import com.example.event.model.Event;
import com.example.event.model.Statut_Event;
import com.example.event.repository.EventRepository.LocationPerformanceDTO;
import com.example.event.repository.EventRepository.TimingPerformanceDTO;
import com.example.event.service.StatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stats") 
@RequiredArgsConstructor
public class StatsController {

    private final StatsService statsService;

    
    /*Endpoint pour obtenir les statistiques détaillées d'un événement.*/

    @GetMapping("/events/{eventId}")
    public ResponseEntity<EventStatsResponse> getStatsForEvent(@PathVariable Long eventId) {
        EventStatsResponse stats = statsService.getStatsByEvent(eventId);
        return ResponseEntity.ok(stats);
    }

    
    /* Endpoint pour obtenir le décompte global des événements par statut.*/

    @GetMapping("/global/status")
    public ResponseEntity<Map<Statut_Event, Long>> getGlobalStatusStats() {
        Map<Statut_Event, Long> stats = statsService.getGlobalEventStatusStats();
        return ResponseEntity.ok(stats);
    }

    
    // ENDPOINTS DE RECOMMANDATION POUR L'ORGANISATEUR SUR UN EVENEMENT
    


    
    /* IA: Recommande les lieux les plus rentables, filtré par organisateur. */
   
    @GetMapping("/recommendation/location/{id_organizer}")
    public ResponseEntity<List<LocationPerformanceDTO>> getBestLocationRecommendations(@PathVariable Long id_organizer) {
        List<LocationPerformanceDTO> recommendations = statsService.getBestLocationRecommendations(id_organizer);
        return ResponseEntity.ok(recommendations);
    }

     /* IA: Recommande les meilleurs mois, filtré par organisateur.*/
    @GetMapping("/recommendation/timing/{id_organizer}")
    public ResponseEntity<List<TimingPerformanceDTO>> getBestTimingRecommendations(@PathVariable Long id_organizer) {
        List<TimingPerformanceDTO> recommendations = statsService.getBestTimingRecommendations(id_organizer);
        return ResponseEntity.ok(recommendations);
    }
    

     /* IA: Fournit une recommandation générale, filtrée par organisateur.*/
    @GetMapping("/recommendation/general/{id_organizer}")
    public ResponseEntity<GeneralRecommendationDTO> getGeneralRecommendation(@PathVariable Long id_organizer) {
        GeneralRecommendationDTO recommendation = statsService.getGeneralRecommendation(id_organizer);
        return ResponseEntity.ok(recommendation);
    }
    
    // Endpoint de Recommandation pour le Visiteur 
    

     /* IA: Recommande les événements les plus populaires (basés sur l'occupation) pour tous les visiteurs.*/
    @GetMapping("/recommendation/trending")
    public ResponseEntity<List<TrendingEventDTO>> getTrendingEvents() {
        List<TrendingEventDTO> trendingEvents = statsService.getTrendingEvents(5);
        return ResponseEntity.ok(trendingEvents);
    }


    
     //MODEL IA pour Visiteur: Propose des événements futurs organisés par les meilleurs organisateurs historiques.

    @GetMapping("/recommendation/best-organizer")
    public ResponseEntity<VisitorRecommendationDTO> getEventsByBestOrganizer() {
        VisitorRecommendationDTO recommendation = statsService.getRecommendationsByBestOrganizer();
        return ResponseEntity.ok(recommendation);
    }

}