package com.example.event.service;

import com.example.event.Exception.EntityAlreadyExistException;
import com.example.event.Exception.EntityNotFoundException;
import com.example.event.Exception.ForbiddenException;
import com.example.event.dto.member.MemberRequest;
import com.example.event.dto.member.MemberResponse;
import com.example.event.model.Member;
import com.example.event.model.OrganizerProfile;
import com.example.event.model.User;
import com.example.event.repository.MemberRepository;
import com.example.event.repository.OrganizerProfileRepository;
import com.example.event.utils.UtilMembre;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final OrganizerProfileRepository organizerProfileRepository;
    private final ProfileService profileService;

    public ResponseEntity<?> createMember(MemberRequest memberRequest) {
        User user = profileService.getAuthenticatedUser();
        OrganizerProfile organizerProfile = user.getOrganizerProfile();
        if (organizerProfile == null) {
            throw new ForbiddenException("Only organizers can add members.");
        }

        if (memberRepository.existsByEmail(memberRequest.getEmail())) {
            throw new EntityAlreadyExistException("Member with this email already exists");
        }

        Member member = new Member();
        member.setName(memberRequest.getName());
        member.setSurname(memberRequest.getSurname());
        member.setEmail(memberRequest.getEmail());
        member.setInstagram_url(memberRequest.getInstagram_url());
        member.setFacebook_url(memberRequest.getFacebook_url());
        member.setRole(memberRequest.getRole());
        member.setProfil_url(memberRequest.getProfil_url());
        member.setOrganizerProfile(organizerProfile);

        memberRepository.save(member);

        organizerProfile.getMembers().add(member);
        organizerProfileRepository.save(organizerProfile);

        MemberResponse memberResponse = UtilMembre.convertToMemberResponse(member);
        return ResponseEntity.ok(memberResponse);
    }

    public ResponseEntity<?> findMember(Long id) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Member not found"));
        
        // Security check
        User user = profileService.getAuthenticatedUser();
        if (!member.getOrganizerProfile().getUser().getId().equals(user.getId())) {
            throw new ForbiddenException("You can only view your own members.");
        }

        MemberResponse memberResponse = UtilMembre.convertToMemberResponse(member);
        return ResponseEntity.ok(memberResponse);
    }

    public ResponseEntity<?> getAllMembers() {
        User user = profileService.getAuthenticatedUser();
        OrganizerProfile organizerProfile = user.getOrganizerProfile();
        if (organizerProfile == null) {
            throw new ForbiddenException("User is not an organizer.");
        }

        List<MemberResponse> memberResponses = organizerProfile.getMembers().stream()
                .map(UtilMembre::convertToMemberResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(memberResponses);
    }

    public ResponseEntity<?> deleteMember(Long id) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Member not found"));

        // Security check
        User user = profileService.getAuthenticatedUser();
        if (!member.getOrganizerProfile().getUser().getId().equals(user.getId())) {
            throw new ForbiddenException("You can only delete your own members.");
        }

        memberRepository.delete(member);
        return ResponseEntity.ok("Member deleted successfully.");
    }

    public ResponseEntity<?> updateMember(MemberRequest memberRequest, Long id) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Member not found"));

        // Security check
        User user = profileService.getAuthenticatedUser();
        if (!member.getOrganizerProfile().getUser().getId().equals(user.getId())) {
            throw new ForbiddenException("You can only update your own members.");
        }

        member.setName(memberRequest.getName());
        member.setSurname(memberRequest.getSurname());
        member.setEmail(memberRequest.getEmail());
        member.setInstagram_url(memberRequest.getInstagram_url());
        member.setFacebook_url(memberRequest.getFacebook_url());
        member.setRole(memberRequest.getRole());
        member.setProfil_url(memberRequest.getProfil_url());

        memberRepository.save(member);

        MemberResponse memberResponse = UtilMembre.convertToMemberResponse(member);
        return ResponseEntity.ok(memberResponse);
    }
}
