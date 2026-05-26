package com.valdivia.art.entity;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import com.valdivia.art.entity.enums.Carrier;
import com.valdivia.art.entity.enums.OrderStatus;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "orders")
@NoArgsConstructor
@Getter
@Setter
public class Order {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String stripeSessionId;
  private String stripePaymentIntentId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  // One order (one Stripe session) can contain multiple artworks
  @ManyToMany(fetch = FetchType.LAZY)
  @JoinTable(name = "order_artworks", joinColumns = @JoinColumn(name = "order_id"), inverseJoinColumns = @JoinColumn(name = "artwork_id"))
  private List<Artwork> artworks = new ArrayList<>();

  private Long amountTotal; // in cents, mirrors Stripe
  private String currency;

  @Enumerated(EnumType.STRING)
  private OrderStatus status;

  private String trackingNumber;
  private String trackingURL;

  @Enumerated(EnumType.STRING)
  private Carrier carrier;

  // Shipping information captured from Stripe session
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
