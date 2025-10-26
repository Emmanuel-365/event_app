package com.example.event.dto.Image;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class imageRequest {
    private String imageurl;
    private Long id_event;
	public String getImageurl() {
		return imageurl;
	}
	public void setImageurl(String imageurl) {
		this.imageurl = imageurl;
	}
	public Long getId_event() {
		return id_event;
	}
	public void setId_event(Long id_event) {
		this.id_event = id_event;
	}
}
