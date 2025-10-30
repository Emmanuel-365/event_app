package com.example.event.service;
import com.example.event.Exception.EntityNotFoundException;
import com.example.event.dto.Event.EventRequest;
import com.example.event.dto.Event.EventResponse;
import com.example.event.model.Statut_Event;
import com.example.event.model.Event;
import com.example.event.model.Organizer;
import com.example.event.repository.EventRepository;
import com.example.event.repository.OrganizerRepository;
import com.example.event.utils.UtilEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventService {
    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private OrganizerRepository organizerRepository;

    //Creation
    public ResponseEntity<?> createEvent(EventRequest eventRequest){
        //retouver la categorie
        Organizer organizer = organizerRepository.findById(eventRequest.getId_organizer()).orElse(null);
        if(organizer == null){
            throw  new EntityNotFoundException("Categorie ou organisateur introuvable");
        }
        Event event = new Event();
        event.setDescription(eventRequest.getDescription());
        event.setTitle(eventRequest.getTitle());
        event.setDebut(eventRequest.getDebut());
        event.setFin(eventRequest.getFin());
        event.setLieu(eventRequest.getLieu());
        event.setPlaces(eventRequest.getPlaces());
        event.setProfil_url(eventRequest.getProfil_url());
        event.setOrganizer(organizer);

        //verification du statut
        if(eventRequest.getDebut().isAfter(LocalDate.now())){
            event.setStatut(Statut_Event.PROCHAINEMENT);
        } else if (eventRequest.getFin().isBefore(LocalDate.now())) {
            event.setStatut(Statut_Event.TERMINÉ);
        }else{
            event.setStatut(Statut_Event.EN_COURS);
        }

        organizer.getEvents().add(event);
        eventRepository.save(event);
        organizerRepository.save(organizer);

        EventResponse eventResponse = UtilEvent.convertToEventResponse(event);
        return ResponseEntity.ok(eventResponse);

    }


    public ResponseEntity<?> findEventById(Long Id){
        Event event = eventRepository.findById(Id).orElse(null);

        if(event == null){
            throw new EntityNotFoundException("Évènement introuvable");
        }
        EventResponse eventResponse = UtilEvent.convertToEventResponse(event);
        return ResponseEntity.ok(eventResponse);

    }


    public ResponseEntity<?> getAllEvents(){

        List<Event> events = eventRepository.findAll();
        List<EventResponse> eventResponses = new ArrayList<>();
        for(Event event : events) {
            EventResponse eventResponse = UtilEvent.convertToEventResponse(event);
            eventResponses.add(eventResponse);

        }
        return ResponseEntity.ok(eventResponses);

    }

    public ResponseEntity<?> deleteEvent(Long Id){
        Event event = eventRepository.findById(Id).orElse(null);
        if(event == null){
            throw new EntityNotFoundException("Évènement introuvable");
        }
        eventRepository.delete(event);
        return ResponseEntity.ok("Suppression Reussie !!!");
    }


    public ResponseEntity<?> updateEvent(EventRequest eventRequest, Long id){
        Event event = eventRepository.findById(id).orElse(null);
        if(event == null){
            throw new EntityNotFoundException("Évènement introuvable");
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
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String organizerEmail = authentication.getName();

        Organizer organizer = organizerRepository.findByEmail(organizerEmail)
                .orElseThrow(() -> new EntityNotFoundException("Organizer not found with email: " + organizerEmail));

        List<EventResponse> eventResponses = organizer.getEvents().stream()
                .map(UtilEvent::convertToEventResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(eventResponses);
    }
}
