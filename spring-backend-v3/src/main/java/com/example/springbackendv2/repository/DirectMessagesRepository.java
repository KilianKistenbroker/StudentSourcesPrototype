package com.example.springbackendv2.repository;


import com.example.springbackendv2.model.DirectMessages;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface DirectMessagesRepository extends JpaRepository<DirectMessages, Long> {
    @Query(value = "SELECT * FROM direct_messages WHERE fk_group_id LIKE :group_id ORDER BY message_date", nativeQuery = true)
    List<DirectMessages> getAllMessagesByGroupId(@Param("group_id") Long group_id);



    @Query(value = "SELECT * FROM direct_messages WHERE fk_user_id LIKE :userId AND fk_group_id LIKE :groupId", nativeQuery = true)
    List<DirectMessages> findByUserIdAndGroupId(@Param("userId") Long userId, @Param("groupId") Long groupId);

    @Transactional
    @Modifying
    @Query(value = "delete c from direct_messages c WHERE c.fk_group_id = :group_id", nativeQuery = true)
    void deleteMessagesByGroupId (@Param("group_id") Long group_id);
}
