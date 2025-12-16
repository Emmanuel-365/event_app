package com.example.event.service;

import com.example.event.Exception.EntityNotFoundException;
import com.example.event.dto.Stats.EventStatsResponse;
import com.example.event.dto.Stats.GeneralRecommendationDTO;
import com.example.event.dto.Stats.SubscriptionCountDTO;
import com.example.event.dto.Stats.TrendingEventDTO;
import com.example.event.dto.Stats.VisitorRecommendationDTO;
import com.example.event.model.Event;
import com.example.event.model.OrganizerProfile;
import com.example.event.model.Statut_Event;
import com.example.event.repository.EventRepository;
import com.example.event.repository.EventRepository.LocationPerformanceDTO;
import com.example.event.repository.EventRepository.TimingPerformanceDTO;
import com.example.event.repository.OrganizerProfileRepository;
import com.example.event.repository.SubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatsService {

    private final EventRepository eventRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final OrganizerProfileRepository organizerProfileRepository;

    public EventStatsResponse getStatsByEvent(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Événement non trouvé avec ID: " + eventId));

        Long totalSuccessfulSubs = subscriptionRepository.countSuccessfulPlacesByEventId(eventId).orElse(0L);
        Long totalRevenue = subscriptionRepository.sumSuccessfulMontantByEventId(eventId).orElse(0L);
        List<SubscriptionCountDTO> distribution = subscriptionRepository.countPlacesByTicketCategoryAndEventId(eventId);

        int maxCapacity = event.getPlaces();
        double occupancyRate = (maxCapacity > 0) ? ((double) totalSuccessfulSubs / maxCapacity) * 100.0 : 0.0;

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

    public Map<Statut_Event, Long> getGlobalEventStatusStats() {
        List<Object[]> results = eventRepository.countEventsByStatus();
        return results.stream()
                .collect(Collectors.toMap(
                        result -> (Statut_Event) result[0],
                        result -> (Long) result[1]
                ));
    }

    public List<LocationPerformanceDTO> getBestLocationRecommendations(Long organizerProfileId) {
        return eventRepository.findAveragePerformanceByLocation(organizerProfileId).stream()
                .sorted(Comparator.comparingDouble(LocationPerformanceDTO::getAverageRevenue).reversed())
                .collect(Collectors.toList());
    }

    public List<TimingPerformanceDTO> getBestTimingRecommendations(Long organizerProfileId) {
        return eventRepository.findAveragePerformanceByMonth(organizerProfileId).stream()
                .sorted(Comparator.comparingDouble(TimingPerformanceDTO::getAverageRevenue).reversed())
                .collect(Collectors.toList());
    }

    public List<TrendingEventDTO> getTrendingEvents(int limit) {
        return eventRepository.findAll().stream()
                .map(event -> {
                    Long sold = subscriptionRepository.countSuccessfulPlacesByEventId(event.getId()).orElse(0L);
                    double occupancyRate = event.getPlaces() > 0 ? (Math.round(((double) sold / event.getPlaces()) * 10000.0) / 100.0) : 0.0;
                    return new TrendingEventDTO(event.getId(), event.getTitle(), event.getLieu(), event.getPlaces(), occupancyRate);
                })
                .filter(dto -> dto.getOccupancyRate() > 0.0)
                .sorted(Comparator.comparing(TrendingEventDTO::getOccupancyRate).reversed())
                .limit(limit)
                .collect(Collectors.toList());
    }

    public GeneralRecommendationDTO getGeneralRecommendation(Long organizerProfileId) {
        GeneralRecommendationDTO dto = new GeneralRecommendationDTO();
        Optional<LocationPerformanceDTO> bestLocation = getBestLocationRecommendations(organizerProfileId).stream().findFirst();
        Optional<TimingPerformanceDTO> bestTiming = getBestTimingRecommendations(organizerProfileId).stream().findFirst();

        if (bestLocation.isPresent() && bestTiming.isPresent()) {
            LocationPerformanceDTO bestL = bestLocation.get();
            TimingPerformanceDTO bestT = bestTiming.get();
            String[] mois = {"Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"};
            String nomMois = mois[bestT.getMonth() - 1];

            dto.setMeilleurLieu(bestL.getLieu());
            dto.setRevenuMoyenLieu(bestL.getAverageRevenue());
            dto.setMeilleurMois(nomMois);
            dto.setRevenuMoyenMois(bestT.getAverageRevenue());

            String lieuFormat = String.format(Locale.FRANCE, "%,.0f XAF", bestL.getAverageRevenue());
            String moisFormat = String.format(Locale.FRANCE, "%,.0f XAF", bestT.getAverageRevenue());
            String recommendation = String.format(
                    "Au vu de vos événements passés, le lieu le plus rentable est %s (Moyenne : %s). La meilleure période est %s (Moyenne : %s). Il est fortement recommandé d'organiser votre prochain événement le plus important à %s en %s.",
                    bestL.getLieu(), lieuFormat, nomMois, moisFormat, bestL.getLieu(), nomMois);
            dto.setRecommandationGenerale(recommendation);
        } else {
            dto.setRecommandationGenerale("Historique insuffisant. Veuillez enregistrer plus d'événements 'TERMINE' et de souscriptions 'REUSSI' pour une analyse.");
        }
        return dto;
    }

    public VisitorRecommendationDTO getRecommendationsByBestOrganizer() {
        final int TOP_N = 5;
        final double MIN_OCCUPANCY = 0.10;

        List<EventRepository.OrganizerPerformanceDTO> topOrganizers = eventRepository.findAverageOccupancyByOrganizer().stream()
                .filter(p -> p.getAverageOccupancy() != null && p.getAverageOccupancy() >= MIN_OCCUPANCY)
                .sorted(Comparator.comparingDouble(EventRepository.OrganizerPerformanceDTO::getAverageOccupancy).reversed())
                .limit(TOP_N)
                .collect(Collectors.toList());

        if (topOrganizers.isEmpty()) {
            List<Event> popularEvents = eventRepository.findAll().stream()
                    .filter(e -> e.getStatut() == Statut_Event.PROCHAINEMENT || e.getStatut() == Statut_Event.EN_COURS)
                    .sorted(Comparator.comparing(Event::getDebut))
                    .limit(5)
                    .collect(Collectors.toList());
            return new VisitorRecommendationDTO("Nous n'avons pas assez d'historique de performance pour des recommandations. Découvrez nos événements les plus récents :", null, null, popularEvents);
        }

        List<Long> topOrganizerProfileIds = topOrganizers.stream()
                .map(EventRepository.OrganizerPerformanceDTO::getOrganizerId)
                .collect(Collectors.toList());

        Double overallTopAverage = topOrganizers.stream()
                .mapToDouble(EventRepository.OrganizerPerformanceDTO::getAverageOccupancy)
                .average()
                .orElse(0.0);

        Long bestOrganizerProfileId = topOrganizers.get(0).getOrganizerId();
        OrganizerProfile topOrganizerProfile = organizerProfileRepository.findById(bestOrganizerProfileId).orElse(null);
        String bestOrganizerName = (topOrganizerProfile != null) ? topOrganizerProfile.getName() : "Notre Top Organisateur";

        List<Event> recommendedEvents = eventRepository.findAll().stream()
                .filter(e -> e.getOrganizerProfile() != null && topOrganizerProfileIds.contains(e.getOrganizerProfile().getId()))
                .filter(e -> e.getStatut() == Statut_Event.PROCHAINEMENT || e.getStatut() == Statut_Event.EN_COURS)
                .sorted(Comparator.comparing(Event::getDebut))
                .limit(10)
                .collect(Collectors.toList());

        String tauxFormat = String.format(Locale.FRANCE, "%,.1f%%", overallTopAverage * 100);
        String recommendation = String.format(
                "Basé sur la performance historique (%s de taux d'occupation moyen), nous vous recommandons les événements à venir de nos %d meilleurs organisateurs, dont %s.",
                tauxFormat, topOrganizers.size(), bestOrganizerName);

        return new VisitorRecommendationDTO(recommendation, bestOrganizerName, overallTopAverage, recommendedEvents);
    }
}