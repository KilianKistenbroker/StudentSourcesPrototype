package com.example.springbackendv2.repository;

import com.example.springbackendv2.dto.MessengerDto;
import com.example.springbackendv2.model.Comments;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface CommentsRepository extends JpaRepository<Comments, Long> {

    @Query(value = "select c from Comment c WHERE c.userID = :userId", nativeQuery = true)
    List<Comments> findAllByUserId(@Param("userId") Long userId);

    @Query(value = "select c from Comment c WHERE c.resourceID = :resourceID", nativeQuery = true)
    List<Comments> findAllByResourceId(@Param("resourceID") Long resourceID);



    @Query(value = "delete c from Comment c WHERE c.commentID = :commentID", nativeQuery = true)
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
    List<MessengerDto> findAllResourceCommentDTOByResourceID(@Param("resourceID") int resourceID);

//    MODIFIED THESE a little bit
    @Transactional
    @Modifying
    @Query(value = "delete c from Comments c WHERE c.fk_file_id = :resourceID", nativeQuery = true)
    void deleteByResourceId(@Param("resourceID") Long resourceID);
    @Query(value = "SELECT * FROM Comments WHERE fk_file_id LIKE :resourceID ORDER BY comment_date", nativeQuery = true)
    List<Comments> findAllByFileId(@Param("resourceID") Long resourceID);
}
