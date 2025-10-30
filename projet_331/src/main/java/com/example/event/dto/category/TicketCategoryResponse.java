package com.example.event.dto.category;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class TicketCategoryResponse{

    private Long id;
    private String intitule;
    private int prix;
    private String event_name;
}
