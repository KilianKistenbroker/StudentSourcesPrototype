package com.example.springbackendv2.repository;


import com.example.springbackendv2.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UsersRepository extends JpaRepository<Users, Long> {
    @Query(value = "SELECT * FROM users WHERE user LIKE :user OR email LIKE :user", nativeQuery = true)
    Users findUsers(@Param("user") String user);

    @Query(value = "SELECT * FROM users WHERE password LIKE :password AND id LIKE :user_id", nativeQuery = true)
    Users authenticateUser(@Param("password") String password, @Param("user_id") Long user_id);

    @Query(value = "SELECT * FROM users WHERE user LIKE :user", nativeQuery = true)
    Users checkUsername(@Param("user") String user);

    @Query(value = "SELECT * FROM users WHERE email LIKE :email", nativeQuery = true)
    Users checkEmail(@Param("email") String email);

    @Query(value = "SELECT * FROM users WHERE user LIKE :query OR first_name LIKE :query OR last_name LIKE :query OR CONCAT(first_name, last_name) like :query", nativeQuery = true)
    List<Users> searchUsersByUsername(@Param("query") String query);

    @Query(value = "SELECT * FROM users WHERE id IN (SELECT fk_friend_id FROM friends WHERE fk_user_id LIKE :user_id)", nativeQuery = true)
    List<Users> findFriends(@Param("user_id") Long user_id);

    @Query(value = "SELECT * FROM users WHERE id IN (SELECT fk_sender_id FROM friend_requests WHERE fk_receiver_id LIKE :user_id)", nativeQuery = true)
    List<Users> getPending(@Param("user_id") Long user_id);

    @Query(value = "SELECT * FROM users WHERE id IN (SELECT fk_item_id FROM saved_users WHERE fk_user_id LIKE :user_id)", nativeQuery = true)
    List<Users> getSavedUsers(@Param("user_id") Long user_id);
}