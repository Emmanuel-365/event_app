package com.example.event.service;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.example.event.dto.Subscription.SubscriptionRequest;
import com.example.event.dto.Subscription.SubscriptionResponse;
import com.example.event.model.*;
import com.example.event.repository.EventRepository;
import com.example.event.repository.SubscriptionRepository;
import com.example.event.repository.TicketCategoryRepository;
import com.example.event.repository.VisitorRepository;
import com.example.event.utils.UtilSubscription;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import com.example.event.Exception.EntityNotFoundException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SubscriptionService {

    @Autowired
    private SubscriptionRepository subscriptionRepository;
    @Autowired
    private EventRepository eventRepository;
    @Autowired
    private TicketCategoryRepository ticketCategoryRepository;
    @Autowired
    private VisitorRepository visitorRepository;

    @Autowired
    private EmailSenderService emailSenderService;

    public ResponseEntity<?> createSubscription(SubscriptionRequest subscriptionRequest){

        Visitor visitor = visitorRepository.findById(subscriptionRequest.getId_visitor()).orElse(null);
        Event event = eventRepository.findById(subscriptionRequest.getId_event()).orElse(null);
        TicketCategory ticketCategory = ticketCategoryRepository.findById(subscriptionRequest.getId_ticket()).orElse(null);

        if(visitor == null || event == null || ticketCategory == null){
            throw new EntityNotFoundException ("Informations manquantes");
        }


        Subscription subscription = new Subscription();
        String codeticket = subscription.generateTicketCode();

        subscription.setCreatedAt(LocalDateTime.now());
        subscription.setPlaces(subscriptionRequest.getPlaces());
        subscription.setVisitor(visitor);
        subscription.setEvent(event);
        subscription.setTicket(ticketCategory);
        do {
            codeticket = subscription.generateTicketCode();
        } while(subscriptionRepository.existsByCodeticket(codeticket));

        subscription.setCodeticket(codeticket);


        //Calcul du montant total
       int  montant = subscriptionRequest.getPlaces() * ticketCategory.getPrix();
       subscription.setMontant(montant);

        //liaison dans les deux sens
        visitor.getSubscriptionList().add(subscription);
        event.getSubscriptionList().add(subscription);
        ticketCategory.getSubscriptions().add(subscription);
        subscriptionRepository.save(subscription);
        eventRepository.save(event);
        visitorRepository.save(visitor);
        ticketCategoryRepository.save(ticketCategory);

        //Envoie du ticket
        /* emailSenderService.sendEmail(
                visitor.getEmail(),"Ticket de Confirmation pour l'Évènement "+event.getTitle(),
                "Merci pour votre enregistrement: Evenement "+event.getTitle()+" - Visiteur : "+visitor.getName()+" "+visitor.getName()
                        +" - Nombre de places : "+subscription.getPlaces()+" - Montant Total : "+ subscription.getMontant()
                        +" - Code Ticket : "+subscription.getCodeticket());*/

        SubscriptionResponse subscriptionResponse = UtilSubscription.convertToSubscriptionResponse(subscription);

       return ResponseEntity.ok(subscriptionResponse);

    }

    public ResponseEntity<?> findSubsription(Long id){
        Subscription subscription = subscriptionRepository.findById(id).orElse(null);

        if(subscription == null){
            throw new EntityNotFoundException("Souscription Introuvable");
        }
        SubscriptionResponse subscriptionResponse = UtilSubscription.convertToSubscriptionResponse(subscription);
        return ResponseEntity.ok(subscriptionResponse);
    }

    public ResponseEntity<?>  getAllSubscription(){

        List<Subscription> subscriptions = subscriptionRepository.findAll();
        List<SubscriptionResponse> subscriptionResponses= new ArrayList<>();

        for(Subscription subscription : subscriptions) {
            SubscriptionResponse subscriptionResponse = UtilSubscription.convertToSubscriptionResponse(subscription);
            subscriptionResponses.add(subscriptionResponse);
        }
        return ResponseEntity.ok(subscriptionResponses);
    }

    public ResponseEntity<?> deleteSubscription(Long id){
        Subscription subscription = subscriptionRepository.findById(id).orElse(null);
        if(subscription == null){
            throw new EntityNotFoundException(" Souscription Introuvable");
        }
        return ResponseEntity.ok("Suppression reussie !");
    }

    public ResponseEntity<?> getSubscriptionsByVisitor() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String visitorEmail = authentication.getName();

        Visitor visitor = visitorRepository.findByEmail(visitorEmail)
                .orElseThrow(() -> new EntityNotFoundException("Visitor not found with email: " + visitorEmail));

        List<Subscription> subscriptions = visitor.getSubscriptionList();
        List<SubscriptionResponse> subscriptionResponses = new ArrayList<>();
        for(Subscription subscription : subscriptions) {
            SubscriptionResponse subscriptionResponse = UtilSubscription.convertToSubscriptionResponse(subscription);
            subscriptionResponses.add(subscriptionResponse);
        }
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
