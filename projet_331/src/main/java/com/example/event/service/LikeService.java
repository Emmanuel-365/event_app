
package com.example.event.service;

import com.example.event.dto.like.LikeCountResponse;
import com.example.event.dto.like.LikeResponse;
import com.example.event.dto.user.UserResponse;
import com.example.event.model.Event;
import com.example.event.model.EventLike;
import com.example.event.model.User;
import com.example.event.repository.EventLikeRepository;
import com.example.event.repository.EventRepository;
import com.example.event.repository.UserRepository;
import com.example.event.Exception.EntityNotFoundException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LikeService {

    private final EventLikeRepository eventLikeRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    public LikeService(EventLikeRepository eventLikeRepository, EventRepository eventRepository, UserRepository userRepository) {
        this.eventLikeRepository = eventLikeRepository;
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public LikeResponse likeEvent(Long eventId, String username) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event not found with id: " + eventId));

        if (eventLikeRepository.findByEventIdAndUserId(eventId, user.getId()).isPresent()) {
            throw new DataIntegrityViolationException("User has already liked this event");
        }

        EventLike eventLike = new EventLike();
        eventLike.setUser(user);
        eventLike.setEvent(event);

        EventLike savedLike = eventLikeRepository.save(eventLike);
        return toLikeResponse(savedLike);
    }

    @Transactional
    public void unlikeEvent(Long eventId, String username) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
        EventLike eventLike = eventLikeRepository.findByEventIdAndUserId(eventId, user.getId())
                .orElseThrow(() -> new EntityNotFoundException("Like not found for this user and event"));

        eventLikeRepository.delete(eventLike);
    }

    @Transactional(readOnly = true)
    public LikeCountResponse getLikeCountForEvent(Long eventId) {
        long count = eventLikeRepository.countByEventId(eventId);
        return new LikeCountResponse(count);
    }
    
    @Transactional(readOnly = true)
    public boolean isEventLikedByUser(Long eventId, String username) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
        return eventLikeRepository.findByEventIdAndUserId(eventId, user.getId()).isPresent();
    }

    private LikeResponse toLikeResponse(EventLike eventLike) {
        LikeResponse response = new LikeResponse();
        response.setId(eventLike.getId());
        response.setUser(new UserResponse(eventLike.getUser().getId(), eventLike.getUser().getEmail()));
        response.setEventId(eventLike.getEvent().getId());
        response.setCreatedAt(eventLike.getCreatedAt());
        return response;
    }
}
