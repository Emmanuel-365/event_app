
package com.example.event.repository;

import com.example.event.model.EventLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EventLikeRepository extends JpaRepository<EventLike, Long> {
    Optional<EventLike> findByEventIdAndUserId(Long eventId, Long userId);
    long countByEventId(Long eventId);
}
