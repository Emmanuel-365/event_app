package com.example.event.repository;

import com.example.event.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param; // NOUVEL IMPORT NÉCESSAIRE
import java.util.List;

public interface EventRepository extends JpaRepository<Event,Long> {

    // Interfaces pour le DTO de performance
    public interface LocationPerformanceDTO {
        String getLieu();
        Double getAverageRevenue();
    }

    public interface TimingPerformanceDTO {
        Integer getMonth();
        Double getAverageRevenue();
    }


    // NOUVELLE INTERFACE DTO POUR LE VISITEUR*/
    public interface OrganizerPerformanceDTO {
        Long getOrganizerId();
        Double getAverageOccupancy(); 
    }


    // Statistiques globales 
    @Query("SELECT e.statut, COUNT(e) FROM Event e GROUP BY e.statut")
    List<Object[]> countEventsByStatus();

    


     // Performance agrégée par Lieu. Filtre par statut 'TERMINÉ' ET par organisateur.
     
    @Query(value = "SELECT e.lieu as lieu, AVG(s.montant) as averageRevenue " +
                   "FROM EVENT e JOIN SUBSCRIPTION s ON e.id = s.event_id " +
                   "WHERE s.statut = 'REUSSI' AND e.statut = 'TERMINÉ' AND e.organizer_id = :id_organizer GROUP BY e.lieu", nativeQuery = true) 
    List<LocationPerformanceDTO> findAveragePerformanceByLocation(@Param("id_organizer") Long id_organizer);


     // Performance agrégée par Mois. 
    @Query(value = "SELECT MONTH(e.debut) as \"month\", AVG(s.montant) as averageRevenue " +
                "FROM EVENT e JOIN SUBSCRIPTION s ON e.id = s.event_id " +
                "WHERE s.statut = 'REUSSI' AND e.statut = 'TERMINÉ' AND e.organizer_id = :id_organizer GROUP BY MONTH(e.debut)", nativeQuery = true)
    List<TimingPerformanceDTO> findAveragePerformanceByMonth(@Param("id_organizer") Long id_organizer);


    
    @Query("SELECT SUM(s.montant) FROM Subscription s WHERE s.event.id = :eventId AND s.statut = 'REUSSI'")
    java.util.Optional<Long> sumSuccessfulMontantByEventId(@Param("eventId") Long eventId);

    @Query("SELECT SUM(s.places) FROM Subscription s WHERE s.event.id = :eventId AND s.statut = 'REUSSI'")
    java.util.Optional<Long> countSuccessfulPlacesByEventId(@Param("eventId") Long eventId);




     /* Calcule le taux d'occupation moyen (réussi) pour tous les événements TERMINÉS par organisateur.*/

    @Query(value = "SELECT e.organizer_id as organizerId, " +
                   "AVG(COALESCE((SELECT SUM(s.places) FROM SUBSCRIPTION s WHERE s.event_id = e.id AND s.statut = 'REUSSI'), 0.0) * 1.0 / e.places) as averageOccupancy " +
                   "FROM EVENT e " +
                   "WHERE e.statut = 'TERMINÉ' AND e.places > 0 " + // Assure places > 0 pour éviter division par zéro
                   "GROUP BY e.organizer_id", nativeQuery = true)
    List<OrganizerPerformanceDTO> findAverageOccupancyByOrganizer();
}