package com.example.event.config;

import com.example.event.model.*;
import com.example.event.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;
import java.util.concurrent.ThreadLocalRandom;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private TicketCategoryRepository ticketCategoryRepository;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private static final Random random = new Random();

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            return; // Data already initialized
        }

        // --- Data for randomization ---
        List<String> firstNames = Arrays.asList("Awa", "Binta", "Moussa", "Fatou", "David", "Sophie", "Leo", "Chloe", "Paul", "Ines", "Hugo", "Manon");
        List<String> lastNames = Arrays.asList("Traoré", "Diallo", "Kamara", "Dupont", "Martin", "Bernard", "Robert", "Richard", "Durand");
        List<String> cities = Arrays.asList("Dakar", "Paris", "New York", "Douala", "Abidjan", "London", "Tokyo", "Yaoundé");
        List<String> eventTypes = Arrays.asList("Concert", "Conférence", "Atelier", "Exposition", "Festival", "Gala de Charité", "Lancement de Produit");
        List<String> eventQualifiers = Arrays.asList("Exceptionnel", "Annuel", "International", "de Prestige", "Innovant", "Culturel", "Artistique");
        List<String> eventDomains = Arrays.asList("de la Tech", "de la Musique", "d'Art Contemporain", "de la Mode", "du Cinéma", "Gastronomique");
        List<String> venues = Arrays.asList("Palais des Congrès", "Grand Théâtre", "Musée d'Art Moderne", "Stade de l'Amitié", "Hôtel de Ville", "Espace d'Exposition International");

        // --- User Creation ---
        List<OrganizerProfile> organizers = new ArrayList<>();
        for (int i = 0; i < 5; i++) {
            User user = new User();
            user.setEmail("organizer" + (i + 1) + "@eventapp.com");
            user.setPassword(passwordEncoder.encode("password"));
            user.setRole(UserRole.ROLE_ORGANIZER);

            OrganizerProfile profile = new OrganizerProfile();
            profile.setName(firstNames.get(random.nextInt(firstNames.size())) + " Events");
            profile.setPhone(String.valueOf(random.nextInt(999999999)));
            profile.setAnnee_activite(random.nextInt(10));
            profile.setProfil_url("https://picsum.photos/seed/" + random.nextInt(1000) + "/400/400");
            profile.setUser(user);
            user.setOrganizerProfile(profile);
            
            userRepository.save(user);
            organizers.add(profile);
        }

        List<VisitorProfile> visitors = new ArrayList<>();
        for (int i = 0; i < 20; i++) {
            User user = new User();
            user.setEmail("visitor" + (i + 1) + "@eventapp.com");
            user.setPassword(passwordEncoder.encode("password"));
            user.setRole(UserRole.ROLE_VISITOR);

            VisitorProfile profile = new VisitorProfile();
            profile.setName(firstNames.get(random.nextInt(firstNames.size())));
            profile.setSurname(lastNames.get(random.nextInt(lastNames.size())));
            profile.setPhone(String.valueOf(random.nextInt(999999999)));
            profile.setCity(cities.get(random.nextInt(cities.size())));
            profile.setDate_inscription(LocalDate.now().minusDays(random.nextInt(365)));
            profile.setUser(user);
            user.setVisitorProfile(profile);

            userRepository.save(user);
            visitors.add(profile);
        }

        User adminUser = new User();
        adminUser.setEmail("admin@eventapp.com");
        adminUser.setPassword(passwordEncoder.encode("password"));
        adminUser.setRole(UserRole.ROLE_ADMIN);
        userRepository.save(adminUser);

        // --- Event, Ticket, and Image Creation ---
        List<Event> allEvents = new ArrayList<>();
        for (OrganizerProfile organizer : organizers) {
            int numEvents = 2 + random.nextInt(4); // 2 to 5 events per organizer
            for (int i = 0; i < numEvents; i++) {
                Event event = new Event();
                event.setTitle(eventTypes.get(random.nextInt(eventTypes.size())) + " " + eventQualifiers.get(random.nextInt(eventQualifiers.size())) + " " + eventDomains.get(random.nextInt(eventDomains.size())));
                event.setDescription("Découvrez une expérience unique. " + event.getTitle() + " rassemble les passionnés et les experts pour un moment inoubliable. Réservez votre place dès maintenant !");
                event.setLieu(venues.get(random.nextInt(venues.size())) + ", " + cities.get(random.nextInt(cities.size())));
                event.setPlaces(50 + random.nextInt(1000));

                long minDay = LocalDate.now().minusDays(60).toEpochDay();
                long maxDay = LocalDate.now().plusDays(120).toEpochDay();
                long randomDay = ThreadLocalRandom.current().nextLong(minDay, maxDay);
                event.setDebut(LocalDate.ofEpochDay(randomDay));
                event.setFin(event.getDebut().plusDays(random.nextInt(3)));
                
                if (event.getDebut().isBefore(LocalDate.now())) {
                    event.setStatut(random.nextBoolean() ? Statut_Event.TERMINE : Statut_Event.EN_COURS);
                } else {
                    event.setStatut(Statut_Event.PROCHAINEMENT);
                }

                event.setOrganizerProfile(organizer);
                event.setProfil_url("https://picsum.photos/seed/" + random.nextInt(1000) + "/800/400");
                
                eventRepository.save(event);
                allEvents.add(event);

                // Add gallery images
                for (int j = 0; j < 3 + random.nextInt(5); j++) {
                    ImageEvent image = new ImageEvent();
                    image.setImageurl("https://picsum.photos/seed/" + random.nextInt(1000) + "/600/400");
                    image.setEvent(event);
                    imageRepository.save(image);
                }

                // Create tickets
                for (int k = 0; k < 2 + random.nextInt(2); k++) {
                    TicketCategory ticket = new TicketCategory();
                    ticket.setIntitule(k == 0 ? "Standard" : "VIP");
                    ticket.setPrix((k + 1) * 5000 + random.nextInt(5000));
                    ticket.setEvent(event);
                    ticketCategoryRepository.save(ticket);
                }
            }
        }
        
        // --- Subscription Simulation ---
        for (VisitorProfile visitor : visitors) {
            int numSubscriptions = 1 + random.nextInt(4); // 1 to 4 subscriptions per visitor
            for (int i = 0; i < numSubscriptions; i++) {
                Event eventToSubscribe = allEvents.get(random.nextInt(allEvents.size()));
                List<TicketCategory> ticketsForEvent = ticketCategoryRepository.findByEvent(eventToSubscribe);
                if (ticketsForEvent.isEmpty()) continue;

                Subscription sub = new Subscription();
                String codeticket;
                do {
                    codeticket = sub.generateTicketCode();
                } while (subscriptionRepository.existsByCodeticket(codeticket));
                
                sub.setCodeticket(codeticket);
                sub.setCreatedAt(LocalDateTime.now().minusDays(random.nextInt(60)));
                sub.setPlaces(1 + random.nextInt(2));
                sub.setEvent(eventToSubscribe);
                sub.setVisitorProfile(visitor);
                TicketCategory chosenTicket = ticketsForEvent.get(random.nextInt(ticketsForEvent.size()));
                sub.setTicket(chosenTicket);
                sub.setMontant(sub.getPlaces() * chosenTicket.getPrix());

                if (eventToSubscribe.getStatut() == Statut_Event.TERMINE) {
                    sub.setStatut(random.nextBoolean() ? Statut_Subscription.UTILISE : Statut_Subscription.REUSSI);
                } else {
                    sub.setStatut(Statut_Subscription.REUSSI);
                }

                if (eventToSubscribe.getPlaces() >= sub.getPlaces()) {
                    eventToSubscribe.setPlaces(eventToSubscribe.getPlaces() - sub.getPlaces());
                    subscriptionRepository.save(sub);
                    eventRepository.save(eventToSubscribe);
                }
            }
        }
    }
}
