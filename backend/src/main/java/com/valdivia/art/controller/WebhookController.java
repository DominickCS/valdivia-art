package com.valdivia.art.controller;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
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
import com.valdivia.art.service.CartService;
import com.valdivia.art.service.EmailService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/webhook")
@RequiredArgsConstructor
public class WebhookController {

  private final ArtworkRepository artworkRepository;
  private final UserRepository userRepository;
  private final OrderRepository orderRepository;
  private final EmailService emailService;
  private final CartService cartService;

  @Value("${stripe.webhook.secret}")
  private String webhookSecret;

  @PostMapping
  public ResponseEntity<String> handleWebhook(
      @RequestBody String payload,
      @RequestHeader("Stripe-Signature") String sigHeader)
      throws SignatureVerificationException, EventDataObjectDeserializationException {

    Event event = Webhook.constructEvent(payload, sigHeader, webhookSecret);

    if ("checkout.session.completed".equals(event.getType())) {
      StripeObject stripeObject = event.getDataObjectDeserializer().deserializeUnsafe();
      Session session = (Session) stripeObject;

      String userId = session.getMetadata().get("userId");

      // ── Determine session type ───────────────────────────────────────────────
      // Legacy single-artwork sessions carry "artworkId".
      // Cart sessions carry "cartItems" as "artworkId:quantity,artworkId:quantity".
      String legacyArtworkId = session.getMetadata().get("artworkId");
      String cartItems = session.getMetadata().get("cartItems");

      Session.CollectedInformation collected = session.getCollectedInformation();
      if (collected == null || collected.getShippingDetails() == null) {
        return ResponseEntity.ok("Webhook received — no shipping details, skipping order creation.");
      }

      Session.CollectedInformation.ShippingDetails shipping = collected.getShippingDetails();
      Address address = shipping.getAddress();
      User user = userRepository.findById(UUID.fromString(userId)).orElseThrow();

      if (legacyArtworkId != null) {
        // ── Legacy single-item path (existing /api/artwork/purchase/{id} flow) ──
        Artwork artwork = artworkRepository.findById(Long.parseLong(legacyArtworkId)).orElseThrow();
        artwork.setAvailableQuantity(artwork.getAvailableQuantity() - 1);
        artworkRepository.save(artwork);

        Order order = buildOrder(session, shipping, address, user, List.of(artwork));
        orderRepository.save(order);
        emailService.sendOrderInvoice(user.getEmail(), order);

      } else if (cartItems != null && !cartItems.isBlank()) {
        // ── Cart multi-item path ─────────────────────────────────────────────────
        // cartItems format: "artworkId:quantity,artworkId:quantity,..."
        List<Artwork> orderedArtworks = new ArrayList<>();

        for (String pair : cartItems.split(",")) {
          String[] parts = pair.trim().split(":");
          Long artworkId = Long.parseLong(parts[0]);
          int quantity = Integer.parseInt(parts[1]);

          Artwork artwork = artworkRepository.findById(artworkId).orElseThrow();
          artwork.setAvailableQuantity(artwork.getAvailableQuantity() - quantity);
          artworkRepository.save(artwork);
          orderedArtworks.add(artwork);
        }

        Order order = buildOrder(session, shipping, address, user, orderedArtworks);
        orderRepository.save(order);

        // Clear the user's cart now that payment succeeded
        cartService.clearCart(user.getId());

        emailService.sendOrderInvoice(user.getEmail(), order);
      }
    }

    return ResponseEntity.ok("WEBHOOK EXECUTED SUCCESSFULLY.");
  }

  // ── Shared order builder ────────────────────────────────────────────────────

  private Order buildOrder(
      Session session,
      Session.CollectedInformation.ShippingDetails shipping,
      Address address,
      User user,
      List<Artwork> artworks) {

    Order order = new Order();
    order.setStripeSessionId(session.getId());
    order.setStripePaymentIntentId(session.getPaymentIntent());
    order.setUser(user);
    order.setArtworks(artworks);
    order.setAmountTotal(session.getAmountTotal());
    order.setCurrency(session.getCurrency());
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
    return order;
  }
}
