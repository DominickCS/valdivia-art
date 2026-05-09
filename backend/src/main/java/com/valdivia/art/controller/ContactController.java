package com.valdivia.art.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.valdivia.art.dto.request.ContactRequest;
import com.valdivia.art.service.EmailService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactController {
  private final EmailService emailService;

  @PostMapping()
  public ResponseEntity<String> contact(@RequestBody ContactRequest request) {
    emailService.sendContactEmail(request);
    return ResponseEntity.ok("Message sent.");

  }
}
