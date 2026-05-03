package com.valdivia.art.controller;

import java.time.Instant;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stripe.exception.EventDataObjectDeserializationException;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Address;
import com.stripe.model.Event;
import com.stripe.model.StripeObject;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.valdivia.art.entity.Artwork;
import com.valdivia.art.entity.Order;
import com.valdivia.art.entity.User;
import com.valdivia.art.entity.enums.OrderStatus;
import com.valdivia.art.repository.ArtworkRepository;
import com.valdivia.art.repository.OrderRepository;
import com.valdivia.art.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/webhook")
@RequiredArgsConstructor
public class WebhookController {
  private final ArtworkRepository artworkRepository;
  private final UserRepository userRepository;
  private final OrderRepository orderRepository;

  @Value("${stripe.webhook.secret}")
  private String webhookSecret;

  @PostMapping
  public ResponseEntity<String> handleWebhook(@RequestBody String payload,
      @RequestHeader("Stripe-Signature") String sigHeader)
      throws SignatureVerificationException, EventDataObjectDeserializationException {

    Event event = Webhook.constructEvent(payload, sigHeader, webhookSecret);

    if ("checkout.session.completed".equals(event.getType())) {
      StripeObject stripeObject = event.getDataObjectDeserializer()
          .deserializeUnsafe(); // <-- instead of getObject().orElseThrow()

      Session session = (Session) stripeObject;

      String userId = session.getMetadata().get("userId");
      String artworkId = session.getMetadata().get("artworkId");

      Session.CollectedInformation collected = session.getCollectedInformation();
      if (collected != null && collected.getShippingDetails() != null) {
        Session.CollectedInformation.ShippingDetails shipping = collected.getShippingDetails();
        Address address = shipping.getAddress();

        User user = userRepository.findById(UUID.fromString(userId)).orElseThrow();
        Artwork artwork = artworkRepository.findById(Long.parseLong(artworkId)).orElseThrow();
        artwork.setAvailableQuantity(artwork.getAvailableQuantity() - 1);
        artworkRepository.save(artwork);

        Order order = new Order();

        order.setStripeSessionId(session.getId());
        order.setStripePaymentIntentId(session.getPaymentIntent());
        order.setUser(user);
        order.setArtwork(artwork);
        order.setAmountTotal(session.getAmountTotal());
        order.setCurrency(session.getCurrency());
        // Set Order Shipping Details
        order.setStatus(OrderStatus.PENDING);
        order.setShippingName(shipping.getName());
        order.setShippingLine1(address.getLine1());
        order.setShippingLine2(address.getLine2());
        order.setShippingCity(address.getCity());
        order.setShippingState(address.getState());
        order.setShippingPostalCode(address.getPostalCode());
        order.setShippingCountry(address.getCountry());

        order.setCreatedAt(Instant.now());
        order.setUpdatedAt(Instant.now());

        orderRepository.save(order);

      }

    }
    return ResponseEntity.ok("POST-PURCHASE WEBHOOK EXECUTED SUCCESSFULLY!");
  }
}
