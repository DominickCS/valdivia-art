package com.valdivia.art.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "artwork")
public class Artwork {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String artworkObjectKey;

  @OneToMany(mappedBy = "artwork", cascade = CascadeType.ALL)
  private List<ArtworkImage> images = new ArrayList<>();

  private String imageURL;

  @Column(nullable = false)
  private String title;

  @Column(nullable = false)
  private BigDecimal price;

  @Column(nullable = false)
  private String yearCompleted;

  @Column(nullable = false)
  private Boolean forSale;

  @Column(nullable = false)
  private Boolean active;

  @Column(nullable = false)
  private String stripeProductID;

  @Column(nullable = false)
  private String stripePriceID;

  @Column(nullable = false)
  private Double heightInches;

  @Column(nullable = false)
  private Double widthInches;

  @Column(nullable = false)
  private Integer availableQuantity;

  @CreationTimestamp
  private LocalDateTime createdAt;

  @UpdateTimestamp
  private LocalDateTime updatedAt;
}
