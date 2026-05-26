package com.valdivia.art.dto.response;

import java.math.BigDecimal;
import java.util.List;

// Full cart response — each item includes artwork detail + requested quantity
public record CartResponse(List<CartItemResponse> items, BigDecimal estimatedTotal) {

  public record CartItemResponse(
      Long artworkId,
      String title,
      String imageUrl,
      BigDecimal unitPrice,
      Integer quantity,
      BigDecimal lineTotal,
      // Lets the frontend warn the user if they've requested more than what's
      // available
      Integer availableQuantity) {
  }
}
