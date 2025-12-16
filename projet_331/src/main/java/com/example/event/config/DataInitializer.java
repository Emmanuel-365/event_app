package com.example.event.config;

import com.example.event.model.*;
import com.example.event.repository.EventRepository;
import com.example.event.repository.TicketCategoryRepository;
import com.example.event.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private TicketCategoryRepository ticketCategoryRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            // Create Organizer User and Profile
            User organizerUser = new User();
            organizerUser.setEmail("organizer@example.com");
            organizerUser.setPassword(passwordEncoder.encode("password"));
            organizerUser.setRole(UserRole.ROLE_ORGANIZER);

            OrganizerProfile organizerProfile = new OrganizerProfile();
            organizerProfile.setName("EventCorp");
            organizerProfile.setPhone("123456789");
            organizerProfile.setAnnee_activite(5);
            organizerProfile.setUser(organizerUser);
            organizerUser.setOrganizerProfile(organizerProfile);
            
            userRepository.save(organizerUser);

            // Create Visitor User and Profile
            User visitorUser = new User();
            visitorUser.setEmail("visitor@example.com");
            visitorUser.setPassword(passwordEncoder.encode("password"));
            visitorUser.setRole(UserRole.ROLE_VISITOR);

            VisitorProfile visitorProfile = new VisitorProfile();
            visitorProfile.setName("John");
            visitorProfile.setSurname("Doe");
            visitorProfile.setPhone("987654321");
            visitorProfile.setCity("New York");
            visitorProfile.setDate_inscription(LocalDate.now());
            visitorProfile.setUser(visitorUser);
            visitorUser.setVisitorProfile(visitorProfile);

            userRepository.save(visitorUser);

            // Create Admin User
            User adminUser = new User();
            adminUser.setEmail("admin@example.com");
            adminUser.setPassword(passwordEncoder.encode("password"));
            adminUser.setRole(UserRole.ROLE_ADMIN);
            userRepository.save(adminUser);

            // Create Event 1
            Event event1 = new Event();
            event1.setTitle("Grand Concert de Jazz");
            event1.setDescription("Une soirée inoubliable avec les plus grands noms du jazz.");
            event1.setLieu("Palais des Congrès");
            event1.setPlaces(500);
            event1.setDebut(LocalDate.now().plusDays(10));
            event1.setFin(LocalDate.now().plusDays(10));
            event1.setStatut(Statut_Event.PROCHAINEMENT);
            event1.setOrganizerProfile(organizerProfile);
            eventRepository.save(event1);

            // Create Tickets for Event 1
            TicketCategory ticket1_1 = new TicketCategory();
            ticket1_1.setIntitule("Standard");
            ticket1_1.setPrix(5000);
            ticket1_1.setEvent(event1);
            ticketCategoryRepository.save(ticket1_1);

            TicketCategory ticket1_2 = new TicketCategory();
            ticket1_2.setIntitule("VIP");
            ticket1_2.setPrix(15000);
            ticket1_2.setEvent(event1);
            ticketCategoryRepository.save(ticket1_2);

            // Create Event 2
            Event event2 = new Event();
            event2.setTitle("Conférence Tech 2025");
            event2.setDescription("Explorez le futur de la technologie avec des experts mondiaux.");
            event2.setLieu("Centre de Conférences International");
            event2.setPlaces(1000);
            event2.setDebut(LocalDate.now().plusMonths(2));
            event2.setFin(LocalDate.now().plusMonths(2).plusDays(2));
            event2.setStatut(Statut_Event.PROCHAINEMENT);
            event2.setOrganizerProfile(organizerProfile);
            eventRepository.save(event2);

            // Create Tickets for Event 2
            TicketCategory ticket2_1 = new TicketCategory();
            ticket2_1.setIntitule("Accès Complet");
            ticket2_1.setPrix(25000);
            ticket2_1.setEvent(event2);
            ticketCategoryRepository.save(ticket2_1);

            TicketCategory ticket2_2 = new TicketCategory();
            ticket2_2.setIntitule("Étudiant");
            ticket2_2.setPrix(10000);
            ticket2_2.setEvent(event2);
            ticketCategoryRepository.save(ticket2_2);
        }
    }
}
