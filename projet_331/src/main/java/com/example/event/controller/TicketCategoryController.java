package com.example.event.controller;

import com.example.event.dto.category.TicketCategoryRequest;
import com.example.event.service.TicketCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ticket")
public class TicketCategoryController {
     @Autowired
    private TicketCategoryService ticketCategoryService;

     @PostMapping
    public ResponseEntity<?> createTicketCategory(@RequestBody TicketCategoryRequest ticketCategory) {
         return ticketCategoryService.createTicket(ticketCategory);
     }

     @GetMapping("/{id}")
    public ResponseEntity<?> findTicketCategory(@PathVariable Long id) {
         return ticketCategoryService.findTicket(id);
     }

     @GetMapping
    public ResponseEntity<?> getAllTicketCategories() {
         return ticketCategoryService.getAllTickets();
     }

     @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTicketCategory(@PathVariable Long id) {
         return ticketCategoryService.deleteTicket(id);
     }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEvent(@RequestBody TicketCategoryRequest ticketCategoryRequest, @PathVariable Long id){
        return ticketCategoryService.updateTicket(ticketCategoryRequest,id);
    }
}
