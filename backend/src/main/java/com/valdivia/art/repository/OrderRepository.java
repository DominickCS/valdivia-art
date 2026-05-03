package com.valdivia.art.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.valdivia.art.entity.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {

  List<Order> findByUserIdOrderByCreatedAtDesc(UUID userId);

  Optional<Order> findByStripeSessionId(String sessionId);
}
