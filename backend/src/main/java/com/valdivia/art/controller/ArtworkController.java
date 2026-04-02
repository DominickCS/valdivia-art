package com.valdivia.art.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.stripe.exception.StripeException;
import com.valdivia.art.dto.request.ArtworkUploadRequest;
import com.valdivia.art.dto.request.PurchaseRequest;
import com.valdivia.art.entity.Artwork;
import com.valdivia.art.service.ArtworkService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/artwork")
@RequiredArgsConstructor
public class ArtworkController {
  private final ArtworkService artworkService;

  @PostMapping("/admin/upload")
  public ResponseEntity<String> uploadArtwork(@RequestParam MultipartFile artworkImage,
      @RequestPart ArtworkUploadRequest request) {
    return artworkService.uploadArtwork(artworkImage, request);
  }

  @PostMapping("/admin/archive/{id}")
  public ResponseEntity<String> archiveArtwork(@PathVariable(name = "id") Long artworkID) throws StripeException {
    return artworkService.archiveArtwork(artworkID);
  }

  @PostMapping("/admin/unarchive/{id}")
  public ResponseEntity<String> unarchiveArtwork(@PathVariable(name = "id") Long artworkID) throws StripeException {
    return artworkService.unarchiveArtwork(artworkID);
  }

  @GetMapping()
  public List<Artwork> getAllArtwork() {
    return artworkService.getAllArtwork();
  }

  @GetMapping("/active")
  public List<Artwork> getActiveArtwork() {
    return artworkService.getActiveArtwork();
  }

  @PostMapping("/purchase/{id}")
  public ResponseEntity<String> purchaseArtwork(@PathVariable(name = "id") Long artworkID,
      @Valid @RequestBody PurchaseRequest request)
      throws StripeException {
    return artworkService.createCheckoutSession(artworkID, request);
  }

}
