package com.example.event.service;

import com.example.event.Exception.EntityNotFoundException;
import com.example.event.model.Comment;
import com.example.event.model.CommentStatus;
import com.example.event.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminCommentService {

    private final CommentRepository commentRepository;

    @Transactional(readOnly = true)
    public Page<Comment> getAllComments(Pageable pageable) {
        return commentRepository.findAll(pageable);
    }

    @Transactional
    public Comment updateCommentStatus(Long commentId, CommentStatus newStatus) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("Comment not found with ID: " + commentId));
        comment.setStatus(newStatus);
        return commentRepository.save(comment);
    }
}
