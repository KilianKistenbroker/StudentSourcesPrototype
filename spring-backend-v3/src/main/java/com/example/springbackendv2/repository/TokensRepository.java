package com.example.springbackendv2.repository;

import com.example.springbackendv2.model.Tokens;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface TokensRepository extends JpaRepository<Tokens, Long> {
    @Query(value = "SELECT * FROM tokens WHERE token LIKE :token AND fk_user_id LIKE :userId LIMIT 1", nativeQuery = true)
    Tokens findByTokenAndUserId(@Param("token") String token, @Param("userId") Long userId);

    @Transactional
    @Modifying
    @Query(value = "Delete From tokens WHERE token LIKE :token AND fk_user_id LIKE :userId", nativeQuery = true)
    void deleteByTokenAndUserId(@Param("token") String token, @Param("userId") Long userId);

    @Transactional
    @Modifying
    @Query(value = "Delete From tokens WHERE fk_user_id LIKE :userId", nativeQuery = true)
    void deleteAllByUserId(@Param("userId") Long userId);
}
