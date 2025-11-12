package com.example.event.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class ImageEvent {
     @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String imageurl;

    @ManyToOne
    @JoinColumn(name="event_id")
    @JsonBackReference
    private Event event;

}
