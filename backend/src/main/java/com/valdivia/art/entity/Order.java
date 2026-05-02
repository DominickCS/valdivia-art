package com.valdivia.art.entity;

import java.time.Instant;

import com.valdivia.art.entity.enums.OrderStatus;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "orders")
public class Order {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String stripeSessionId;
  private String stripePaymentIntentId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "artwork_id", nullable = false)
  private Artwork artwork;

  private Long amountTotal; // <- In cents to mirror Stripe
  private String currency;

  @Enumerated(EnumType.STRING)
  private OrderStatus status;

  private String trackingNumber;
  private String trackingURL;

  // SHIPPING INFORMATION CAPTURED FROM STRIPE SESSION

  private String shippingName;
  private String shippingLine1;
  private String shippingLine2;
  private String shippingCity;
  private String shippingState;
  private String shippingPostalCode;
  private String shippingCountry;

  private Instant createdAt;
  private Instant updatedAt;

}
