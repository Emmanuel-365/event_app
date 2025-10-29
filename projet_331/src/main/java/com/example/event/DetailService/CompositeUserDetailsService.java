package com.example.event.DetailService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service("compositeUserDetailsService")
public class CompositeUserDetailsService implements UserDetailsService {

    @Autowired
    private OrganizerDetailService organizerDetailService;

    @Autowired
    private VisitorDetailService visitorDetailService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        try {
            // Try loading as an organizer first
            return organizerDetailService.loadUserByUsername(username);
        } catch (UsernameNotFoundException e) {
            // If not found, try loading as a visitor
            try {
                return visitorDetailService.loadUserByUsername(username);
            } catch (UsernameNotFoundException ex) {
                // If not found as a visitor either, throw the final exception
                throw new UsernameNotFoundException("User not found with email: " + username);
            }
        }
    }
}
