package com.valdivia.art.dto.request;

import com.valdivia.art.entity.enums.Carrier;

public record ShipmentUpdateRequest(
    String trackingNumber,
    Carrier carrier) {
}
