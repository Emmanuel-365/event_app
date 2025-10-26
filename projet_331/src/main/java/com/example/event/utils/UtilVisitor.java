package com.example.event.utils;

import com.example.event.model.Visitor;
import org.springframework.stereotype.Component;
import com.example.event.dto.Visitor.VisitorResponse;
@Component
public class UtilVisitor {
    public static VisitorResponse convertToVisitorResponse(Visitor visitor){
        return  new VisitorResponse(
                visitor.getId(),
                visitor.getName(),
                visitor.getSurname(),
                visitor.getPhone(),
                visitor.getCity(),
                visitor.getEmail(),
                visitor.getDate_inscription()
        );
    }
}
