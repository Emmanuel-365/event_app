package com.example.event.service;

import com.example.event.Exception.EntityNotFoundException;
import com.example.event.model.Event;
import com.example.event.model.Statut_Event;
import com.example.event.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminEventService {

    private final EventRepository eventRepository;

    @Transactional(readOnly = true)
    public Page<Event> getAllEvents(Pageable pageable) {
        return eventRepository.findAll(pageable);
    }

    @Transactional
    public Event updateEventStatus(Long eventId, Statut_Event newStatus) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event not found with ID: " + eventId));
        event.setStatut(newStatus);
        return eventRepository.save(event);
    }

    @Transactional
    public Event updateEventFeaturedStatus(Long eventId, boolean isFeatured) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event not found with ID: " + eventId));
        event.setFeatured(isFeatured);
        return eventRepository.save(event);
    }
}
