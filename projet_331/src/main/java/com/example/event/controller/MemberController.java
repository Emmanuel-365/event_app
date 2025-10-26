package com.example.event.controller;

import com.example.event.dto.member.MemberRequest;
import com.example.event.service.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/member")
public class MemberController {

    @Autowired
    private MemberService memberService;

    @PostMapping
    public ResponseEntity<?> createMembre(@RequestBody MemberRequest member) {
        return memberService.createMember(member);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findMember(@PathVariable Long id) {
        return memberService.findMember(id);
    }

    @GetMapping
    public ResponseEntity<?> getAllMembers(){
        return memberService.getAllMembers();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMember(@PathVariable Long id) {
        return memberService.deleteMember(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMember(@RequestBody MemberRequest memberRequest, @PathVariable Long id){
        return memberService.updateMember(memberRequest,id);
    }
}
