package com.valdivia.art.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.stripe.exception.StripeException;
import com.valdivia.art.dto.request.ArtworkUploadRequest;
import com.valdivia.art.dto.request.ShipmentUpdateRequest;
import com.valdivia.art.dto.response.OrderResponse;
import com.valdivia.art.repository.OrderRepository;
import com.valdivia.art.service.ArtworkService;
import com.valdivia.art.service.OrderService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
  private final ArtworkService artworkService;
  private final OrderService orderService;
  private final OrderRepository orderRepository;

  @PatchMapping("/orders/{id}/ship")
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  public ResponseEntity<String> markShipped(
      @PathVariable Long id,
      @RequestBody ShipmentUpdateRequest request) {
    return orderService.markShipped(id, request);
  }

  @PostMapping("/upload")
  public ResponseEntity<String> uploadArtwork(
      @RequestPart("images") List<MultipartFile> artworkImages,
      @RequestPart("request") ArtworkUploadRequest request) {
    return artworkService.uploadArtwork(artworkImages, request);
  }

  @PostMapping("/archive/{id}")
  public ResponseEntity<String> archiveArtwork(@PathVariable(name = "id") Long artworkID) throws StripeException {
    return artworkService.archiveArtwork(artworkID);
  }

  @PostMapping("/unarchive/{id}")
  public ResponseEntity<String> unarchiveArtwork(@PathVariable(name = "id") Long artworkID) throws StripeException {
    return artworkService.unarchiveArtwork(artworkID);
  }

  @GetMapping("/orders/all")
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  public ResponseEntity<List<OrderResponse>> getAllOrders() {
    return ResponseEntity.ok(
        orderRepository.findAllByOrderByCreatedAtDesc()
            .stream().map(OrderResponse::from).toList());
  }

}
