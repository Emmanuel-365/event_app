package com.example.event.controller;

import com.example.event.model.Event;
import com.example.event.model.Statut_Event;
import com.example.event.service.AdminEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/events")
@RequiredArgsConstructor
public class AdminEventController {

    private final AdminEventService adminEventService;

    @GetMapping
    public ResponseEntity<Page<Event>> getAllEvents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Event> events = adminEventService.getAllEvents(pageable);
        return ResponseEntity.ok(events);
    }

    @PutMapping("/{eventId}/status")
    public ResponseEntity<Event> updateEventStatus(@PathVariable Long eventId, @RequestBody Statut_Event newStatus) {
        Event updatedEvent = adminEventService.updateEventStatus(eventId, newStatus);
        return ResponseEntity.ok(updatedEvent);
    }

    @PutMapping("/{eventId}/featured")
    public ResponseEntity<Event> updateEventFeaturedStatus(@PathVariable Long eventId, @RequestBody boolean isFeatured) {
        Event updatedEvent = adminEventService.updateEventFeaturedStatus(eventId, isFeatured);
        return ResponseEntity.ok(updatedEvent);
    }
}
