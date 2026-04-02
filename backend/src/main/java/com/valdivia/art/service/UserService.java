package com.valdivia.art.service;

import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.stripe.StripeClient;
import com.stripe.exception.RateLimitException;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.param.CustomerCreateParams;
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
  private final StripeClient stripeClient;

  @Autowired
  private JavaMailSender mailSender;

  public ResponseEntity<AuthResponse> registerUser(AuthRequest request) throws RateLimitException, StripeException {
    try {
      boolean userExists = userRepository.findByEmail(request.email()).isPresent();

      if (userExists) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
            .body(
                new AuthResponse(null, "It appears you already have an account, sign in using your registered email."));
      }

      CustomerCreateParams params = CustomerCreateParams.builder().setEmail(request.email()).setName(request.fullName())
          .build();

      Customer customer = stripeClient.customers().create(params);

      // CREATE A USER IN THE DATABASE
      User user = new User();
      user.setFullName(request.fullName());
      user.setEmail(request.email());
      user.setPassword(passwordEncoder.encode(request.password()));
      user.setStripeCustomerID(customer.getId());
      userRepository.save(user);

      SimpleMailMessage emailMessage = new SimpleMailMessage();
      emailMessage.setFrom("mail@dominickcs.com"); // UPDATE THIS VAR IN PRODUCTION
      emailMessage.setTo(request.email());
      emailMessage.setSubject("WELCOME TO VALDIVIA.CO!");
      emailMessage.setText("Thank you for signing up, " + request.fullName() + "!");
      mailSender.send(emailMessage);

      return ResponseEntity.ok(new AuthResponse(null, "You have registered successfully! Redirecting you..."));
    } catch (RateLimitException e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(new AuthResponse(null, "STRIPE API RATE LIMIT EXCEEDED! " + e.getMessage()));
    } catch (StripeException e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(new AuthResponse(null, "STRIPE API EXCEPTION! " + e.getMessage()));
    }
  }

  public ResponseEntity<AuthResponse> login(AuthRequest request, HttpServletRequest httpRequest,
      HttpServletResponse httpResponse) {
    try {
      var authentication = authenticationManager.authenticate(
          new UsernamePasswordAuthenticationToken(request.email(), request.password()));
      User user = userRepository.findByEmail(request.email()).orElseThrow(NoSuchElementException::new);
      String token = jwtService.generateToken(authentication, user);
      return ResponseEntity.ok(new AuthResponse(token, "Login Successful! Redirecting you..."));
    } catch (BadCredentialsException e) {
      return ResponseEntity.status(HttpStatus.FORBIDDEN)
          .body(new AuthResponse(null, "Invalid email or password provided!"));
    } catch (NoSuchElementException e) {
      return ResponseEntity.status(HttpStatus.FORBIDDEN)
          .body(new AuthResponse(null, "Invalid email or password provided!"));
    }
  }
}
