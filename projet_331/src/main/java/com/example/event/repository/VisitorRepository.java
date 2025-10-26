package com.example.event.repository;

import com.example.event.model.Visitor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VisitorRepository extends JpaRepository<Visitor,Long> {
    boolean existsByEmail(String email);
    Optional<Visitor> findByEmail(String email);
}
