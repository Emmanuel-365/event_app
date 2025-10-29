package com.example.event.config;

import com.example.event.model.*;
import com.example.event.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private OrganizerRepository organizerRepository;

    @Autowired
    private VisitorRepository visitorRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private TicketCategoryRepository ticketCategoryRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (organizerRepository.count() == 0) {
            // Create Organizer
            Organizer organizer = new Organizer();
            organizer.setName("EventCorp");
            organizer.setEmail("organizer@example.com");
            organizer.setPhone("123456789");
            organizer.setPassword(passwordEncoder.encode("password"));
            organizer.setAnnee_activite(5);
            organizerRepository.save(organizer);

            // Create Visitor
            Visitor visitor = new Visitor();
            visitor.setName("John");
            visitor.setSurname("Doe");
            visitor.setEmail("visitor@example.com");
            visitor.setPhone("987654321");
            visitor.setCity("New York");
            visitor.setPassword(passwordEncoder.encode("password"));
            visitor.setDate_inscription(LocalDate.now());
            visitorRepository.save(visitor);

            // Create Event 1
            Event event1 = new Event();
            event1.setTitle("Grand Concert de Jazz");
            event1.setDescription("Une soirée inoubliable avec les plus grands noms du jazz.");
            event1.setLieu("Palais des Congrès");
            event1.setPlaces(500);
            event1.setDebut(LocalDate.now().plusDays(10));
            event1.setFin(LocalDate.now().plusDays(10));
            event1.setStatut(Statut_Event.PROCHAINEMENT);
            event1.setOrganizer(organizer);
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
            event2.setOrganizer(organizer);
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
