package com.example.event.repository;

import com.example.event.model.Event;
import com.example.event.model.TicketCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketCategoryRepository extends JpaRepository<TicketCategory,Long> {
    List<TicketCategory> findByEvent(Event event);
}
