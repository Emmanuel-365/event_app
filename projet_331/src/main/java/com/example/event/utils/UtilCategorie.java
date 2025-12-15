package com.example.event.utils;

import com.example.event.dto.category.TicketCategoryResponse;
import com.example.event.model.TicketCategory;
import org.springframework.stereotype.Component;

@Component
public class UtilCategorie {
    public static TicketCategoryResponse convertToCategorieResponse(TicketCategory cat) {
        return new TicketCategoryResponse(
                cat.getId(),
                cat.getIntitule(),
                cat.getPrix(),
                cat.getEvent().getTitle()
        );
    }
}
