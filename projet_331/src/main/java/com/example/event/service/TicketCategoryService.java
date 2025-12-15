package com.example.event.service;
import com.example.event.Exception.EntityNotFoundException;
import com.example.event.dto.category.TicketCategoryRequest;
import com.example.event.dto.category.TicketCategoryResponse;
import com.example.event.model.Event;
import com.example.event.model.TicketCategory;
import com.example.event.repository.EventRepository;
import com.example.event.repository.TicketCategoryRepository;
import com.example.event.utils.UtilCategorie;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TicketCategoryService {

    @Autowired
    private TicketCategoryRepository ticketCategoryRepository;
    @Autowired
    private EventRepository eventRepository;

    public ResponseEntity<?> createTicket(TicketCategoryRequest ticketCategoryRequest){
        Event event = eventRepository.findById(ticketCategoryRequest.getId_event()).orElse(null);
        if(event == null){
            throw new EntityNotFoundException("Évènement introuvable");
        }
        TicketCategory ticketCategory = new TicketCategory();
        ticketCategory.setEvent(event);
        ticketCategory.setPrix(ticketCategoryRequest.getPrix());
        ticketCategory.setIntitule(ticketCategoryRequest.getIntitule());

        event.getTicketCategoryList().add(ticketCategory);

        ticketCategoryRepository.save(ticketCategory);
        eventRepository.save(event);
        TicketCategoryResponse ticketCategoryResponse = UtilCategorie.convertToCategorieResponse(ticketCategory);

        return ResponseEntity.ok(ticketCategoryResponse);

    }
    public ResponseEntity<?> findTicket(Long Id){
        TicketCategory ticketCategory = ticketCategoryRepository.findById(Id).orElse(null);
        if(ticketCategory == null){
            throw new EntityNotFoundException("Ticket introuvable");
        }
        TicketCategoryResponse ticketCategoryResponse = UtilCategorie.convertToCategorieResponse(ticketCategory);

        return ResponseEntity.ok(ticketCategoryResponse);
    }

    public ResponseEntity<?>  getAllTickets(){

        List<TicketCategory> ticketCategories = ticketCategoryRepository.findAll();

        List<TicketCategoryResponse> ticketCategoryResponses = new ArrayList<>();

        for(TicketCategory ticketCategory : ticketCategories) {
            TicketCategoryResponse ticketCategoryResponse = UtilCategorie.convertToCategorieResponse(ticketCategory);
            ticketCategoryResponses.add(ticketCategoryResponse);
        }
        return ResponseEntity.ok(ticketCategoryResponses);
    }

    public ResponseEntity<?> deleteTicket(Long id){
        TicketCategory ticketCategory = ticketCategoryRepository.findById(id).orElse(null);
        if(ticketCategory == null){
            throw new EntityNotFoundException(" ticket Introuvable");
        }
        return ResponseEntity.ok("Suppression reussie !");
    }

    public ResponseEntity<?> updateTicket(TicketCategoryRequest ticketCategoryRequest,Long id){
        TicketCategory ticketCategory = ticketCategoryRepository.findById(id).orElse(null);
        if(ticketCategory == null){
            throw new EntityNotFoundException(" ticket Introuvable");
        }


        ticketCategory.setPrix(ticketCategoryRequest.getPrix());
        ticketCategory.setIntitule(ticketCategoryRequest.getIntitule());

        ticketCategoryRepository.save(ticketCategory);

        TicketCategoryResponse ticketCategoryResponse = UtilCategorie.convertToCategorieResponse(ticketCategory);

        return ResponseEntity.ok(ticketCategoryResponse);
    }

}
