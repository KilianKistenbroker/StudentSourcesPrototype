package com.example.springbackendv2.repository;


import com.example.springbackendv2.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    @Query(value = "SELECT * FROM user WHERE user LIKE :user OR email LIKE :user", nativeQuery = true)
    User findUsers(@Param("user") String user);

    @Query(value = "SELECT * FROM user WHERE password LIKE :password AND id LIKE :user_id", nativeQuery = true)
    User authenticateUser(@Param("password") String password, @Param("user_id") Long user_id);

    @Query(value = "SELECT * FROM user WHERE user LIKE :user", nativeQuery = true)
    User checkUsername(@Param("user") String user);

    @Query(value = "SELECT * FROM user WHERE email LIKE :email", nativeQuery = true)
    User checkEmail(@Param("email") String email);

    @Query(value = "SELECT * FROM user WHERE user LIKE :query OR first_name LIKE :query OR last_name LIKE :query", nativeQuery = true)
    List<User> searchUsersByUsername(@Param("query") String query);

    @Query(value = "SELECT * FROM user WHERE id IN (SELECT fk_friend_id FROM friends WHERE fk_user_id LIKE :user_id)", nativeQuery = true)
    List<User> findFriends(@Param("user_id") Long user_id);

    @Query(value = "SELECT * FROM user WHERE id IN (SELECT fk_sender_id FROM requests WHERE fk_receiver_id LIKE :user_id)", nativeQuery = true)
    List<User> getPending(@Param("user_id") Long user_id);

    @Query(value = "SELECT * FROM user WHERE id IN (SELECT fk_item_id FROM saved_user WHERE fk_user_id LIKE :user_id)", nativeQuery = true)
    List<User> getSavedUsers(@Param("user_id") Long user_id);
}