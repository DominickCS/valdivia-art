package com.valdivia.art.dto.request;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;

public record PurchaseRequest(@NotNull UUID userID) {
};
