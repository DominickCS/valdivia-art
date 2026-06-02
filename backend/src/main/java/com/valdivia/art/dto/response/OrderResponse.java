package com.valdivia.art.dto.response;

import java.time.Instant;
import java.util.List;

import com.valdivia.art.entity.Order;
import com.valdivia.art.entity.enums.OrderStatus;

public record OrderResponse(
    Long id,
    String stripeSessionId,
    // Each artwork in the order as a lean summary
    List<ArtworkSummary> artworks,
    Long amountTotal,
    String currency,
    OrderStatus status,
    String trackingNumber,
    String trackingURL,
    // Shipping address
    String shippingName,
    String shippingLine1,
    String shippingLine2,
    String shippingCity,
    String shippingState,
    String shippingPostalCode,
    String shippingCountry,
    Instant createdAt,
    Instant updatedAt) {

  // Lean per-artwork summary nested inside the order response
  public record ArtworkSummary(Long id, String title, String imageURL) {
  }

  public static OrderResponse from(Order order) {
    List<ArtworkSummary> artworkSummaries = order.getArtworks().stream()
        .map(a -> new ArtworkSummary(a.getId(), a.getTitle(), a.getImageURL()))
        .toList();

    return new OrderResponse(
        order.getId(),
        order.getStripeSessionId(),
        artworkSummaries,
        order.getAmountTotal(),
        order.getCurrency(),
        order.getStatus(),
        order.getTrackingNumber(),
        order.getTrackingURL(),
        order.getShippingName(),
        order.getShippingLine1(),
        order.getShippingLine2(),
        order.getShippingCity(),
        order.getShippingState(),
        order.getShippingPostalCode(),
        order.getShippingCountry(),
        order.getCreatedAt(),
        order.getUpdatedAt());
  }
}
