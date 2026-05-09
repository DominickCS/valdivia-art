package com.valdivia.art.dto.request;

public record ContactRequest(
    String name,
    String email,
    String subject,
    String message) {
}
