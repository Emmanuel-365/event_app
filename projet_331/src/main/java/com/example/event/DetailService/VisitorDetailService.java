package com.example.event.DetailService;
import com.example.event.model.Visitor;
import com.example.event.repository.VisitorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class VisitorDetailService implements UserDetailsService {

    @Autowired
    private VisitorRepository visitorRepository;

    @Override

    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Visitor visitor = visitorRepository.findByEmail((email))
                .orElseThrow(() -> new UsernameNotFoundException("Visiteur non trouvé"));
        return User.builder()
                .username(visitor.getEmail())
                .password(visitor.getPassword())
                .roles("VISITOR")
                .build();
    }
}
