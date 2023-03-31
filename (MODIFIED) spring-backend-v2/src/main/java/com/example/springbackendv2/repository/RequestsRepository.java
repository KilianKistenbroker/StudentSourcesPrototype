package com.example.springbackendv2.repository;

import com.example.springbackendv2.model.Requests;
import com.example.springbackendv2.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface RequestsRepository extends JpaRepository<Requests, Long> {
    @Query(value = "select * from requests where fk_sender_id like :user_id", nativeQuery = true)
    List<Requests> getSent(@Param("user_id") Long user_id);

    @Transactional
    @Modifying
    @Query(value = "delete from requests where fk_sender_id like :receiver_id and fk_receiver_id like :sender_id", nativeQuery = true)
    void deleteRequest(@Param("receiver_id") Long receiver_id, @Param("sender_id") Long sender_id);
}