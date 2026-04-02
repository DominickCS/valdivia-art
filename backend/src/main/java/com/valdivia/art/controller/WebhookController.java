package com.valdivia.art.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.valdivia.art.entity.Artwork;
import com.valdivia.art.repository.ArtworkRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class WebhookController {
  private final ArtworkRepository artworkRepository;

  @Value("{stripe.webhook.secret}")
  private String webhookSecret;

  @PostMapping("/webhook")
  public ResponseEntity<String> handleWebhook(@RequestBody String payload,
      @RequestHeader("Stripe-Signature") String sigHeader) throws SignatureVerificationException {

    Event event = Webhook.constructEvent(payload, sigHeader, webhookSecret);

    if ("checkout.session.completed".equals(event.getType())) {
      Session session = (Session) event.getDataObjectDeserializer()
          .getObject().orElseThrow();

      Long artworkId = Long.parseLong(session.getMetadata().get("artworkID"));
      Artwork artwork = artworkRepository.findById(artworkId).orElseThrow();
      artwork.setAvailableQuantity(artwork.getAvailableQuantity() - 1);
      artworkRepository.save(artwork);
    }

    return ResponseEntity.ok("");
  }
}
