package com.example.event.repository;

import com.example.event.model.OrganizerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrganizerProfileRepository extends JpaRepository<OrganizerProfile, Long> {
}
