package com.example.event.controller;

import com.example.event.service.VisitorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import com.example.event.dto.Visitor.VisitorRequest;
@RestController
@RequestMapping("/visitor")
public class VisitorController {

    @Autowired
    private VisitorService visitorService;

    @GetMapping("/home")
    public ResponseEntity<String> home() {
        return ResponseEntity.ok("Bienvenue sur votre page home visiteur !");
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentVisitor() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return visitorService.findVisitorByEmail(email);
    }

    @PostMapping("/register")
    public ResponseEntity<?> createVisitor(@RequestBody VisitorRequest  visitor) {
        return visitorService.createVisitor(visitor);
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> findVisitor(@PathVariable Long id) {
        return visitorService.findVisitor(id);
    }
    @GetMapping
    public ResponseEntity<?> getAllVisitors() {
        return visitorService.getAllVisitor();
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVisitor(@PathVariable Long id) {
        return visitorService.deletevisitor(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateVisitor(@RequestBody VisitorRequest visitorRequest, @PathVariable Long id){
        return visitorService.updateVisitor(visitorRequest,id);
    }

}
