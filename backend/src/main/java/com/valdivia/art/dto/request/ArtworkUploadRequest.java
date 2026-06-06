package com.valdivia.art.dto.request;

import java.math.BigDecimal;

public record ArtworkUploadRequest(String title, Double heightInches, Double widthInches, Double depthInches,
    String description, String medium,
    Double weight, BigDecimal price,
    String yearCompleted, Boolean forSale,
    Integer availableQuantity, Integer primaryImageIndex) {
};
