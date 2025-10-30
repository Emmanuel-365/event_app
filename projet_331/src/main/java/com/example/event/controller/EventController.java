package com.example.event.controller;

import com.example.event.dto.Event.EventRequest;
import com.example.event.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/event")
public class EventController {

    @Autowired
    private EventService eventService;

    @PostMapping
    public ResponseEntity<?> createEvent(@RequestBody EventRequest eventRequest){
        return eventService.createEvent(eventRequest);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findEvent(@PathVariable Long id){
        return eventService.findEventById(id);
    }

    @GetMapping
    public ResponseEntity<?> getAllEvents(){
        return eventService.getAllEvents();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id){
        return eventService.deleteEvent(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEvent(@RequestBody EventRequest eventRequest,@PathVariable Long id){
        return eventService.updateEvent(eventRequest,id);
    }

    @GetMapping("/organizer/me")
    public ResponseEntity<?> getMyEvents(){
        return eventService.getEventsByOrganizer();
    }
}
