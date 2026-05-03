package com.valdivia.art.dto.response;

import java.time.Instant;

import com.valdivia.art.entity.Order;
import com.valdivia.art.entity.enums.OrderStatus;

public record OrderResponse(
    Long id,
    String stripeSessionId,

    // Artwork summary — avoid nesting a full ArtworkResponse to keep it lean
    Long artworkId,
    String artworkTitle,
    String artworkImageUrl,

    Long amountTotal,
    String currency,

    OrderStatus status,
    String trackingNumber,
    String trackingUrl,

    // Shipping address
    String shippingName,
    String shippingLine1,
    String shippingLine2,
    String shippingCity,
    String shippingState,
    String shippingPostalCode,
    String shippingCountry,

    Instant createdAt) {
  public static OrderResponse from(Order order) {
    return new OrderResponse(
        order.getId(),
        order.getStripeSessionId(),
        order.getArtwork().getId(),
        order.getArtwork().getTitle(),
        order.getArtwork().getImageURL(),
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
        order.getCreatedAt());
  }
}
