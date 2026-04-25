package com.valdivia.art.dto;

import com.stripe.model.PaymentIntentAmountDetailsLineItem;
import com.valdivia.art.entity.Artwork;

public record OrderLineItemDTO(
    PaymentIntentAmountDetailsLineItem lineItem,
    Artwork artwork) {
}
