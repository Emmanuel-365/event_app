package com.example.event.service;

import com.example.event.Exception.EntityNotFoundException;
import com.example.event.model.User;
import com.example.event.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepository userRepository;

    public User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
    }

    public Object getMyProfile() {
        User user = getAuthenticatedUser();
        if (user.getRole() == com.example.event.model.UserRole.ROLE_VISITOR) {
            return user.getVisitorProfile(); // This will be serialized to JSON
        } else if (user.getRole() == com.example.event.model.UserRole.ROLE_ORGANIZER) {
            return user.getOrganizerProfile(); // This will be serialized to JSON
        }
        throw new IllegalStateException("User has no valid profile role");
    }
    
    // The update logic will be more complex and will be added later.
    // For now, the focus is on getting the structure right.
}
