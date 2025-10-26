package com.example.event.utils;

import com.example.event.dto.member.MemberResponse;
import com.example.event.model.Member;
import org.springframework.stereotype.Component;

@Component
public class UtilMembre {

    public static MemberResponse convertToMemberResponse(Member member){
        return new MemberResponse(
                member.getName(),
                member.getSurname(),
                member.getEmail(),
                member.getInstagram_url(),
                member.getFacebook_url(),
                member.getOrganizer().getName(),
                member.getProfil_url(),
                member.getRole()
        );
    }
}
