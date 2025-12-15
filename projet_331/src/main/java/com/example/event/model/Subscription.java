package com.example.event.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int montant;
    private int places;
    private LocalDateTime createdAt;
    @Enumerated(EnumType.STRING)
    private Statut_Subscription statut;

    @ManyToOne
    @JoinColumn(name = "event_id")
    @JsonBackReference
    private Event event;

    @ManyToOne
    @JoinColumn(name = "visitor_profile_id")
    @JsonBackReference
    private VisitorProfile visitorProfile;

    @ManyToOne
    @JoinColumn(name = "ticket_id")
    @JsonBackReference
    private TicketCategory ticket;
    //ticket
    private String codeticket;
    //Generation du ticket
    public String generateTicketCode() {
        return "TICKET-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

}
