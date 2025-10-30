package com.example.event.dto.Event;

import com.example.event.dto.category.TicketCategoryResponse;
import com.example.event.model.Statut_Event;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class EventResponse {
    private Long id;
    private String title;
    private String description;
    private int places;
    private String lieu;
    private LocalDate debut;
    private LocalDate fin;
    private String organizer_name;
    @Enumerated(EnumType.STRING)
    private Statut_Event statutEvent;
    private String profil_url;
    private List<TicketCategoryResponse> ticketCategoryList;

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
	public String getLieu() {
		return lieu;
	}
	public void setLieu(String lieu) {
		this.lieu = lieu;
	}
	public LocalDate getDebut() {
		return debut;
	}
	public void setDebut(LocalDate debut) {
		this.debut = debut;
	}
	public LocalDate getFin() {
		return fin;
	}
	public void setFin(LocalDate fin) {
		this.fin = fin;
	}
	public String getOrganizer_name() {
		return organizer_name;
	}
	    public void setOrganizer_name(String organizer_name) {
	        this.organizer_name = organizer_name;
	    }	public String getProfil_url() {
		return profil_url;
	}
	public void setProfil_url(String profil_url) {
		this.profil_url = profil_url;
	}

    public List<TicketCategoryResponse> getTicketCategoryList() {
        return ticketCategoryList;
    }

    public void setTicketCategoryList(List<TicketCategoryResponse> ticketCategoryList) {
        this.ticketCategoryList = ticketCategoryList;
    }
}
