package com.valdivia.art.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.valdivia.art.dto.request.AuthRequest;
import com.valdivia.art.dto.response.AuthResponse;
import com.valdivia.art.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
  private final UserService userService;

  @PostMapping("/register")
  public ResponseEntity<AuthResponse> register(@RequestBody AuthRequest request) {
    return userService.registerUser(request);
  }

  @PostMapping("/login")
  public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request, HttpServletRequest httpRequest,
      HttpServletResponse httpResponse) {
    return userService.login(request, httpRequest, httpResponse);
  }
}
