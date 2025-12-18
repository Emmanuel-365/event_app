package com.example.event.controller;

import com.example.event.model.Comment;
import com.example.event.model.CommentStatus;
import com.example.event.service.AdminCommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/comments")
@RequiredArgsConstructor
public class AdminCommentController {

    private final AdminCommentService adminCommentService;

    @GetMapping
    public ResponseEntity<Page<Comment>> getAllComments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Comment> comments = adminCommentService.getAllComments(pageable);
        return ResponseEntity.ok(comments);
    }

    @PutMapping("/{commentId}/status")
    public ResponseEntity<Comment> updateCommentStatus(@PathVariable Long commentId, @RequestBody CommentStatus newStatus) {
        Comment updatedComment = adminCommentService.updateCommentStatus(commentId, newStatus);
        return ResponseEntity.ok(updatedComment);
    }
}
