package com.valdivia.art.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.valdivia.art.dto.request.ArtworkUploadRequest;
import com.valdivia.art.entity.Artwork;
import com.valdivia.art.service.ArtworkService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/artwork")
@RequiredArgsConstructor
public class ArtworkController {
  private final ArtworkService artworkService;

  @PostMapping("/admin/upload")
  public ResponseEntity<String> uploadBeat(@RequestParam MultipartFile artworkImage,
      @RequestPart ArtworkUploadRequest request) {
    return artworkService.uploadArtwork(artworkImage, request);
  }

  @GetMapping()
  public List<Artwork> getAllArtwork() {
    return artworkService.getAllArtwork();
  }
}
