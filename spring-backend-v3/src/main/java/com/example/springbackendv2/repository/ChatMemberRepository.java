package com.example.springbackendv2.repository;

import com.example.springbackendv2.model.ChatMembers;
import com.example.springbackendv2.model.DirectMessages;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ChatMemberRepository extends JpaRepository<ChatMembers, Long> {
    @Query(value = "SELECT chat_members.* FROM chat_members JOIN group_manager ON chat_members.fk_group_id = group_manager.id WHERE chat_members.fk_member_id LIKE :user_id ORDER BY group_manager.last_updated", nativeQuery = true)
    List<ChatMembers> getAllChatGroupsByUserId(@Param("user_id") Long user_id);

    @Transactional
    @Modifying
    @Query(value = "delete c from chat_members c WHERE c.fk_group_id = :group_id", nativeQuery = true)
    void removeMembersByGroupId (@Param("group_id") Long group_id);

    @Transactional
    @Modifying
    @Query(value = "delete from chat_members WHERE fk_group_id like :group_id and fk_member_id like :user_id", nativeQuery = true)
    void leaveGroupChat (@Param("group_id") Long group_id, @Param("user_id") Long user_id);

}
