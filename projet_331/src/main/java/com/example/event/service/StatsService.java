package com.example.event.service;

import com.example.event.dto.Stats.EventStatsResponse;
import com.example.event.Exception.EntityNotFoundException;
//import com.example.event.dto.Stats.EventStatsResponse;
import com.example.event.dto.Stats.GeneralRecommendationDTO;
import com.example.event.dto.Stats.SubscriptionCountDTO;
//import com.example.event.dto.Stats.SubscriptionCountDTO;
import com.example.event.dto.Stats.TrendingEventDTO;
import com.example.event.dto.Stats.VisitorRecommendationDTO;
import com.example.event.model.Statut_Event;
import com.example.event.model.Event;
import com.example.event.model.Organizer;
//import com.example.event.model.Statut_Event;
import com.example.event.repository.EventRepository;
import com.example.event.repository.EventRepository.LocationPerformanceDTO;
import com.example.event.repository.EventRepository.TimingPerformanceDTO;
import com.example.event.repository.OrganizerRepository;
import com.example.event.repository.SubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.HashMap;
//import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class StatsService {

    private final EventRepository eventRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final OrganizerRepository organizerRepository;

    public EventStatsResponse getStatsByEvent(Long eventId) {
        
        // 1. Récupérer l'événement (pour la capacité et le titre)
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Événement non trouvé avec ID: " + eventId));
        
        // 2. Récupérer les données agrégées
        Long totalSuccessfulSubs = subscriptionRepository.countSuccessfulPlacesByEventId(eventId).orElse(0L);
        Long totalRevenue = subscriptionRepository.sumSuccessfulMontantByEventId(eventId).orElse(0L);
        List<SubscriptionCountDTO> distribution = subscriptionRepository.countPlacesByTicketCategoryAndEventId(eventId);
        
        int maxCapacity = event.getPlaces();
        double occupancyRate = 0.0;
        
        if (maxCapacity > 0) {
            occupancyRate = ((double) totalSuccessfulSubs / maxCapacity) * 100.0;
        }

        
        EventStatsResponse response = new EventStatsResponse();
        response.setEventId(eventId);
        response.setEventTitle(event.getTitle());
        response.setMaxCapacity(maxCapacity);
        response.setTotalSuccessfulSubscriptions(totalSuccessfulSubs);
        response.setTotalRevenue(totalRevenue);
        
        response.setOccupancyRate(Math.round(occupancyRate * 100.0) / 100.0); 
        response.setCategoryDistribution(distribution);

        return response;
    }

    //  Statistiques Globales : Répartition des événements par statut ---
    public Map<Statut_Event, Long> getGlobalEventStatusStats() {
        List<Object[]> results = eventRepository.countEventsByStatus();
        Map<Statut_Event, Long> stats = new HashMap<>();

        for (Object[] result : results) {
            Statut_Event status = (Statut_Event) result[0];
            Long count = (Long) result[1];
            stats.put(status, count);
        }

        return stats;
    }

    
    // --- Recommandation pour l'Organisateur : Meilleurs Lieux 
    public List<LocationPerformanceDTO> getBestLocationRecommendations(Long id_organizer) {
        return eventRepository.findAveragePerformanceByLocation(id_organizer).stream()
                .sorted((d1, d2) -> d2.getAverageRevenue().compareTo(d1.getAverageRevenue()))
                .collect(Collectors.toList());
    }

    // --- Recommandation pour l'Organisateur : Meilleur Moment (WHEN) ---
    
    public List<TimingPerformanceDTO> getBestTimingRecommendations(Long id_organizer) {
        return eventRepository.findAveragePerformanceByMonth(id_organizer).stream()
                .sorted((d1, d2) -> d2.getAverageRevenue().compareTo(d1.getAverageRevenue()))
                .collect(Collectors.toList());
    }
    
    // --- Recommandation pour le Visiteur : Événements Tendance */
    public List<TrendingEventDTO> getTrendingEvents(int limit) {
        return eventRepository.findAll().stream()
            .map(event -> {
                Long sold = subscriptionRepository.countSuccessfulPlacesByEventId(event.getId()).orElse(0L);
                double occupancyRate = event.getPlaces() > 0 ? (Math.round(((double) sold / event.getPlaces()) * 10000.0) / 100.0) : 0.0;
                
                return new TrendingEventDTO(
                    event.getId(),
                    event.getTitle(),
                    event.getLieu(),
                    event.getPlaces(),
                    occupancyRate
                );
            })
            // 2. Filtrer les événements sans places vendues pour ne montrer que la "tendance"
            .filter(dto -> dto.getOccupancyRate() > 0.0) 
            // 3. Trier par taux d'occupation décroissant
            .sorted(Comparator.comparing(TrendingEventDTO::getOccupancyRate).reversed())
            // 4. Appliquer la limite
            .limit(limit)
            .collect(Collectors.toList());
    }


    
     /*  Fournit une recommandation générale basée sur l'historique de performance (Lieu + Timing).
     */
    public GeneralRecommendationDTO getGeneralRecommendation(Long id_organizer) { 
        GeneralRecommendationDTO dto = new GeneralRecommendationDTO();
        
        //  Trouver le Meilleur Lieu (Filtre par Organisateur)
        Optional<LocationPerformanceDTO> bestLocation = this.getBestLocationRecommendations(id_organizer).stream()
                .filter(p -> p.getAverageRevenue() != null && p.getAverageRevenue() > 0)
                .max(Comparator.comparingDouble(LocationPerformanceDTO::getAverageRevenue));

        //  Trouver le Meilleur Mois (Filtre par Organisateur)
        Optional<TimingPerformanceDTO> bestTiming = this.getBestTimingRecommendations(id_organizer).stream()
                .filter(p -> p.getAverageRevenue() != null && p.getAverageRevenue() > 0)
                .max(Comparator.comparingDouble(TimingPerformanceDTO::getAverageRevenue));

        
        if (bestLocation.isPresent() && bestTiming.isPresent()) {
            LocationPerformanceDTO bestL = bestLocation.get();
            TimingPerformanceDTO bestT = bestTiming.get();

            String[] mois = {"Janvier", "Février", "Mars", "Avril", "Mai", "Juin", 
                             "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"};
            String nomMois = mois[bestT.getMonth() - 1];
            
            dto.setMeilleurLieu(bestL.getLieu());
            dto.setRevenuMoyenLieu(bestL.getAverageRevenue());
            dto.setMeilleurMois(nomMois);
            dto.setRevenuMoyenMois(bestT.getAverageRevenue());
            
            // Génération de la recommandation
            String lieuFormat = String.format(Locale.FRANCE, "%,.0f XAF", bestL.getAverageRevenue());
            String moisFormat = String.format(Locale.FRANCE, "%,.0f XAF", bestT.getAverageRevenue());

            String recommendation = String.format(
                "Au vu de vos événements passés, le lieu le plus rentable est %s (Moyenne : %s). La meilleure période est %s (Moyenne : %s). Il est fortement recommandé d'organiser votre prochain événement le plus important à %s en %s.",
                bestL.getLieu(), lieuFormat, nomMois, moisFormat, bestL.getLieu(), nomMois
            );
            dto.setRecommandationGenerale(recommendation);
        } else {
            dto.setRecommandationGenerale("Historique insuffisant. Veuillez enregistrer plus d'événements 'TERMINÉ' et de souscriptions 'REUSSI' pour une analyse.");
        }

        return dto;
    }


     /* IA pour Visiteur : Propose des événements futurs organisés par les 5 meilleurs organisateurs historiques.
     */
    public VisitorRecommendationDTO getRecommendationsByBestOrganizer() {
        VisitorRecommendationDTO dto = new VisitorRecommendationDTO();
        final int TOP_N = 5; 
        final double MIN_OCCUPANCY = 0.10; 

        // 1. Calculer le score de chaque Organisateur 
        List<EventRepository.OrganizerPerformanceDTO> topOrganizers = eventRepository.findAverageOccupancyByOrganizer().stream()
                .filter(p -> p.getAverageOccupancy() != null && p.getAverageOccupancy() >= MIN_OCCUPANCY) 
                .sorted(Comparator.comparingDouble(EventRepository.OrganizerPerformanceDTO::getAverageOccupancy).reversed())
                .limit(TOP_N)
                .collect(Collectors.toList());

        if (topOrganizers.isEmpty()) { 
            dto.setRecommandationGenerale("Nous n'avons pas assez d'historique de performance pour des recommandations. Découvrez nos événements les plus récents :");
            
            // Recommandation par défaut (événements futurs triés par date)
            List<Event> popularEvents = eventRepository.findAll().stream()
                .filter(e -> e.getStatut() == Statut_Event.PROCHAINEMENT || e.getStatut() == Statut_Event.EN_COURS)
                .sorted(Comparator.comparing(Event::getDebut))
                .limit(5)
                .collect(Collectors.toList());
                
            dto.setEvenementsRecommandes(popularEvents);
            return dto;
        }

        
        // Liste des IDs des meilleurs Organisateurs
        List<Long> topOrganizerIds = topOrganizers.stream()
                                                  .map(EventRepository.OrganizerPerformanceDTO::getOrganizerId)
                                                  .collect(Collectors.toList());

        // Calcul du taux d'occupation moyen 
        Double overallTopAverage = topOrganizers.stream()
                                                .mapToDouble(EventRepository.OrganizerPerformanceDTO::getAverageOccupancy)
                                                .average()
                                                .orElse(0.0);
                                                
        Long bestOrganizerId = topOrganizers.get(0).getOrganizerId();
        Organizer topOrganizer = organizerRepository.findById(bestOrganizerId).orElse(null); 
        String bestOrganizerName = (topOrganizer != null) ? topOrganizer.getName() : "Notre Top Organisateur";


        // 2. Filtrer les événements futurs de ce groupe d'Organisateurs
        List<Event> recommendedEvents = eventRepository.findAll().stream()
                .filter(e -> e.getOrganizer() != null && topOrganizerIds.contains(e.getOrganizer().getId()))
                .filter(e -> e.getStatut() == Statut_Event.PROCHAINEMENT || e.getStatut() == Statut_Event.EN_COURS)
                .sorted(Comparator.comparing(Event::getDebut)) 
                .limit(10) 
                .collect(Collectors.toList());
        
        // 3. Générer la phrase de recommandation
        String tauxFormat = String.format(Locale.FRANCE, "%,.1f%%", overallTopAverage * 100);
        String recommendation = String.format(
            "Basé sur la performance historique (%s de taux d'occupation moyen), nous vous recommandons les événements à venir de nos %d meilleurs organisateurs, dont %s.",
            tauxFormat, topOrganizers.size(), bestOrganizerName
        );

        
        dto.setRecommandationGenerale(recommendation);
        dto.setMeilleurOrganisateur(bestOrganizerName);
        dto.setTauxOccupationMoyen(overallTopAverage);
        dto.setEvenementsRecommandes(recommendedEvents);

        return dto;
    }
}