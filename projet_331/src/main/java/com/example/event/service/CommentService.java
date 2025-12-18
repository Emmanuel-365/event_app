
package com.example.event.service;

import com.example.event.dto.comment.CommentRequest;
import com.example.event.dto.comment.CommentResponse;
import com.example.event.dto.user.UserResponse;
import com.example.event.model.Comment;
import com.example.event.model.Event;
import com.example.event.model.User;
import com.example.event.repository.CommentRepository;
import com.example.event.repository.EventRepository;
import com.example.event.repository.UserRepository;
import com.example.event.Exception.EntityNotFoundException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    public CommentService(CommentRepository commentRepository, EventRepository eventRepository, UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public CommentResponse createComment(Long eventId, CommentRequest commentRequest, String username) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event not found with id: " + eventId));

        Comment comment = new Comment();
        comment.setContent(commentRequest.getContent());
        comment.setUser(user);
        comment.setEvent(event);

        if (commentRequest.getParentCommentId() != null) {
            Comment parentComment = commentRepository.findById(commentRequest.getParentCommentId())
                    .orElseThrow(() -> new EntityNotFoundException("Parent comment not found with id: " + commentRequest.getParentCommentId()));
            comment.setParentComment(parentComment);
        }

        Comment savedComment = commentRepository.save(comment);
        return toCommentResponse(savedComment);
    }

    @Transactional(readOnly = true)
    public List<CommentResponse> getCommentsForEvent(Long eventId) {
        List<Comment> comments = commentRepository.findByEventIdAndParentCommentIsNull(eventId);
        return comments.stream()
                .map(this::toCommentResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public CommentResponse updateComment(Long commentId, CommentRequest commentRequest, String username) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("Comment not found with id: " + commentId));

        if (!comment.getUser().getEmail().equals(username)) {
            throw new SecurityException("User not authorized to update this comment");
        }

        comment.setContent(commentRequest.getContent());
        Comment updatedComment = commentRepository.save(comment);
        return toCommentResponse(updatedComment);
    }

    @Transactional
    public void deleteComment(Long commentId, String username) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("Comment not found with id: " + commentId));

        if (!comment.getUser().getEmail().equals(username)) {
            throw new SecurityException("User not authorized to delete this comment");
        }

        commentRepository.delete(comment);
    }

    private CommentResponse toCommentResponse(Comment comment) {
        CommentResponse response = new CommentResponse();
        response.setId(comment.getId());
        response.setContent(comment.getContent());
        response.setUser(new UserResponse(comment.getUser().getId(), comment.getUser().getEmail()));
        response.setEventId(comment.getEvent().getId());
        if (comment.getParentComment() != null) {
            response.setParentCommentId(comment.getParentComment().getId());
        }
        if (comment.getReplies() != null && !comment.getReplies().isEmpty()) {
            response.setReplies(comment.getReplies().stream().map(this::toCommentResponse).collect(Collectors.toSet()));
        }
        response.setCreatedAt(comment.getCreatedAt());
        response.setUpdatedAt(comment.getUpdatedAt());
        return response;
    }
}
