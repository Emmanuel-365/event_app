package com.example.event.controller;

import com.example.event.dto.image.ImageRequest;
import com.example.event.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/image")
public class ImageController {
    @Autowired
    private ImageService imageService;

    @PostMapping
    public ResponseEntity<?> createImage(@RequestBody ImageRequest image) {
        return imageService.createImage(image);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findImageById(@PathVariable Long id) {
        return imageService.findImage(id);
    }

    @GetMapping
    public ResponseEntity<?> getAllimages(){
        return imageService.getAllImages();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteImageById(@PathVariable Long id) {
        return imageService.deleteImage(id);
    }
}
