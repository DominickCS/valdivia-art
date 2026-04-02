package com.valdivia.art.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ArtworkUploadResponse(String title, String artworkObjectKey, BigDecimal price, String yearCompleted,
    Boolean isForSale,
    String stripeProductID, String stripePriceID, Integer availableQuantity, LocalDateTime createdAt,
    LocalDateTime updatedAt) {
};
