package com.example.event.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Entity
@NoArgsConstructor
public class OrganizerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String phone;
    private String instagram_url;
    private String facebook_url;
    private String whatsapp_url;
    private String profil_url;
    private int annee_activite;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference
    private User user;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "organizerProfile")
    @JsonManagedReference
    private List<Event> events;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "organizerProfile")
    @JsonManagedReference
    private List<Member> members;
}
