package com.example.springbackendv2.repository;

import com.example.springbackendv2.model.GroupManager;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface GroupManagerRepository extends JpaRepository<GroupManager, Long> {
    @Query(value = "SELECT * FROM group_manager WHERE fk_owner_id LIKE :userId", nativeQuery = true)
    List<GroupManager> findByOwnerId(@Param("userId") Long userId);

    @Transactional
    @Modifying
    @Query(value = "DELETE FROM group_manager WHERE id = :group_id", nativeQuery = true)
    void deleteGroup (@Param("group_id") Long group_id);

    @Transactional
    @Modifying
    @Query(value = "DELETE FROM chat_members WHERE fk_group_id IN (SELECT id FROM group_manager WHERE fk_owner_id = :userId)", nativeQuery = true)
    void deleteChatMembersByOwnerId(@Param("userId") Long userId);

    @Transactional
    @Modifying
    @Query(value = "DELETE FROM direct_messages WHERE fk_group_id IN (SELECT id FROM group_manager WHERE fk_owner_id = :userId)", nativeQuery = true)
    void deleteDirectMessagesByOwnerId(@Param("userId") Long userId);

    @Transactional
    @Modifying
    @Query(value = "DELETE FROM group_manager WHERE fk_owner_id = :userId", nativeQuery = true)
    void deleteGroupManagerByOwnerId(@Param("userId") Long userId);
}
