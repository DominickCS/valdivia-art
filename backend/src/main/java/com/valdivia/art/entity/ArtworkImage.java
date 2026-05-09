package com.valdivia.art.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class ArtworkImage {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String imageURL;

  @Column(nullable = false)
  private Integer displayOrder;

  @JsonIgnore
  private String artworkObjectKey;

  @ManyToOne
  @JsonIgnore
  @JoinColumn(name = "artwork_id")
  private Artwork artwork;
}
