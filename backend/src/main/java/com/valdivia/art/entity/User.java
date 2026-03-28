package com.valdivia.art.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.valdivia.art.entity.enums.UserRoles;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;

  @Column(nullable = false)
  private String fullName;

  @Column(nullable = false)
  private String email;

  @Column(nullable = false)
  private String password;

  private UserRoles userRole = UserRoles.CUSTOMER;

  private Boolean emailVerified = false;

  @CreationTimestamp
  private LocalDateTime creationDate;
}
