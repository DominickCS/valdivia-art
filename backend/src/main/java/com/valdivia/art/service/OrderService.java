package com.valdivia.art.service;

import java.time.Instant;
import java.util.NoSuchElementException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.valdivia.art.dto.request.ShipmentUpdateRequest;
import com.valdivia.art.entity.Order;
import com.valdivia.art.entity.enums.OrderStatus;
import com.valdivia.art.repository.OrderRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService {
  private final OrderRepository orderRepository;
  private final EmailService emailService;

  public ResponseEntity<String> markShipped(Long orderId, ShipmentUpdateRequest request) {
    try {
      Order order = orderRepository.findById(orderId).orElseThrow(NoSuchElementException::new);
      order.setTrackingNumber(request.trackingNumber());
      order.setTrackingURL(request.carrier().buildTrackingURL(request.trackingNumber()));
      order.setStatus(OrderStatus.SHIPPED);
      order.setUpdatedAt(Instant.now());
      order.setCarrier(request.carrier());
      orderRepository.save(order);
      emailService.sendShippingNotification(order);
      return ResponseEntity.ok("Order #" + orderId + " marked as shipped.");
    } catch (NoSuchElementException e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found.");
    }
  }
}
