package com.valdivia.art.dto;

import java.util.List;

import com.stripe.model.PaymentIntentAmountDetailsLineItem;

public record OrderLineItemDTO(
    PaymentIntentAmountDetailsLineItem lineItem,
    List<String> productImages) {
}
