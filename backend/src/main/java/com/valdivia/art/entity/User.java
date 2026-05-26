package com.valdivia.art.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;

import com.valdivia.art.entity.enums.UserRoles;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "users")
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(nullable = false)
  private String fullName;

  @Column(nullable = false)
  private String email;

  @Column(nullable = false)
  private String password;

  private UserRoles userRole = UserRoles.CUSTOMER;

  private String stripeCustomerID;

  // Each row in user_cart holds stripe_product_id + quantity for one line item
  @ElementCollection(fetch = FetchType.EAGER)
  @CollectionTable(name = "user_cart", joinColumns = @JoinColumn(name = "user_id"))
  private List<CartItem> productCart = new ArrayList<>();

  @CreationTimestamp
  private LocalDateTime creationDate;
}
