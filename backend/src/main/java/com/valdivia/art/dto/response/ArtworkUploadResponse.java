package com.valdivia.art.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ArtworkUploadResponse(String title, String artworkObjectKey, BigDecimal price, Boolean isForSale,
    String stripeProductID, String stripePriceID, LocalDateTime createdAt, LocalDateTime updatedAt) {
};
