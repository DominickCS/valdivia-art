package com.valdivia.art.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stripe.exception.StripeException;
import com.valdivia.art.dto.request.PurchaseRequest;
import com.valdivia.art.dto.response.OrderResponse;
import com.valdivia.art.entity.Artwork;
import com.valdivia.art.entity.User;
import com.valdivia.art.repository.UserRepository;
import com.valdivia.art.service.ArtworkService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/artwork")
@RequiredArgsConstructor
public class ArtworkController {
  private final ArtworkService artworkService;
  private final UserRepository userRepository;

  @GetMapping
  public List<Artwork> getAllArtwork() {
    return artworkService.getAllArtwork();
  }

  @GetMapping("/active")
  public List<Artwork> getActiveArtwork() {
    return artworkService.getActiveArtwork();
  }

  @GetMapping("/sellable")
  public List<Artwork> getSellableArtwork() {
    return artworkService.getSellableArtwork();
  }

  @GetMapping("/orders")
  public ResponseEntity<List<OrderResponse>> getOrders(
      @AuthenticationPrincipal UserDetails userDetails) {
    User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
    return artworkService.getCustomerOrders(user);
  }

  @PostMapping("/purchase/{id}")
  public ResponseEntity<String> purchaseArtwork(@PathVariable(name = "id") Long artworkID,
      @Valid @RequestBody PurchaseRequest request)
      throws StripeException {
    return artworkService.createCheckoutSession(artworkID, request);
  }

  @GetMapping("/listing/{id}")
  public Artwork getArtworkDetails(@PathVariable(name = "id") Long artworkID) {
    return artworkService.getArtworkDetails(artworkID);
  }

}
