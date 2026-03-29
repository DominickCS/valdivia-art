package com.valdivia.art.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.stripe.StripeClient;

@Configuration
public class StripeClientConfig {

  @Value("${STRIPE_API_KEY}")
  private String apiKey;

  @Bean
  public StripeClient getStripeClient() {

    return StripeClient.builder()
        .setApiKey(apiKey)
        .build();
  }
}
