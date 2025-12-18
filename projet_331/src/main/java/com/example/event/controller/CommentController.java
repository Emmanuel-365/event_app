
package com.example.event.controller;

import com.example.event.dto.comment.CommentRequest;
import com.example.event.dto.comment.CommentResponse;
import com.example.event.service.CommentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping("/events/{eventId}/comments")
    public ResponseEntity<CommentResponse> createComment(@PathVariable Long eventId,
                                                         @RequestBody CommentRequest commentRequest,
                                                         Principal principal) {
        CommentResponse createdComment = commentService.createComment(eventId, commentRequest, principal.getName());
        return new ResponseEntity<>(createdComment, HttpStatus.CREATED);
    }

    @GetMapping("/events/{eventId}/comments")
    public ResponseEntity<List<CommentResponse>> getCommentsForEvent(@PathVariable Long eventId) {
        List<CommentResponse> comments = commentService.getCommentsForEvent(eventId);
        return ResponseEntity.ok(comments);
    }

    @PutMapping("/comments/{commentId}")
    public ResponseEntity<CommentResponse> updateComment(@PathVariable Long commentId,
                                                         @RequestBody CommentRequest commentRequest,
                                                         Principal principal) {
        CommentResponse updatedComment = commentService.updateComment(commentId, commentRequest, principal.getName());
        return ResponseEntity.ok(updatedComment);
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId, Principal principal) {
        commentService.deleteComment(commentId, principal.getName());
        return ResponseEntity.noContent().build();
    }
}
