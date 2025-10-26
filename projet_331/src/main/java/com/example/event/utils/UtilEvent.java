package com.example.event.utils;

import com.example.event.dto.Event.EventResponse;
import com.example.event.model.Event;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class UtilEvent {
    public static EventResponse convertToEventResponse(Event event){
        EventResponse response = new EventResponse();
        response.setTitle(event.getTitle());
        response.setDescription(event.getDescription());
        response.setPlaces(event.getPlaces());
        response.setLieu(event.getLieu());
        response.setDebut(event.getDebut());
        response.setFin(event.getFin());
        response.setOrganizer_name(event.getOrganizer().getName());
        response.setStatutEvent(event.getStatut());
        response.setProfil_url(event.getProfil_url());

        if (event.getTicketCategoryList() != null) {
            response.setTicketCategoryList(
                event.getTicketCategoryList().stream()
                     .map(UtilCategorie::convertToCategorieResponse)
                     .collect(Collectors.toList())
            );
        }
        return response;
    }
}
