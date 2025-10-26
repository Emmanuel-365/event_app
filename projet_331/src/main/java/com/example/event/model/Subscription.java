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
    private Long Id;
    private int montant;
    private int places;
    private LocalDateTime createdAt;
    @Enumerated(EnumType.STRING)
    private Statut_Subscription statut;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "event_id")
    @JsonBackReference
    private Event event;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "visitor_id")
    @JsonBackReference
    private Visitor visitor;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "ticket_id")
    private TicketCategory ticket;
    //ticket
    private String codeticket;
    //Generation du ticket
    public String generateTicketCode() {
        return "TICKET-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

}
