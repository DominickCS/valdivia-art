package com.valdivia.art.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.valdivia.art.entity.PasswordResetToken;
import com.valdivia.art.entity.User;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
  Optional<PasswordResetToken> findByToken(String token);

  void deleteByUser(User user);
}
