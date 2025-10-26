package com.example.event.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailSenderService {
    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(
                          String to,
                          String subject,
                          String body){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("isabelle.nishimwe@facsciences-uy1.cm");
        message.setTo(to);
        message.setText(body);
        message.setSubject(subject);

        mailSender.send(message);

        System.out.println("Mail envoyé avec succès...");
    }
}
