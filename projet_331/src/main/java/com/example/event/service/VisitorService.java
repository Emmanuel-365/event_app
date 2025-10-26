package com.example.event.service;
import com.example.event.Exception.EntityAlreadyExistException;
import com.example.event.Exception.EntityNotFoundException;
import com.example.event.dto.Visitor.VisitorResponse;
import com.example.event.model.Visitor;
import com.example.event.repository.VisitorRepository;
import com.example.event.utils.UtilVisitor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.event.dto.Visitor.VisitorRequest;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class VisitorService {
    @Autowired
    private VisitorRepository visitorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public ResponseEntity<?> createVisitor(VisitorRequest visitorRequest) {

        if(visitorRepository.existsByEmail(visitorRequest.getEmail())) {
            throw new EntityAlreadyExistException("Email déja existant");
        }

        Visitor visitor = new Visitor();
        visitor.setCity(visitorRequest.getCity());
        visitor.setEmail(visitorRequest.getEmail());
        visitor.setName(visitorRequest.getName());
        visitor.setSurname(visitorRequest.getSurname());
        visitor.setPhone(visitorRequest.getPhone());
        visitor.setPassword(passwordEncoder.encode(visitorRequest.getPassword()));
        visitor.setDate_inscription(LocalDate.now());
        visitorRepository.save(visitor);

        VisitorResponse visitorResponse = UtilVisitor.convertToVisitorResponse(visitor);
        return ResponseEntity.ok(visitorResponse);
    }

    public ResponseEntity<?> findVisitor(Long id){
        Visitor visitor = visitorRepository.findById(id).orElse(null);
        if(visitor == null){
            throw new EntityNotFoundException("Visiteur introuvable");
        }
        VisitorResponse visitorResponse = UtilVisitor.convertToVisitorResponse(visitor);
        return ResponseEntity.ok(visitorResponse);
    }

    public ResponseEntity<?> findVisitorByEmail(String email){
        Visitor visitor = visitorRepository.findByEmail(email).orElse(null);
        if(visitor == null){
            throw new EntityNotFoundException("Visiteur introuvable");
        }
        VisitorResponse visitorResponse = UtilVisitor.convertToVisitorResponse(visitor);
        return ResponseEntity.ok(visitorResponse);
    }

    public ResponseEntity<?> getAllVisitor(){
        List<Visitor> visitors= visitorRepository.findAll();
        List<VisitorResponse> visitorResponses = new ArrayList<>();
        for(Visitor visitor : visitors) {
            VisitorResponse visitorResponse = UtilVisitor.convertToVisitorResponse(visitor);
            visitorResponses.add(visitorResponse);

        }
        return ResponseEntity.ok(visitorResponses);
    }
    public ResponseEntity<?> deletevisitor(Long id){
        Visitor visitor = visitorRepository.findById(id).orElse(null);
        if(visitor == null){
            throw new EntityNotFoundException("Visiteur introuvable");
        }
        visitorRepository.delete(visitor);
        return ResponseEntity.ok("Suppression Reussie!!");
    }
    public ResponseEntity<?> updateVisitor(VisitorRequest visitorRequest,Long id){
        Visitor visitor = visitorRepository.findById(id).orElse(null);
        if(visitor == null){
            throw new EntityNotFoundException("Visiteur introuvable");
        }
        visitor.setCity(visitorRequest.getCity());
        visitor.setEmail(visitorRequest.getEmail());
        visitor.setName(visitorRequest.getName());
        visitor.setSurname(visitorRequest.getSurname());
        visitor.setPhone(visitorRequest.getPhone());
        visitor.setPassword(passwordEncoder.encode(visitorRequest.getPassword()));
        visitor.setDate_inscription(LocalDate.now());
        visitorRepository.save(visitor);

        VisitorResponse visitorResponse = UtilVisitor.convertToVisitorResponse(visitor);
        return ResponseEntity.ok(visitorResponse);

    }
}
