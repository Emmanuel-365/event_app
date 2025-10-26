package com.example.event.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Entity
@NoArgsConstructor
public class Visitor {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long Id;
    private String name;
    private String surname;
    private String phone;
    private String city;
    private String email;
    private String password;
    private LocalDate date_inscription;

    @OneToMany(cascade = CascadeType.ALL, mappedBy="visitor")
    @JsonManagedReference
    private List<Subscription> subscriptionList;
}
