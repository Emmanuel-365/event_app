package com.example.event.dto.auth;

import com.example.event.model.UserRole;
import lombok.Data;

@Data
public class RegisterRequest {
    // Common fields
    private String email;
    private String password;
    private String name;
    private String phone;
    private UserRole role;

    // Visitor specific
    private String surname;
    private String city;

    // Organizer specific
    private int annee_activite;
    private String instagram_url;
    private String facebook_url;
    private String whatsapp_url;
    private String profil_url;
}
