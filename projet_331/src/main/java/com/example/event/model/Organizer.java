package com.example.event.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Entity
@NoArgsConstructor
public class Organizer {

    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long Id;
    private String name;
    private String email;
    private String phone;
    private String password;
    private String instagram_url;
    private String facebook_url;
    private String whatsapp_url;
    private String profil_url;
    private int annee_activite;

    @OneToMany(cascade = CascadeType.ALL, mappedBy="organizer")
    @JsonManagedReference
    private List<Event> events;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "organizer")
    @JsonManagedReference
    private List<Member> members;


}
