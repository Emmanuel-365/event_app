package com.example.event.controller;

import com.example.event.dto.Subscription.SubscriptionRequest;
import com.example.event.service.SubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/subscription")
public class SubscriptionController {

    @Autowired
    private SubscriptionService subscriptionService;

    @PostMapping
    public ResponseEntity<?> createSubscription( @RequestBody SubscriptionRequest  subscription) {
        return subscriptionService.createSubscription(subscription);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findSubscription(@PathVariable Long id) {
        return subscriptionService.findSubsription(id);
    }

    @GetMapping
    public ResponseEntity<?> getAllSubscription(){
        return subscriptionService.getAllSubscription();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSubscription(@PathVariable Long id) {
        return subscriptionService.deleteSubscription(id);
    }

    @GetMapping("/visitor/me")
    public ResponseEntity<?> getMySubscriptions() {
        return subscriptionService.getSubscriptionsByVisitor();
    }

    @GetMapping("/event/{id}")
    public ResponseEntity<?> getSubscriptionsByEvent(@PathVariable Long id) {
        return subscriptionService.getSubscriptionsByEvent(id);
    }
}
