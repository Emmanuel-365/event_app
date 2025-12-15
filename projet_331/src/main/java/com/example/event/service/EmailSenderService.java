package com.example.event.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
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

        System.out.println("Simple mail envoyé avec succès...");
    }

    public void sendEmailWithQRCode(String to, String subject, String body, byte[] qrCode) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("isabelle.nishimwe@facsciences-uy1.cm");
            helper.setTo(to);
            helper.setSubject(subject);

            // Set the HTML body
            // The body should be an HTML string that references the inline image
            String htmlContent = "<html><body>" +
                                 body.replace("\n", "<br/>") +
                                 "<br/><br/>" +
                                 "<b>Your QR Code Ticket:</b><br/>" +
                                 "<img src='cid:qrCodeImage'/>" +
                                 "</body></html>";
            helper.setText(htmlContent, true);

            // Add the QR code as an inline attachment
            helper.addInline("qrCodeImage", new ByteArrayResource(qrCode), "image/png");

            mailSender.send(message);
            System.out.println("Mail avec QR Code envoyé avec succès...");

        } catch (MessagingException e) {
            // It's a good practice to handle the exception
            // For example, log it or wrap it in a custom application exception
            e.printStackTrace();
            // Or throw new RuntimeException("Failed to send email with QR code", e);
        }
    }
}
