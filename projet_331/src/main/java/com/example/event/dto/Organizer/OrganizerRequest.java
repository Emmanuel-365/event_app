package com.example.event.dto.Organizer;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class OrganizerRequest {
    private String name;
    private String email;
    private String phone;
    private String password;
    private String instagram_url;
    private String facebook_url;
    private String whatsapp_url;
    private String profil_url;
    private int annee_activite;
}
