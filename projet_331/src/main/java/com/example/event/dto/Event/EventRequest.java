package com.example.event.dto.Event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class EventRequest {
    private String title;
    private String description;
    private int places;
    private String lieu;
    private LocalDate debut;
    private LocalDate fin;
    private Long id_organizer;
    private String profil_url;
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public int getPlaces() {
		return places;
	}
	public void setPlaces(int places) {
		this.places = places;
	}
	public LocalDate getFin() {
		return fin;
	}
	public void setFin(LocalDate fin) {
		this.fin = fin;
	}
	public LocalDate getDebut() {
		return debut;
	}
	public void setDebut(LocalDate debut) {
		this.debut = debut;
	}
	public String getLieu() {
		return lieu;
	}
	public void setLieu(String lieu) {
		this.lieu = lieu;
	}
	public Long getId_organizer() {
		return id_organizer;
	}
	public void setId_organizer(Long id_organizer) {
		this.id_organizer = id_organizer;
	}
	public String getProfil_url() {
		return profil_url;
	}
	public void setProfil_url(String profil_url) {
		this.profil_url = profil_url;
	}
}
