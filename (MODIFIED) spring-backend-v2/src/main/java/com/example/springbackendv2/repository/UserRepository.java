package com.example.springbackendv2.repository;


import com.example.springbackendv2.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    @Query(value = "Select * from user where user like :user or email like :user", nativeQuery = true)
    User findUsers(@Param("user") String user);

    @Query(value = "Select * from user where user like :user and password like :password and id like :user_id", nativeQuery = true)
    User authenticateUser(@Param("user") String user, @Param("password") String password, @Param("user_id") Long user_id);

    @Query(value = "Select * from user where user like :user", nativeQuery = true)
    User checkUsername(@Param("user") String user);

    @Query(value = "Select * from user where email like :email", nativeQuery = true)
    User checkEmail(@Param("email") String email);

    @Query(value = "select * from user where user like :query or first_name like :query or last_name like :query", nativeQuery = true)
    List<User> searchUsersByUsername(@Param("query") String query);

    @Query(value = "select * from user where id in (select fk_friend_id from friends where fk_user_id like :user_id)", nativeQuery = true)
    List<User> findFriends(@Param("user_id") Long user_id);

    @Query(value = "select * from user where id in (select fk_sender_id from requests where fk_receiver_id like :user_id)", nativeQuery = true)
    List<User> getPending(@Param("user_id") Long user_id);

    @Query(value = "select * from user where id in (select fk_item_id from saved_user where fk_user_id like :user_id)", nativeQuery = true)
    List<User> getSavedUsers(@Param("user_id") Long user_id);
}