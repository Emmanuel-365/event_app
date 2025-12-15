package com.example.event.service;

import com.example.event.Exception.EntityNotFoundException;
import com.example.event.Exception.ForbiddenException;
import com.example.event.model.User;
import com.example.event.model.UserRole;
import com.example.event.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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

    // Admin-specific methods
    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public User updateUserRole(Long userId, UserRole newRole) {
        User authenticatedUser = getAuthenticatedUser();
        if (authenticatedUser.getId().equals(userId)) {
            throw new ForbiddenException("An administrator cannot change their own role.");
        }

        User userToUpdate = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));

        userToUpdate.setRole(newRole);
        return userRepository.save(userToUpdate);
    }

    @Transactional
    public void deleteUser(Long userId) {
        User authenticatedUser = getAuthenticatedUser();
        if (authenticatedUser.getId().equals(userId)) {
            throw new ForbiddenException("An administrator cannot delete their own account.");
        }

        if (!userRepository.existsById(userId)) {
            throw new EntityNotFoundException("User not found with ID: " + userId);
        }
        userRepository.deleteById(userId);
    }
}
