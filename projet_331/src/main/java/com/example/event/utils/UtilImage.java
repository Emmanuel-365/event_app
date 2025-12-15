package com.example.event.utils;

import com.example.event.dto.image.ImageResponse;
import com.example.event.model.ImageEvent;
import org.springframework.stereotype.Component;

@Component
public class UtilImage {
    public static ImageResponse convertToImageResponse(ImageEvent image) {
        return new ImageResponse(
                image.getId(),
                image.getImageurl()
        );
    }
}
