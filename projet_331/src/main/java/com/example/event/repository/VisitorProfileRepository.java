package com.example.event.repository;

import com.example.event.model.VisitorProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VisitorProfileRepository extends JpaRepository<VisitorProfile, Long> {
}
