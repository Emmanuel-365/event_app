package com.example.event.utils;

import com.example.event.dto.Subscription.SubscriptionResponse;
import com.example.event.model.Subscription;
import org.springframework.stereotype.Component;

@Component
public class UtilSubscription {
    public static SubscriptionResponse convertToSubscriptionResponse(Subscription subscription) {
        return new SubscriptionResponse(
                subscription.getMontant(),
                subscription.getPlaces(),
                subscription.getCreatedAt(),
                subscription.getVisitor().getId(),
                subscription.getVisitor().getName(),
                subscription.getEvent().getTitle(),
                subscription.getEvent().getOrganizer().getName(),
                subscription.getTicket().getIntitule()
        );
    }
}
