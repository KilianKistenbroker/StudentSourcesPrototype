package com.example.springbackendv2.service;


import com.example.springbackendv2.model.Comments;

import java.util.List;

public interface CommentsService {


    List<Comments> getAllCommentByUserId(Long userId);

    List<Comments> getAllCommentByResourceId(Long resourceID);

    List<Comments> getAllCommentDtoByResourceId(Long resourceID);

    void deleteByResourceId(Long resourceID);

    void deleteByCommentId(Long commentId);

    void updateCommentTextById(Long id, String text);

    Comments saveOrUpdateComment(Comments comment);
}
