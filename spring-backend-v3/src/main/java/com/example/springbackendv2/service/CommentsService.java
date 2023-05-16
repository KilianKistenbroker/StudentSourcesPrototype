package com.example.springbackendv2.service;


import com.example.springbackendv2.dto.ResourceCommentsRecord;
import com.example.springbackendv2.model.Comments;

import java.util.List;

public interface CommentsService {


    List<Comments> getAllCommentByUserId(Long userId);

    List<Comments> getAllCommentByResourceId(int resourceID);

    List<ResourceCommentsRecord> getAllCommentDtoByResourceId(int resourceID);

    void deleteByResourceId(int resourceID);

    void deleteByCommentId(Long commentId);

    void updateCommentTextById(Long id, String text);

    Comments saveOrUpdateComment(Comments comment);
}
