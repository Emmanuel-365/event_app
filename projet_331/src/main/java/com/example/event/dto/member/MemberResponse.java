package com.example.event.dto.member;

import com.example.event.model.Role;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MemberResponse {
    private Long id;
    private String name;
    private String surname;
    private String email;
    private String instagram_url;
    private String facebook_url;
    private String organizer_name;
    private String profil_url;
    @Enumerated(EnumType.STRING)
    private Role role;
}
