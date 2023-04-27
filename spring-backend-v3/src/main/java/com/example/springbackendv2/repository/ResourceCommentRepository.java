package com.example.springbackendv2.repository;

import com.example.springbackendv2.dto.ResourceCommentRecord;
import com.example.springbackendv2.model.ResourceComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ResourceCommentRepository extends JpaRepository<ResourceComment, Long> {

    @Query(value = "select c from ResourceComment c WHERE c.userID = :userId", nativeQuery = true)
    List<ResourceComment> findAllByUserId(@Param("userId") Long userId);

    @Query(value = "select c from ResourceComment c WHERE c.resourceID = :resourceID", nativeQuery = true)
    List<ResourceComment> findAllByResourceId(@Param("resourceID") int resourceID);

    @Query(value = "delete c from ResourceComment c WHERE c.resourceID = :resourceID", nativeQuery = true)
    void deleteByResourceId(@Param("resourceID") int resourceID);

    @Query(value = "delete c from ResourceComment c WHERE c.commentID = :commentID", nativeQuery = true)
    void deleteByCommentId(@Param("commentID") Long commentID);


    @Query(value = "update ResourceComment c set c.text = :text WHERE c.id = :id", nativeQuery = true)
    void updateCommentTextById(@Param("id")  Long id, @Param("text")  String text);

    @Query(value = """
           select new ResourceCommentRecord(
           c.commendID as commentID,
           c.comment as comment,
           c.commentDate as commentDate,
           u.username as username,
           u.userImage as userImage
           )
           from ResourceComment c
           join c.registeredUser u
           where c.resourceID = :resourceID
           order by c.id
            """, nativeQuery = true)
    List<ResourceCommentRecord> findAllResourceCommentDTOByResourceID(@Param("resourceID") int resourceID);
}
