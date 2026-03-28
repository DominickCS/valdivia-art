package com.valdivia.art.service;

import java.time.Duration;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.valdivia.art.dto.request.ArtworkUploadRequest;
import com.valdivia.art.entity.Artwork;
import com.valdivia.art.repository.ArtworkRepository;

import lombok.RequiredArgsConstructor;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;

@Service
@RequiredArgsConstructor
public class ArtworkService {
  private final S3Client s3Client;
  private final S3Presigner s3Presigner;
  private final ArtworkRepository artworkRepository;

  @Value("${garage.bucket}")
  private String bucket;

  public ResponseEntity<String> uploadArtwork(MultipartFile artworkImage, ArtworkUploadRequest request) {
    try {
      String artworkObjectID = request.title().replaceAll(" ", "-") + "-" + UUID.randomUUID().toString();
      s3Client.putObject(
          PutObjectRequest.builder().bucket(bucket).key(artworkObjectID).contentType("image/jpeg").build(),
          RequestBody.fromBytes(artworkImage.getBytes()));

      Artwork artwork = new Artwork();
      artwork.setTitle(request.title());
      artwork.setArtworkObjectKey(artworkObjectID);
      artwork.setPrice(request.price());
      artwork.setIsForSale(request.isForSale());
      artwork.setIsActive(request.isActive());
      artwork.setStripePriceID("TESTID");
      artwork.setStripeProductID("TESTID");
      // artwork.setStripeProductID(stripeProductID); //TODO
      // artwork.setStripePriceID(stripePriceID); //TODO
      artworkRepository.save(artwork);

      return ResponseEntity.ok("Your artwork has uploaded successfully!");
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body("There was a problem uploading your artwork. Contact your administrator for assistance.");
    }
  }

  public String generatePresignedURL(String key) {
    GetObjectRequest getObjectRequest = GetObjectRequest.builder()
        .bucket(bucket)
        .key(key)
        .build();
    GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
        .signatureDuration(Duration.ofMinutes(10))
        .getObjectRequest(getObjectRequest)
        .build();

    return s3Presigner.presignGetObject(presignRequest).url().toString();
  }

  public List<Artwork> getAllArtwork() {
    return artworkRepository.findAll();
  }
}
