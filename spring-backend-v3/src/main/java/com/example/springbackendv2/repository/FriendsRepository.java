package com.example.springbackendv2.repository;

import com.example.springbackendv2.model.Friends;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface FriendsRepository extends JpaRepository<Friends, Long> {
    @Transactional
    @Modifying
    @Query(value = "delete from user_friends where fk_user_id like :user_id and fk_friend_id like :friend_id", nativeQuery = true)
    void deleteFriends(@Param("user_id") Long user_id, @Param("friend_id") Long friend_id);
}