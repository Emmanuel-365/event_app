package com.example.event.utils;
import com.example.event.dto.Organizer.OrganizerResponse;
import com.example.event.model.Organizer;
import org.springframework.stereotype.Component;

@Component
public class UtilOrganizer {
    public static OrganizerResponse convertToOrganizer(Organizer organizer){
        return new OrganizerResponse(
                organizer.getId(),
                organizer.getName(),
                organizer.getEmail(),
                organizer.getPhone(),
                organizer.getInstagram_url(),
                organizer.getFacebook_url(),
                organizer.getWhatsapp_url(),
                organizer.getProfil_url(),
                organizer.getAnnee_activite()
        );
    }
}
