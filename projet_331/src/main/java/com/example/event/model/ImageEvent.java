package com.example.event.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class ImageEvent {
     @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;
    private String imageurl;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="event_id")
    @JsonBackReference
    private Event event;

}
