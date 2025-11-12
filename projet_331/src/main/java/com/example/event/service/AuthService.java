package com.example.event.service;

import com.example.event.Exception.EntityAlreadyExistException;
import com.example.event.dto.auth.RegisterRequest;
import com.example.event.model.*;
import com.example.event.repository.OrganizerProfileRepository;
import com.example.event.repository.UserRepository;
import com.example.event.repository.VisitorProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final VisitorProfileRepository visitorProfileRepository;
    private final OrganizerProfileRepository organizerProfileRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EntityAlreadyExistException("User with this email already exists");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());

        if (request.getRole() == UserRole.ROLE_VISITOR) {
            VisitorProfile visitorProfile = new VisitorProfile();
            visitorProfile.setName(request.getName());
            visitorProfile.setSurname(request.getSurname());
            visitorProfile.setCity(request.getCity());
            visitorProfile.setPhone(request.getPhone());
            visitorProfile.setDate_inscription(LocalDate.now());
            visitorProfile.setUser(user);
            user.setVisitorProfile(visitorProfile);
        } else if (request.getRole() == UserRole.ROLE_ORGANIZER) {
            OrganizerProfile organizerProfile = new OrganizerProfile();
            organizerProfile.setName(request.getName());
            organizerProfile.setPhone(request.getPhone());
            organizerProfile.setAnnee_activite(request.getAnnee_activite());
            organizerProfile.setInstagram_url(request.getInstagram_url());
            organizerProfile.setFacebook_url(request.getFacebook_url());
            organizerProfile.setWhatsapp_url(request.getWhatsapp_url());
            organizerProfile.setProfil_url(request.getProfil_url());
            organizerProfile.setUser(user);
            user.setOrganizerProfile(organizerProfile);
        }

        userRepository.save(user);
    }
}
