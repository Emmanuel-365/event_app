package com.example.event.dto.Visitor;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class VisitorResponse {
    private Long id;
    private String name;
    private String surname;
    private String phone;
    private String city;
    private String email;
    private LocalDate date_inscription;
}