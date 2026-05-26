package com.valdivia.art.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.stripe.StripeClient;
import com.stripe.param.checkout.SessionCreateParams;
import com.stripe.param.checkout.SessionCreateParams.BillingAddressCollection;
import com.valdivia.art.dto.response.CartResponse;
import com.valdivia.art.dto.response.CartResponse.CartItemResponse;
import com.valdivia.art.entity.Artwork;
import com.valdivia.art.entity.CartItem;
import com.valdivia.art.entity.User;
import com.valdivia.art.repository.ArtworkRepository;
import com.valdivia.art.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CartService {

  private final UserRepository userRepository;
  private final ArtworkRepository artworkRepository;
  private final StripeClient stripeClient;

  @Value("${stripe.success-url}")
  private String successURL;

  // ── Add item ─────────────────────────────────────────────────────────────────

  @Transactional
  public ResponseEntity<String> addToCart(UUID userId, Long artworkId, Integer quantity) {
    try {
      if (quantity == null || quantity < 1) {
        return ResponseEntity.badRequest().body("Quantity must be at least 1.");
      }

      User user = userRepository.findById(userId).orElseThrow(NoSuchElementException::new);
      Artwork artwork = artworkRepository.findById(artworkId).orElseThrow(NoSuchElementException::new);

      if (!artwork.getForSale() || !artwork.getActive()) {
        return ResponseEntity.badRequest().body("This artwork is not available for purchase.");
      }

      List<CartItem> cart = new ArrayList<>(user.getProductCart());

      // If the item is already in the cart, increment quantity rather than
      // duplicating
      boolean found = false;
      for (CartItem item : cart) {
        if (item.getStripeProductId().equals(artwork.getStripeProductID())) {
          int newQty = item.getQuantity() + quantity;
          if (newQty > artwork.getAvailableQuantity()) {
            return ResponseEntity.badRequest()
                .body("There is only " + artwork.getAvailableQuantity() + " left.");
          }
          item.setQuantity(newQty);
          found = true;
          break;
        }
      }

      if (!found) {
        if (quantity > artwork.getAvailableQuantity()) {
          return ResponseEntity.badRequest()
              .body("There is only " + artwork.getAvailableQuantity() + " left.");
        }
        cart.add(new CartItem(artwork.getStripeProductID(), quantity));
      }

      user.setProductCart(cart);
      userRepository.save(user);

      return ResponseEntity.ok("Added to cart.");

    } catch (NoSuchElementException e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User or artwork not found.");
    } catch (Exception e) {
      System.out.println(e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body("Could not add to cart. Contact your administrator.");
    }
  }

  // ── Remove item
  // ───────────────────────────────────────────────────────────────

  @Transactional
  public ResponseEntity<String> removeFromCart(UUID userId, Long artworkId) {
    try {
      User user = userRepository.findById(userId).orElseThrow(NoSuchElementException::new);
      Artwork artwork = artworkRepository.findById(artworkId).orElseThrow(NoSuchElementException::new);

      List<CartItem> updated = user.getProductCart().stream()
          .filter(item -> !item.getStripeProductId().equals(artwork.getStripeProductID()))
          .collect(Collectors.toCollection(ArrayList::new));

      user.setProductCart(updated);
      userRepository.save(user);

      return ResponseEntity.ok("Item removed from cart.");

    } catch (NoSuchElementException e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User or artwork not found.");
    } catch (Exception e) {
      System.out.println(e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body("Could not remove from cart. Contact your administrator.");
    }
  }

  // ── Get cart
  // ──────────────────────────────────────────────────────────────────

  public ResponseEntity<CartResponse> getCart(UUID userId) {
    try {
      User user = userRepository.findById(userId).orElseThrow(NoSuchElementException::new);

      List<CartItemResponse> items = new ArrayList<>();
      BigDecimal estimatedTotal = BigDecimal.ZERO;

      for (CartItem cartItem : user.getProductCart()) {
        Artwork artwork = artworkRepository
            .findByStripeProductID(cartItem.getStripeProductId())
            .orElse(null);

        // Skip stale cart entries for artworks that no longer exist
        if (artwork == null)
          continue;

        BigDecimal lineTotal = artwork.getPrice()
            .multiply(BigDecimal.valueOf(cartItem.getQuantity()));

        items.add(new CartItemResponse(
            artwork.getId(),
            artwork.getTitle(),
            artwork.getImageURL(),
            artwork.getPrice(),
            cartItem.getQuantity(),
            lineTotal,
            artwork.getAvailableQuantity()));

        estimatedTotal = estimatedTotal.add(lineTotal);
      }

      return ResponseEntity.ok(new CartResponse(items, estimatedTotal));

    } catch (NoSuchElementException e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    } catch (Exception e) {
      System.out.println(e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    }
  }

  // ── Checkout
  // ──────────────────────────────────────────────────────────────────

  @Transactional
  public ResponseEntity<String> checkout(UUID userId) {
    try {
      User user = userRepository.findById(userId).orElseThrow(NoSuchElementException::new);

      if (user.getProductCart().isEmpty()) {
        return ResponseEntity.badRequest().body("Your cart is empty.");
      }

      SessionCreateParams.Builder sessionBuilder = SessionCreateParams.builder()
          .setSuccessUrl(successURL)
          .setBillingAddressCollection(BillingAddressCollection.REQUIRED)
          .setShippingAddressCollection(
              SessionCreateParams.ShippingAddressCollection.builder()
                  .addAllowedCountry(SessionCreateParams.ShippingAddressCollection.AllowedCountry.US)
                  .build())
          .setCustomer(user.getStripeCustomerID())
          .setMode(SessionCreateParams.Mode.PAYMENT);

      // Build one line item per cart entry and collect artworkId:quantity pairs
      // for the webhook metadata so it can create Order rows on payment success.
      List<String> metadataPairs = new ArrayList<>();

      for (CartItem cartItem : user.getProductCart()) {
        Artwork artwork = artworkRepository
            .findByStripeProductID(cartItem.getStripeProductId())
            .orElseThrow(() -> new NoSuchElementException(
                "Artwork not found for product: " + cartItem.getStripeProductId()));

        // Re-validate availability at checkout time
        if (!artwork.getForSale() || !artwork.getActive()) {
          return ResponseEntity.badRequest()
              .body("\"" + artwork.getTitle() + "\" is no longer available.");
        }
        if (cartItem.getQuantity() > artwork.getAvailableQuantity()) {
          return ResponseEntity.badRequest()
              .body("Only " + artwork.getAvailableQuantity()
                  + " of \"" + artwork.getTitle() + "\" are available.");
        }

        sessionBuilder.addLineItem(
            SessionCreateParams.LineItem.builder()
                .setPrice(artwork.getStripePriceID())
                .setQuantity(cartItem.getQuantity().longValue())
                .build());

        // "artworkId:quantity" — parsed by the webhook to create Order rows
        metadataPairs.add(artwork.getId() + ":" + cartItem.getQuantity());
      }

      // Stripe metadata values are limited to 500 chars; fine for reasonable cart
      // sizes
      sessionBuilder
          .putMetadata("userId", userId.toString())
          .putMetadata("cartItems", String.join(",", metadataPairs));

      com.stripe.model.checkout.Session session = stripeClient.checkout().sessions()
          .create(sessionBuilder.build());

      return ResponseEntity.ok(session.toJson());

    } catch (NoSuchElementException e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    } catch (Exception e) {
      System.out.println(e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body("Checkout failed. Contact your administrator.");
    }
  }

  // ── Clear cart (called by webhook after successful payment)
  // ───────────────────

  @Transactional
  public void clearCart(UUID userId) {
    userRepository.findById(userId).ifPresent(user -> {
      user.setProductCart(new ArrayList<>());
      userRepository.save(user);
    });
  }
}
