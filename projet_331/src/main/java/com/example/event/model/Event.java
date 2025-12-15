package com.example.event.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@Entity
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String description;
    private String lieu;
    private int places;
    private LocalDate debut;
    private LocalDate fin;
    private String profil_url;
    @Enumerated(EnumType.STRING)
    private Statut_Event statut;

    @ManyToOne
    @JoinColumn(name="organizer_profile_id")
    @JsonBackReference
    private OrganizerProfile organizerProfile;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "event")
    @JsonManagedReference
    private List<TicketCategory> ticketCategoryList;

    @OneToMany(cascade = CascadeType.ALL,mappedBy="event")
    @JsonManagedReference
    private List<Subscription> subscriptionList;

    @OneToMany(cascade = CascadeType.ALL,mappedBy="event")
    @JsonManagedReference
    private List<ImageEvent> images;

}
