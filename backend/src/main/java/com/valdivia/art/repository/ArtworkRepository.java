package com.valdivia.art.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.valdivia.art.entity.Artwork;

public interface ArtworkRepository extends JpaRepository<Artwork, Long> {

}
