package com.valdivia.art.service;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.valdivia.art.dto.request.AuthRequest;
import com.valdivia.art.dto.response.AuthResponse;
import com.valdivia.art.entity.User;
import com.valdivia.art.repository.UserRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final AuthenticationManager authenticationManager;
  private final JwtService jwtService;

  public ResponseEntity<AuthResponse> registerUser(AuthRequest request) {
    boolean userExists = userRepository.findByEmail(request.email()).isPresent();

    if (userExists) {
      return ResponseEntity.status(HttpStatus.CONFLICT)
          .body(new AuthResponse(null, "It appears you already have an account, sign in using your registered email."));
    }
    User user = new User();
    user.setFullName(request.fullName());
    user.setEmail(request.email());
    user.setPassword(passwordEncoder.encode(request.password()));
    userRepository.save(user);
    return ResponseEntity.ok(new AuthResponse(null, "You have registered successfully! Redirecting you..."));
  }

  public ResponseEntity<AuthResponse> login(AuthRequest request, HttpServletRequest httpRequest,
      HttpServletResponse httpResponse) {
    try {
      var authentication = authenticationManager.authenticate(
          new UsernamePasswordAuthenticationToken(request.email(), request.password()));
      String token = jwtService.generateToken(authentication);
      return ResponseEntity.ok(new AuthResponse(token, "Login Successful! Redirecting you..."));
    } catch (BadCredentialsException e) {
      return ResponseEntity.status(HttpStatus.FORBIDDEN)
          .body(new AuthResponse(null, "Invalid email or password provided!"));
    }
  }
}
