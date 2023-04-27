package com.example.springbackendv2.repository;

import com.example.springbackendv2.model.SavedUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface SavedUserRepository extends JpaRepository<SavedUser, Long> {
    @Transactional
    @Modifying
    @Query(value = "delete from saved_user where fk_user_id like :user_id and fk_item_id like :item_id", nativeQuery = true)
    void deleteSavedUser(@Param("user_id") Long user_id, @Param("item_id") Long item_id);
}