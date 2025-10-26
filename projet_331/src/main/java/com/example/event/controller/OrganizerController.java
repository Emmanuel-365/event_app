package com.example.event.controller;

import com.example.event.dto.Organizer.OrganizerRequest;
import com.example.event.service.OrganizerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/organizer")
public class OrganizerController {
    @Autowired
    private OrganizerService organizerService;

    @GetMapping("/home")
    public ResponseEntity<String> home() {
        return ResponseEntity.ok("Bienvenue sur votre page home organisateur !");
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentOrganizer() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return organizerService.findOrganizerByEmail(email);
    }

    @PostMapping("/register")
    public ResponseEntity<?> createOrganizer(@RequestBody OrganizerRequest organizer) {
        return organizerService.createOrganizer(organizer);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findOrganizer(@PathVariable Long id) {
        return organizerService.findOrganizer(id);
    }
    @GetMapping
    public ResponseEntity<?> getAllOrganizers() {
        return organizerService.getAllOrganizer();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrganizer(@PathVariable Long id) {
        return organizerService.deleteOrganizer(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateOrganizer(@RequestBody OrganizerRequest organizerRequest, @PathVariable Long id){
        return organizerService.updateOrganizer(organizerRequest,id);
    }
}
