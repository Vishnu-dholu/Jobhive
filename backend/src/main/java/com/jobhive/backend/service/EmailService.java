package com.jobhive.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Async
    public void sendEmail(String to, String subject, String body){
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            message.setFrom("JobHive HR <noreply@jobhive.com>");

            mailSender.send(message);
            System.out.println("Email sent successfully to " + to);
        } catch (Exception e){
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }
}
