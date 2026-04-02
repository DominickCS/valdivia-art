package com.valdivia.art.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.stripe.StripeClient;
import com.stripe.exception.StripeException;
import com.stripe.model.Price;
import com.stripe.model.Product;
import com.stripe.model.checkout.Session;
import com.stripe.param.PriceCreateParams;
import com.stripe.param.ProductCreateParams;
import com.stripe.param.ProductUpdateParams;
import com.stripe.param.checkout.SessionCreateParams;
import com.stripe.param.checkout.SessionCreateParams.BillingAddressCollection;
import com.valdivia.art.dto.request.ArtworkUploadRequest;
import com.valdivia.art.dto.request.PurchaseRequest;
import com.valdivia.art.entity.Artwork;
import com.valdivia.art.entity.User;
import com.valdivia.art.repository.ArtworkRepository;
import com.valdivia.art.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Service
@RequiredArgsConstructor
public class ArtworkService {
  private final S3Client s3Client;
  private final ArtworkRepository artworkRepository;
  private final StripeClient stripeClient;
  private final UserRepository userRepository;

  @Value("${stripe.success-url}")
  private String successURL;

  @Value("${garage.bucket}")
  private String bucket;

  @Value("${garage.public-url}")
  private String publicURLBase;

  public ResponseEntity<String> uploadArtwork(MultipartFile artworkImage, ArtworkUploadRequest request) {
    try {
      String artworkObjectID = request.title().replaceAll(" ", "-") + "-" + UUID.randomUUID().toString();
      s3Client.putObject(
          PutObjectRequest.builder().bucket(bucket).key(artworkObjectID).contentType("image/jpeg").build(),
          RequestBody.fromBytes(artworkImage.getBytes()));

      ProductCreateParams productParams = ProductCreateParams.builder()
          .addImage(publicURLBase + artworkObjectID)
          .setName(request.title())
          .setActive(true)
          .build();
      Product product = stripeClient.products().create(productParams);

      PriceCreateParams priceParams = PriceCreateParams.builder().setProduct(product.getId()).setCurrency("usd")
          .setUnitAmount(request.price().multiply(BigDecimal.valueOf(100)).longValue()).build();

      Price price = stripeClient.prices().create(priceParams);

      Artwork artwork = new Artwork();
      artwork.setTitle(request.title());
      artwork.setArtworkObjectKey(artworkObjectID);
      artwork.setImageURL(publicURLBase + artworkObjectID);
      artwork.setPrice(request.price());
      artwork.setYearCompleted(request.yearCompleted());
      artwork.setForSale(request.forSale());
      artwork.setActive(true);
      artwork.setAvailableQuantity(request.availableQuantity());
      artwork.setStripeProductID(product.getId());
      artwork.setStripePriceID(price.getId());

      artworkRepository.save(artwork);

      return ResponseEntity.ok("Your artwork has uploaded successfully!");
    } catch (Exception e) {
      System.out.println(e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body("There was a problem uploading your artwork. Contact your administrator for assistance.");
    }
  }

  public ResponseEntity<String> archiveArtwork(Long artworkID) throws StripeException {
    try {
      Artwork artwork = artworkRepository.findById(artworkID).orElseThrow(NoSuchElementException::new);

      stripeClient.products().update(artwork.getStripeProductID(),
          ProductUpdateParams.builder().setActive(false).build());

      artwork.setActive(false);
      artwork.setForSale(false);

      artworkRepository.save(artwork);

      return ResponseEntity.ok("Artwork was archived successfully!");

    } catch (NoSuchElementException e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body("Artwork with the specified ID doesn't exist.");
    } catch (StripeException e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body("The Stripe API has ran into an error. Contact your administrator. " +
              e.getMessage());
    }
  }

  public ResponseEntity<String> unarchiveArtwork(Long artworkID) throws StripeException {
    try {
      Artwork artwork = artworkRepository.findById(artworkID).orElseThrow(NoSuchElementException::new);

      stripeClient.products().update(artwork.getStripeProductID(),
          ProductUpdateParams.builder().setActive(true).build());

      artwork.setActive(true);
      artwork.setForSale(true);

      artworkRepository.save(artwork);

      return ResponseEntity.ok("Artwork was unarchived successfully!");

    } catch (NoSuchElementException e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body("Artwork with the specified ID doesn't exist.");
    } catch (StripeException e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body("The Stripe API has ran into an error. Contact your administrator. " +
              e.getMessage());
    }
  }

  public ResponseEntity<String> createCheckoutSession(Long artworkID, PurchaseRequest request) throws StripeException {
    try {
      User user = userRepository.findById(request.userID()).orElseThrow(NoSuchElementException::new);
      Artwork artwork = artworkRepository.findById(artworkID).orElseThrow(NoSuchElementException::new);

      SessionCreateParams params = SessionCreateParams.builder().setSuccessUrl(successURL)
          .addLineItem(
              SessionCreateParams.LineItem.builder().setPrice(artwork.getStripePriceID()).setQuantity(1L).build())
          .putMetadata("artworkID", String.valueOf(artworkID))
          .setBillingAddressCollection(BillingAddressCollection.REQUIRED)
          .setShippingAddressCollection(
              SessionCreateParams.ShippingAddressCollection.builder()
                  .addAllowedCountry(SessionCreateParams.ShippingAddressCollection.AllowedCountry.US).build())
          .setCustomer(user.getStripeCustomerID())
          .setMode(SessionCreateParams.Mode.PAYMENT).build();

      Session session = stripeClient.checkout().sessions().create(params);

      return ResponseEntity.ok(session.toJson());

    } catch (NoSuchElementException e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body("Artwork with the specified ID doesn't exist.");
    } catch (StripeException e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body("The Stripe API has ran into an error. Contact your administrator. " +
              e.getMessage());
    }

  }

  public List<Artwork> getAllArtwork() {
    return artworkRepository.findAllByOrderByYearCompletedDesc();
  }

  public List<Artwork> getActiveArtwork() {
    return artworkRepository.findAllByActive(true);
  }

  public List<Artwork> getSellableArtwork() {
    return artworkRepository.findAllByActiveTrueAndAvailableQuantityGreaterThan(0);

  }

}
