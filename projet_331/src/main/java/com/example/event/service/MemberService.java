package com.example.event.service;

import com.example.event.Exception.EntityAlreadyExistException;
import com.example.event.Exception.EntityNotFoundException;
import com.example.event.dto.member.MemberRequest;
import com.example.event.dto.member.MemberResponse;
import com.example.event.model.Member;
import com.example.event.model.Organizer;
import com.example.event.repository.MemberRepository;
import com.example.event.repository.OrganizerRepository;
import com.example.event.utils.UtilMembre;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class MemberService {

    @Autowired
    private MemberRepository memberRepository;
    @Autowired
    private OrganizerRepository organizerRepository;

    //creation
    public ResponseEntity<?> createMember(MemberRequest memberRequest){
        Organizer organizer = organizerRepository.findById(memberRequest.getId_organizer()).orElse(null);
        if(organizer == null){
            throw new EntityNotFoundException("Organisateur introuvable");
        }

        if(memberRepository.existsByEmail(memberRequest.getEmail())){
            throw new EntityAlreadyExistException("Membre déjà existant");
        }

        Member member = new Member();

        member.setName(memberRequest.getName());
        member.setEmail(memberRequest.getEmail());
        member.setInstagram_url(memberRequest.getInstagram_url());
        member.setOrganizer(organizer);
        member.setFacebook_url(memberRequest.getFacebook_url());
        member.setRole(memberRequest.getRole());
        member.setSurname(memberRequest.getSurname());
        member.setProfil_url((memberRequest.getProfil_url()));
        organizer.getMembers().add(member);
        memberRepository.save(member);
        organizerRepository.save(organizer);

        MemberResponse memberResponse = UtilMembre.convertToMemberResponse(member);
        return ResponseEntity.ok(memberResponse);
    }

    public ResponseEntity<?> findMember(Long Id){
        Member member = memberRepository.findById(Id).orElse(null);

        if (member == null){
            throw new EntityNotFoundException("Membre introuvable");
        }
        MemberResponse memberResponse = UtilMembre.convertToMemberResponse(member);
        return ResponseEntity.ok(memberResponse);
    }

    public ResponseEntity<?>  getAllMembers(){
        List<Member> members = memberRepository.findAll();
        List<MemberResponse> memberResponses = new ArrayList<>();
        for(Member member :  members) {
            MemberResponse memberResponse = UtilMembre.convertToMemberResponse(member);
            memberResponses.add(memberResponse);

        }
        return ResponseEntity.ok(memberResponses);
    }

    public ResponseEntity<?> deleteMember(Long id){
        Member member = memberRepository.findById(id).orElse(null);
        if(member == null){
            throw new EntityNotFoundException(" Membre Introuvable");
        }
        return ResponseEntity.ok("Suppression reussie du membre ID: "+member.getId()+"- Nom: "+member.getName());
    }

    //modifier
    public ResponseEntity<?> updateMember(MemberRequest memberRequest, Long id){
        Member member = memberRepository.findById(id).orElse(null);

        if(member == null){
            throw new EntityNotFoundException("Membre introuvable");
        }
        member.setName(memberRequest.getName());
        member.setEmail(memberRequest.getEmail());
        member.setInstagram_url(memberRequest.getInstagram_url());
        member.setFacebook_url(memberRequest.getFacebook_url());
        member.setRole(memberRequest.getRole());
        member.setSurname(memberRequest.getSurname());
        member.setProfil_url((memberRequest.getProfil_url()));

        memberRepository.save(member);

        MemberResponse memberResponse = UtilMembre.convertToMemberResponse(member);
        return ResponseEntity.ok(memberResponse);
    }
}
