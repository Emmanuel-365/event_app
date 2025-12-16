package com.example.event.service;

import com.example.event.Exception.EntityNotFoundException;
import com.example.event.Exception.ForbiddenException;
import com.example.event.dto.Event.EventRequest;
import com.example.event.dto.Event.EventResponse;
import com.example.event.model.Event;
import com.example.event.model.OrganizerProfile;
import com.example.event.model.Statut_Event;
import com.example.event.model.User;
import com.example.event.repository.EventRepository;
import com.example.event.repository.OrganizerProfileRepository;
import com.example.event.utils.UtilEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final ProfileService profileService;
    private final OrganizerProfileRepository organizerProfileRepository;

    public ResponseEntity<?> createEvent(EventRequest eventRequest) {
        User user = profileService.getAuthenticatedUser();
        OrganizerProfile organizerProfile = user.getOrganizerProfile();
        if (organizerProfile == null) {
            throw new ForbiddenException("Only organizers can create events.");
        }

        Event event = new Event();
        event.setDescription(eventRequest.getDescription());
        event.setTitle(eventRequest.getTitle());
        event.setDebut(eventRequest.getDebut());
        event.setFin(eventRequest.getFin());
        event.setLieu(eventRequest.getLieu());
        event.setPlaces(eventRequest.getPlaces());
        event.setProfil_url(eventRequest.getProfil_url());
        event.setOrganizerProfile(organizerProfile);

        if (eventRequest.getDebut().isAfter(LocalDate.now())) {
            event.setStatut(Statut_Event.PROCHAINEMENT);
        } else if (eventRequest.getFin().isBefore(LocalDate.now())) {
            event.setStatut(Statut_Event.TERMINE);
        } else {
            event.setStatut(Statut_Event.EN_COURS);
        }

        eventRepository.save(event);

        // No need to save organizerProfile separately if cascade is set correctly, but explicit save is safer
        organizerProfile.getEvents().add(event);
        organizerProfileRepository.save(organizerProfile);

        EventResponse eventResponse = UtilEvent.convertToEventResponse(event);
        return ResponseEntity.ok(eventResponse);
    }

    public ResponseEntity<?> findEventById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Évènement introuvable"));
        EventResponse eventResponse = UtilEvent.convertToEventResponse(event);
        return ResponseEntity.ok(eventResponse);
    }

    public ResponseEntity<?> getAllEvents() {
        List<Event> events = eventRepository.findAll();
        List<EventResponse> eventResponses = events.stream()
                .map(UtilEvent::convertToEventResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(eventResponses);
    }

    public ResponseEntity<?> deleteEvent(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Évènement introuvable"));
        
        // Add security check: only the owner can delete
        User user = profileService.getAuthenticatedUser();
        if (!event.getOrganizerProfile().getUser().getId().equals(user.getId())) {
            throw new ForbiddenException("You are not the owner of this event.");
        }

        eventRepository.delete(event);
        return ResponseEntity.ok("Suppression Reussie !!!");
    }

    public ResponseEntity<?> updateEvent(EventRequest eventRequest, Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Évènement introuvable"));

        // Add security check: only the owner can update
        User user = profileService.getAuthenticatedUser();
        if (!event.getOrganizerProfile().getUser().getId().equals(user.getId())) {
            throw new ForbiddenException("You are not the owner of this event.");
        }

        event.setTitle(eventRequest.getTitle());
        event.setDebut(eventRequest.getDebut());
        event.setFin(eventRequest.getFin());
        event.setLieu(eventRequest.getLieu());
        event.setPlaces(eventRequest.getPlaces());
        event.setProfil_url(eventRequest.getProfil_url());
        event.setDescription(eventRequest.getDescription());

        eventRepository.save(event);

        EventResponse eventResponse = UtilEvent.convertToEventResponse(event);
        return ResponseEntity.ok(eventResponse);
    }

    public ResponseEntity<?> getEventsByOrganizer() {
        User user = profileService.getAuthenticatedUser();
        OrganizerProfile organizerProfile = user.getOrganizerProfile();
        if (organizerProfile == null) {
            throw new ForbiddenException("User is not an organizer.");
        }

        List<EventResponse> eventResponses = organizerProfile.getEvents().stream()
                .map(UtilEvent::convertToEventResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(eventResponses);
    }
}
