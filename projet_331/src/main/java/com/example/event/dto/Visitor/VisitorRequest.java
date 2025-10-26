package com.example.event.dto.Visitor;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class VisitorRequest {
    private String name;
    private String surname;
    private String phone;
    private String city;
    private String email;
    private String password;

}
