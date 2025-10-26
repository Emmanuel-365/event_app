package com.example.event.service;
import com.example.event.Exception.EntityAlreadyExistException;
import com.example.event.Exception.EntityNotFoundException;
import com.example.event.dto.Organizer.OrganizerRequest;
import com.example.event.dto.Organizer.OrganizerResponse;
import com.example.event.model.Organizer;
import com.example.event.repository.OrganizerRepository;
import com.example.event.utils.UtilOrganizer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class OrganizerService {
    @Autowired
    private OrganizerRepository organizerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public ResponseEntity<?> createOrganizer(OrganizerRequest organizerRequest){

        if(organizerRepository.existsByEmail(organizerRequest.getEmail())) {
            throw new EntityAlreadyExistException("Email déja existant !");
        }
        Organizer organizer = new Organizer();

        organizer.setName(organizerRequest.getName());
        organizer.setAnnee_activite(organizerRequest.getAnnee_activite());
        organizer.setEmail(organizerRequest.getEmail());
        organizer.setPassword(passwordEncoder.encode(organizerRequest.getPassword()));
        organizer.setFacebook_url(organizerRequest.getFacebook_url());
        organizer.setInstagram_url(organizerRequest.getInstagram_url());
        organizer.setWhatsapp_url(organizerRequest.getWhatsapp_url());
        organizer.setProfil_url(organizerRequest.getProfil_url());
        organizer.setPhone(organizerRequest.getPhone());


        organizerRepository.save(organizer);
       OrganizerResponse organizerResponse = UtilOrganizer.convertToOrganizer(organizer);
        return ResponseEntity.ok(organizerResponse);
    }

    public ResponseEntity<?> findOrganizer(Long Id){
        Organizer organizer = organizerRepository.findById(Id).orElse(null);
        if(organizer == null){
            throw new EntityNotFoundException("Organisateur introuvable");
        }
        OrganizerResponse organizerResponse = UtilOrganizer.convertToOrganizer(organizer);
        return ResponseEntity.ok(organizerResponse);
    }

    public ResponseEntity<?> findOrganizerByEmail(String email){
        Organizer organizer = organizerRepository.findByEmail(email).orElse(null);
        if(organizer == null){
            throw new EntityNotFoundException("Organisateur introuvable");
        }
        OrganizerResponse organizerResponse = UtilOrganizer.convertToOrganizer(organizer);
        return ResponseEntity.ok(organizerResponse);
    }

    public ResponseEntity<?>  getAllOrganizer(){

        List<Organizer> organizers = organizerRepository.findAll();

        List<OrganizerResponse> organizerResponses = new ArrayList<>();

        for(Organizer organizer : organizers) {
            OrganizerResponse organizerResponse = UtilOrganizer.convertToOrganizer(organizer);
            organizerResponses.add(organizerResponse);

        }
        return ResponseEntity.ok(organizerResponses);
    }

    public ResponseEntity<?> deleteOrganizer(Long id){
        Organizer organizer = organizerRepository.findById(id).orElse(null);
        if(organizer == null){
            throw new EntityNotFoundException(" Organisateur Introuvable");
        }
        return ResponseEntity.ok("Suppression reussie de l'organisateur ID: "+organizer.getId()+"- Nom: "+organizer.getName());
    }

    public ResponseEntity<?> updateOrganizer(OrganizerRequest organizerRequest,Long id){
        Organizer organizer = organizerRepository.findById(id).orElse(null);

        if(organizer == null){
            throw new EntityNotFoundException("Organisateur introuvable");
        }
        organizer.setName(organizerRequest.getName());
        organizer.setAnnee_activite(organizerRequest.getAnnee_activite());
        organizer.setEmail(organizerRequest.getEmail());
        organizer.setPassword(passwordEncoder.encode(organizerRequest.getPassword()));
        organizer.setFacebook_url(organizerRequest.getFacebook_url());
        organizer.setInstagram_url(organizerRequest.getInstagram_url());
        organizer.setWhatsapp_url(organizerRequest.getWhatsapp_url());
        organizer.setProfil_url(organizerRequest.getProfil_url());
        organizer.setPhone(organizerRequest.getPhone());


        organizerRepository.save(organizer);
        OrganizerResponse organizerResponse = UtilOrganizer.convertToOrganizer(organizer);
        return ResponseEntity.ok(organizerResponse);
    }
}
