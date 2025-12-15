package com.example.event.service;

import com.example.event.Exception.EntityAlreadyExistException;
import com.example.event.Exception.EntityNotFoundException;
import com.example.event.Exception.ForbiddenException;
import com.example.event.dto.auth.RegisterRequest;
import com.example.event.model.*;
import com.example.event.repository.OrganizerProfileRepository;
import com.example.event.repository.PasswordResetTokenRepository;
import com.example.event.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final VisitorProfileRepository visitorProfileRepository;
    private final OrganizerProfileRepository organizerProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailSenderService emailSenderService;

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

    @Transactional
    public void initiatePasswordReset(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found with email: " + email));

        // Delete any existing tokens for this user
        passwordResetTokenRepository.deleteByUser(user);

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken(token, user);
        passwordResetTokenRepository.save(resetToken);

        String resetLink = "http://localhost:5173/reset-password?token=" + token; // Frontend URL
        emailSenderService.sendEmail(
                user.getEmail(),
                "Password Reset Request",
                "To reset your password, click on the following link: " + resetLink +
                "\n\nThis link will expire in 24 hours."
        );
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new EntityNotFoundException("Invalid or expired password reset token."));

        if (resetToken.isExpired()) {
            passwordResetTokenRepository.delete(resetToken); // Clean up expired token
            throw new ForbiddenException("Password reset token has expired.");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        passwordResetTokenRepository.delete(resetToken); // Invalidate token after use
    }
}
