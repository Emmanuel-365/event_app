
package com.example.event.controller;

import com.example.event.dto.like.LikeCountResponse;
import com.example.event.dto.like.LikeResponse;
import com.example.event.service.LikeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/events/{eventId}/likes")
public class LikeController {

    private final LikeService likeService;

    public LikeController(LikeService likeService) {
        this.likeService = likeService;
    }

    @PostMapping
    public ResponseEntity<LikeResponse> likeEvent(@PathVariable Long eventId, Principal principal) {
        LikeResponse likeResponse = likeService.likeEvent(eventId, principal.getName());
        return new ResponseEntity<>(likeResponse, HttpStatus.CREATED);
    }

    @DeleteMapping
    public ResponseEntity<Void> unlikeEvent(@PathVariable Long eventId, Principal principal) {
        likeService.unlikeEvent(eventId, principal.getName());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/count")
    public ResponseEntity<LikeCountResponse> getLikeCountForEvent(@PathVariable Long eventId) {
        LikeCountResponse likeCountResponse = likeService.getLikeCountForEvent(eventId);
        return ResponseEntity.ok(likeCountResponse);
    }

    @GetMapping("/status")
    public ResponseEntity<Boolean> isEventLikedByUser(@PathVariable Long eventId, Principal principal) {
        boolean isLiked = likeService.isEventLikedByUser(eventId, principal.getName());
        return ResponseEntity.ok(isLiked);
    }
}
