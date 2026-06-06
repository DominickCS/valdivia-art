package com.valdivia.art.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.valdivia.art.entity.Artwork;

public interface ArtworkRepository extends JpaRepository<Artwork, Long> {

  List<Artwork> findAllByOrderByYearCompletedDesc();

  List<Artwork> findAllByActive(boolean active);

  List<Artwork> findAllByActiveTrueAndAvailableQuantityGreaterThan(int quantity);

  List<Artwork> findAllByYearCompletedAndForSaleFalse(String yearCompleted);

  // Used by CartService to resolve cart items → Artwork entities
  Optional<Artwork> findByStripeProductID(String stripeProductID);
}
