package com.example.event.repository;

import com.example.event.model.ImageEvent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImageRepository extends JpaRepository<ImageEvent,Long> {
}
