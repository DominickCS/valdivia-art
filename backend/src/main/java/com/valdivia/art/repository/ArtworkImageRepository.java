package com.valdivia.art.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.valdivia.art.entity.ArtworkImage;

public interface ArtworkImageRepository extends JpaRepository<ArtworkImage, Long> {
}
