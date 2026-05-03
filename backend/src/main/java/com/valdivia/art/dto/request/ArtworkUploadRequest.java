package com.valdivia.art.dto.request;

import java.math.BigDecimal;

public record ArtworkUploadRequest(String title, Double heightInches, Double widthInches, BigDecimal price,
    String yearCompleted, Boolean forSale,
    Integer availableQuantity) {
};
