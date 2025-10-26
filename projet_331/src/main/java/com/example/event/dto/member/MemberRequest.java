package com.example.event.dto.member;

import com.example.event.model.Role;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MemberRequest {
    private String name;
    private String surname;
    private String email;
    private String instagram_url;
    private String facebook_url;
    private Long id_organizer;
    private String profil_url;
    @Enumerated(EnumType.STRING)
    private Role role;
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getSurname() {
		return surname;
	}
	public void setSurname(String surname) {
		this.surname = surname;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getInstagram_url() {
		return instagram_url;
	}
	public void setInstagram_url(String instagram_url) {
		this.instagram_url = instagram_url;
	}
	public String getFacebook_url() {
		return facebook_url;
	}
	public void setFacebook_url(String facebook_url) {
		this.facebook_url = facebook_url;
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
