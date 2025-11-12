package com.example.event.dto.Subscription;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionRequest {
    private int places;
    private Long id_event;
    private Long id_ticket;
}
