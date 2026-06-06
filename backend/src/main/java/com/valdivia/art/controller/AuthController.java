package com.valdivia.art.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stripe.exception.StripeException;
import com.valdivia.art.dto.request.AuthRequest;
import com.valdivia.art.dto.response.AuthResponse;
import com.valdivia.art.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
  private final UserService userService;

  @PostMapping("/register")
  public ResponseEntity<AuthResponse> register(@RequestBody @Valid AuthRequest request) throws StripeException {
    return userService.registerUser(request);
  }

  @PostMapping("/login")
  public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request, HttpServletRequest httpRequest,
      HttpServletResponse httpResponse) {
    return userService.login(request, httpRequest, httpResponse);
  }

  @PostMapping("/forgot-password")
  public ResponseEntity<Void> forgotPassword(@RequestBody Map<String, String> body) {
    userService.initiatePasswordReset(body.get("email"));
    // Always 200 — never reveal whether the email exists
    return ResponseEntity.ok().build();
  }

  @PostMapping("/reset-password")
  public ResponseEntity<Void> resetPassword(@RequestBody Map<String, String> body) {
    userService.resetPassword(body.get("token"), body.get("newPassword"));
    return ResponseEntity.ok().build();
  }
}
