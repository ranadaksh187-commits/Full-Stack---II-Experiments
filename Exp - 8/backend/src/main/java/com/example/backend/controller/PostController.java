package com.example.backend.controller;

import com.example.backend.entity.ScheduledPost;
import com.example.backend.repository.ScheduledPostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*") // For development, allow all origins
public class PostController {

    @Autowired
    private ScheduledPostRepository repository;

    @PostMapping("/schedule")
    public ResponseEntity<ScheduledPost> schedulePost(@RequestBody ScheduledPost post) {
        post.setStatus("PENDING");
        ScheduledPost savedPost = repository.save(post);
        return ResponseEntity.ok(savedPost);
    }

    @GetMapping
    public ResponseEntity<List<ScheduledPost>> getAllPosts() {
        return ResponseEntity.ok(repository.findAll());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteScheduledPost(@PathVariable Long id) {
        return repository.findById(id)
                .map(post -> {
                    if (!"PENDING".equals(post.getStatus())) {
                        return ResponseEntity.status(409).<Void>build();
                    }

                    repository.delete(post);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
