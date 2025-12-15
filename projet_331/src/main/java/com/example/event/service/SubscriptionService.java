package com.example.event.service;

import com.example.event.Exception.EntityNotFoundException;
import com.example.event.Exception.ForbiddenException;
import com.example.event.dto.Subscription.SubscriptionRequest;
import com.example.event.dto.Subscription.SubscriptionResponse;
import com.example.event.model.*;
import com.example.event.repository.EventRepository;
import com.example.event.repository.SubscriptionRepository;
import com.example.event.repository.TicketCategoryRepository;
import com.example.event.repository.VisitorProfileRepository;
import com.example.event.utils.UtilSubscription;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final EventRepository eventRepository;
    private final TicketCategoryRepository ticketCategoryRepository;
    private final VisitorProfileRepository visitorProfileRepository;
    private final ProfileService profileService;
    private final EmailSenderService emailSenderService;

    public ResponseEntity<?> createSubscription(SubscriptionRequest subscriptionRequest) {
        User user = profileService.getAuthenticatedUser();
        VisitorProfile visitorProfile = user.getVisitorProfile();
        if (visitorProfile == null) {
            throw new ForbiddenException("Only visitors can subscribe to events.");
        }

        Event event = eventRepository.findById(subscriptionRequest.getId_event())
                .orElseThrow(() -> new EntityNotFoundException("Event not found"));
        TicketCategory ticketCategory = ticketCategoryRepository.findById(subscriptionRequest.getId_ticket())
                .orElseThrow(() -> new EntityNotFoundException("Ticket category not found"));

        Subscription subscription = new Subscription();
        String codeticket;
        do {
            codeticket = subscription.generateTicketCode();
        } while (subscriptionRepository.existsByCodeticket(codeticket));

        subscription.setCreatedAt(LocalDateTime.now());
        subscription.setPlaces(subscriptionRequest.getPlaces());
        subscription.setVisitorProfile(visitorProfile);
        subscription.setEvent(event);
        subscription.setTicket(ticketCategory);
        subscription.setCodeticket(codeticket);
        subscription.setMontant(subscriptionRequest.getPlaces() * ticketCategory.getPrix());
        subscription.setStatut(Statut_Subscription.REUSSI); // Assuming success for now

        subscriptionRepository.save(subscription);

        // Send confirmation email
        emailSenderService.sendEmail(
                user.getEmail(),
                "Ticket Confirmation for Event: " + event.getTitle(),
                "Thank you for your registration for " + event.getTitle() + ".\n" +
                        "Visitor: " + visitorProfile.getName() + " " + visitorProfile.getSurname() + "\n" +
                        "Number of places: " + subscription.getPlaces() + "\n" +
                        "Total Amount: " + subscription.getMontant() + " CFA\n" +
                        "Your Ticket Code: " + subscription.getCodeticket()
        );

        SubscriptionResponse subscriptionResponse = UtilSubscription.convertToSubscriptionResponse(subscription);
        return ResponseEntity.ok(subscriptionResponse);
    }

    public ResponseEntity<?> findSubsription(Long id) {
        Subscription subscription = subscriptionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Subscription not found"));
        SubscriptionResponse subscriptionResponse = UtilSubscription.convertToSubscriptionResponse(subscription);
        return ResponseEntity.ok(subscriptionResponse);
    }

    public ResponseEntity<?> getAllSubscription() {
        List<Subscription> subscriptions = subscriptionRepository.findAll();
        List<SubscriptionResponse> subscriptionResponses = subscriptions.stream()
                .map(UtilSubscription::convertToSubscriptionResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(subscriptionResponses);
    }

    public ResponseEntity<?> deleteSubscription(Long id) {
        Subscription subscription = subscriptionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Subscription not found"));

        User user = profileService.getAuthenticatedUser();
        if (!subscription.getVisitorProfile().getUser().getId().equals(user.getId())) {
            throw new ForbiddenException("You can only delete your own subscriptions.");
        }

        subscriptionRepository.delete(subscription);
        return ResponseEntity.ok("Subscription deleted successfully!");
    }

    public ResponseEntity<?> getSubscriptionsByVisitor() {
        User user = profileService.getAuthenticatedUser();
        VisitorProfile visitorProfile = user.getVisitorProfile();
        if (visitorProfile == null) {
            throw new ForbiddenException("User is not a visitor.");
        }

        List<SubscriptionResponse> subscriptionResponses = visitorProfile.getSubscriptionList().stream()
                .map(UtilSubscription::convertToSubscriptionResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(subscriptionResponses);
    }

    public ResponseEntity<?> getSubscriptionsByEvent(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event not found with id: " + eventId));

        List<SubscriptionResponse> subscriptionResponses = event.getSubscriptionList().stream()
                .map(UtilSubscription::convertToSubscriptionResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(subscriptionResponses);
    }
}
