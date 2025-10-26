package com.example.event.DetailService;

import com.example.event.model.Organizer;
import com.example.event.repository.OrganizerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class OrganizerDetailService implements UserDetailsService {
    @Autowired
    private OrganizerRepository organizerRepository;

    @Override

    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Organizer organizer = organizerRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Organizer non trouvé"));
        return User.builder()
                .username(organizer.getEmail())
                .password(organizer.getPassword())
                .roles("ORGANIZER")
                .build();
    }

}
