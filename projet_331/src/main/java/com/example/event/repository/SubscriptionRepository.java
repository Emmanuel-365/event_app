package com.example.event.repository;

import com.example.event.dto.Stats.SubscriptionCountDTO;
import com.example.event.model.Subscription;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SubscriptionRepository extends JpaRepository<Subscription,Long> {
    boolean existsByCodeticket(String codeticket);



    //METHODES STATISTIQUES 

    // 1. Calcul du nombre total de places réussies pour un événement
    @Query("SELECT SUM(s.places) FROM Subscription s WHERE s.event.Id = :eventId AND s.statut = 'REUSSI'")
    Optional<Long> countSuccessfulPlacesByEventId(@Param("eventId") Long eventId);

    // 2. Calcul du revenu total généré (statut REUSSI)
    @Query("SELECT SUM(s.montant) FROM Subscription s WHERE s.event.Id = :eventId AND s.statut = 'REUSSI'")
    Optional<Long> sumSuccessfulMontantByEventId(@Param("eventId") Long eventId);

    // 3. Distribution des inscriptions par catégorie (réussies uniquement)
    @Query("SELECT new com.example.event.dto.Stats.SubscriptionCountDTO(s.ticket.intitule, SUM(s.places)) " +
           "FROM Subscription s " +
           "WHERE s.event.Id = :eventId AND s.statut = 'REUSSI' " +
           "GROUP BY s.ticket.intitule, s.ticket.Id")
    List<SubscriptionCountDTO> countPlacesByTicketCategoryAndEventId(@Param("eventId") Long eventId);

}
