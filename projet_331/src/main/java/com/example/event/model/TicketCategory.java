package com.example.event.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;


@Data
@Entity
public class TicketCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String intitule;
    private int prix;



    @ManyToOne
    @JoinColumn(name = "event_id")
    private Event event;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "ticket")
    @JsonManagedReference
    private List<Subscription> subscriptions;


}
