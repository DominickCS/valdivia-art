package com.valdivia.art.controller;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.valdivia.art.dto.response.CartResponse;
import com.valdivia.art.entity.User;
import com.valdivia.art.repository.UserRepository;
import com.valdivia.art.service.CartService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

  private final CartService cartService;
  private final UserRepository userRepository;

  private UUID resolveUserId(UserDetails userDetails) {
    User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
    return user.getId();
  }

  // GET /api/cart
  @GetMapping
  public ResponseEntity<CartResponse> getCart(
      @AuthenticationPrincipal UserDetails userDetails) {
    return cartService.getCart(resolveUserId(userDetails));
  }

  // POST /api/cart/add/{artworkId}?quantity=1
  @PostMapping("/add/{artworkId}")
  public ResponseEntity<String> addToCart(
      @AuthenticationPrincipal UserDetails userDetails,
      @PathVariable Long artworkId,
      @RequestParam(defaultValue = "1") Integer quantity) {
    return cartService.addToCart(resolveUserId(userDetails), artworkId, quantity);
  }

  // DELETE /api/cart/remove/{artworkId}
  @DeleteMapping("/remove/{artworkId}")
  public ResponseEntity<String> removeFromCart(
      @AuthenticationPrincipal UserDetails userDetails,
      @PathVariable Long artworkId) {
    return cartService.removeFromCart(resolveUserId(userDetails), artworkId);
  }

  // POST /api/cart/checkout
  @PostMapping("/checkout")
  public ResponseEntity<String> checkout(
      @AuthenticationPrincipal UserDetails userDetails) {
    return cartService.checkout(resolveUserId(userDetails));
  }
}
