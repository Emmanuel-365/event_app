package com.example.event.repository;

import com.example.event.model.Organizer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OrganizerRepository extends JpaRepository<Organizer,Long> {
    boolean existsByEmail(String email);

    Optional<Organizer> findByEmail(String email);
}
