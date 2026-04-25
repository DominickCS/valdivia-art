package com.valdivia.art.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.valdivia.art.entity.Artwork;
import java.util.List;
import java.util.Optional;

public interface ArtworkRepository extends JpaRepository<Artwork, Long> {
  List<Artwork> findAllByActive(Boolean active);

  List<Artwork> findAllByActiveTrueAndAvailableQuantityGreaterThan(Integer availableQuantity);

  List<Artwork> findAllByOrderByYearCompletedDesc();

  Optional<Artwork> findByTitle(String artworkTitle);

}
