package com.example.event.service;

import com.example.event.Exception.EntityNotFoundException;
import com.example.event.dto.image.ImageRequest;
import com.example.event.model.Event;
import com.example.event.model.ImageEvent;
import com.example.event.repository.EventRepository;
import com.example.event.repository.ImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class ImageService {

    @Autowired
    private ImageRepository imageRepository;
    @Autowired
    private EventRepository eventRepository;

    public ResponseEntity<?> createImage(ImageRequest imageRequest){
        Event event = eventRepository.findById(imageRequest.getId_event()).orElse(null);

        if(event == null){
            throw new EntityNotFoundException("Évènement introuvable");
        }
        ImageEvent image = new ImageEvent();
        image.setEvent(event);
        image.setImageurl(imageRequest.getImageurl());
        event.getImages().add(image);

        imageRepository.save(image);
        eventRepository.save(event);
        return ResponseEntity.ok(image);


    }

    public ResponseEntity<?> findImage(Long id){
        ImageEvent image = imageRepository.findById(id).orElse(null);
        if(image == null){
            throw new EntityNotFoundException("Image introuvable");
        }
        return ResponseEntity.ok(image);
    }

    public ResponseEntity<?> getAllImages(){
        List<ImageEvent> images = imageRepository.findAll();
        return ResponseEntity.ok(images);

    }
    public ResponseEntity<?> deleteImage(Long Id){
        ImageEvent image = imageRepository.findById(Id).orElse(null);
        if(image == null){
            throw new EntityNotFoundException("Image introuvable");
        }
        imageRepository.delete(image);
        return ResponseEntity.ok("Suppression réussie!");
    }
}
