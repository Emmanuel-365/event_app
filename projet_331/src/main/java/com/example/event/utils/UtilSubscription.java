package com.example.event.utils;

import com.example.event.dto.Subscription.SubscriptionResponse;
import com.example.event.dto.Visitor.VisitorDto;
import com.example.event.model.Subscription;
import org.springframework.stereotype.Component;

@Component
public class UtilSubscription {
    public static SubscriptionResponse convertToSubscriptionResponse(Subscription subscription) {
        return new SubscriptionResponse(
                subscription.getId(),
                subscription.getMontant(),
                subscription.getPlaces(),
                subscription.getCreatedAt(),
                new VisitorDto(
                        subscription.getVisitorProfile().getId(),
                        subscription.getVisitorProfile().getName(),
                        subscription.getVisitorProfile().getSurname(),
                        subscription.getVisitorProfile().getUser().getEmail()
                ),
                subscription.getEvent().getId(),
                subscription.getEvent().getTitle(),
                subscription.getEvent().getDebut(),
                subscription.getEvent().getLieu(),
                subscription.getEvent().getOrganizerProfile().getName(),
                subscription.getTicket().getIntitule(),
                subscription.getEvent().getProfil_url(),
                subscription.getCodeticket()
        );
    }
}
