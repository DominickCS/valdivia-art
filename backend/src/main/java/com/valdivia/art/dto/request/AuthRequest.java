package com.valdivia.art.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AuthRequest(@NotBlank(message = "You must enter your full name.") String fullName,
    @NotBlank(message = "You must enter your email") @Email(message = "Invalid email address") String email,
    @NotBlank(message = "A password is required") @Size(min = 8, message = "Password must be at  least 8 characters.") String password) {
};
