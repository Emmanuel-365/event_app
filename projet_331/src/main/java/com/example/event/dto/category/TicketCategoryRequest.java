package com.example.event.dto.category;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class TicketCategoryRequest{

    private String intitule;
    private int prix;
    private Long id_event;
}
