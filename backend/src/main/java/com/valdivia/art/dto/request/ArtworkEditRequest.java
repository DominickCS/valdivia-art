package com.valdivia.art.dto.request;

import java.math.BigDecimal;
import java.util.List;

public record ArtworkEditRequest(
    String title,
    Double heightInches,
    Double widthInches,
    Double lengthInches,
    Double weight,
    BigDecimal price,
    String yearCompleted,
    Boolean forSale,
    Integer availableQuantity,
    List<Long> removeImageIds,
    List<Long> imageOrder) {
}
