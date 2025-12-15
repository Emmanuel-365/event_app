package com.example.event.service;

import com.example.event.Exception.EntityAlreadyExistException;
import com.example.event.Exception.ForbiddenException;
import com.example.event.Exception.EntityNotFoundException;
import com.example.event.dto.Subscription.SubscriptionRequest;
import com.example.event.dto.Subscription.SubscriptionResponse;
import com.example.event.model.*;
import com.example.event.repository.EventRepository;
import com.example.event.repository.SubscriptionRepository;
import com.example.event.repository.TicketCategoryRepository;
import com.example.event.repository.VisitorProfileRepository;
import com.example.event.utils.QRCodeGenerator;
import com.example.event.utils.UtilSubscription;
import com.google.zxing.WriterException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
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

    @Transactional
    public ResponseEntity<SubscriptionResponse> createSubscription(SubscriptionRequest subscriptionRequest) {
        User user = profileService.getAuthenticatedUser();
        VisitorProfile visitorProfile = user.getVisitorProfile();
        if (visitorProfile == null) {
            throw new ForbiddenException("Only visitors can subscribe to events.");
        }

        Event event = eventRepository.findById(subscriptionRequest.getId_event())
                .orElseThrow(() -> new EntityNotFoundException("Event not found"));
        TicketCategory ticketCategory = ticketCategoryRepository.findById(subscriptionRequest.getId_ticket())
                .orElseThrow(() -> new EntityNotFoundException("Ticket category not found"));

        if (event.getPlaces() < subscriptionRequest.getPlaces()) {
            throw new ForbiddenException("Not enough places available for this event.");
        }
        event.setPlaces(event.getPlaces() - subscriptionRequest.getPlaces());


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
        
        boolean isPaidTicket = ticketCategory.getPrix() > 0;
        
        if (isPaidTicket) {
            subscription.setStatut(Statut_Subscription.EN_ATTENTE);
        } else {
            subscription.setStatut(Statut_Subscription.REUSSI);
        }

        Subscription savedSubscription = subscriptionRepository.save(subscription);
        eventRepository.save(event);
        
        if (!isPaidTicket) {
            sendTicketEmail(savedSubscription);
        }

        SubscriptionResponse subscriptionResponse = UtilSubscription.convertToSubscriptionResponse(savedSubscription);
        
        if (isPaidTicket) {
            return new ResponseEntity<>(subscriptionResponse, HttpStatus.CREATED); // 201 for payment pending
        } else {
            return ResponseEntity.ok(subscriptionResponse); // 200 for free ticket
        }
    }

    @Transactional
    public SubscriptionResponse confirmPayment(Long subscriptionId) {
        Subscription subscription = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new EntityNotFoundException("Subscription not found"));

        if(subscription.getStatut() != Statut_Subscription.EN_ATTENTE) {
            throw new ForbiddenException("This subscription is not pending payment.");
        }

        subscription.setStatut(Statut_Subscription.REUSSI);
        Subscription savedSubscription = subscriptionRepository.save(subscription);

        sendTicketEmail(savedSubscription);

        return UtilSubscription.convertToSubscriptionResponse(savedSubscription);
    }
    
    private void sendTicketEmail(Subscription subscription) {
        try {
            User user = subscription.getVisitorProfile().getUser();
            byte[] qrCode = QRCodeGenerator.generateQRCodeImage(subscription.getCodeticket(), 250, 250);
            String emailBody = "Thank you for your registration for " + subscription.getEvent().getTitle() + ".\n" +
                               "Visitor: " + subscription.getVisitorProfile().getName() + " " + subscription.getVisitorProfile().getSurname() + "\n" +
                               "Number of places: " + subscription.getPlaces() + "\n" +
                               "Total Amount: " + subscription.getMontant() + " CFA\n" +
                               "Your Ticket Code: " + subscription.getCodeticket();

            emailSenderService.sendEmailWithQRCode(
                    user.getEmail(),
                    "Ticket Confirmation for Event: " + subscription.getEvent().getTitle(),
                    emailBody,
                    qrCode
            );
        } catch (WriterException | IOException e) {
            System.err.println("Failed to generate or send QR code email for subscription " + subscription.getId() + ": " + e.getMessage());
        }
    }
    
     @Transactional(readOnly = true)
    public ResponseEntity<?> findSubsription(Long id) {
        Subscription subscription = subscriptionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Subscription not found"));
        SubscriptionResponse subscriptionResponse = UtilSubscription.convertToSubscriptionResponse(subscription);
        return ResponseEntity.ok(subscriptionResponse);
    }
     @Transactional(readOnly = true)
    public ResponseEntity<?> getAllSubscription() {
        List<Subscription> subscriptions = subscriptionRepository.findAll();
        List<SubscriptionResponse> subscriptionResponses = subscriptions.stream()
                .map(UtilSubscription::convertToSubscriptionResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(subscriptionResponses);
    }
    @Transactional
    public ResponseEntity<?> deleteSubscription(Long id) {
        Subscription subscription = subscriptionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Subscription not found"));

        User user = profileService.getAuthenticatedUser();
        if (!subscription.getVisitorProfile().getUser().getId().equals(user.getId())) {
            throw new ForbiddenException("You can only delete your own subscriptions.");
        }
         Event event = subscription.getEvent();
        event.setPlaces(event.getPlaces() + subscription.getPlaces());
        eventRepository.save(event);

        subscriptionRepository.delete(subscription);
        return ResponseEntity.ok("Subscription deleted successfully!");
    }
    @Transactional(readOnly = true)
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
    @Transactional(readOnly = true)
    public ResponseEntity<?> getSubscriptionsByEvent(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event not found with id: " + eventId));

        List<SubscriptionResponse> subscriptionResponses = event.getSubscriptionList().stream()
                .map(UtilSubscription::convertToSubscriptionResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(subscriptionResponses);
    }
    @Transactional
    public SubscriptionResponse validateTicket(String ticketCode) {
        User user = profileService.getAuthenticatedUser();
        OrganizerProfile organizerProfile = user.getOrganizerProfile();
        if (organizerProfile == null) {
            throw new ForbiddenException("Only organizers can validate tickets.");
        }

        Subscription subscription = subscriptionRepository.findByCodeticket(ticketCode)
                .orElseThrow(() -> new EntityNotFoundException("Ticket with code " + ticketCode + " not found."));

        Event event = subscription.getEvent();
        if (!Objects.equals(event.getOrganizerProfile().getId(), organizerProfile.getId())) {
            throw new ForbiddenException("You can only validate tickets for your own events.");
        }

        if (subscription.getStatut() == Statut_Subscription.UTILISE) {
            throw new EntityAlreadyExistException("This ticket has already been used.");
        }

        if (subscription.getStatut() != Statut_Subscription.REUSSI) {
            throw new ForbiddenException("This ticket is not valid for use (Status: " + subscription.getStatut() + ").");
        }

        subscription.setStatut(Statut_Subscription.UTILISE);
        Subscription updatedSubscription = subscriptionRepository.save(subscription);

        return UtilSubscription.convertToSubscriptionResponse(updatedSubscription);
    }
}

