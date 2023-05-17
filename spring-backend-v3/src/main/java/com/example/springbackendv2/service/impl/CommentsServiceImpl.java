package com.example.springbackendv2.service.impl;

import com.example.springbackendv2.model.Comments;
import com.example.springbackendv2.repository.CommentsRepository;
import com.example.springbackendv2.service.CommentsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentsServiceImpl implements CommentsService {

    @Autowired
    CommentsRepository repository;

    @Override
    public List<Comments> getAllCommentByUserId(Long userId) {
        return repository.findAllByUserId(userId);
    }

    @Override
    public List<Comments> getAllCommentDtoByResourceId(Long resourceID) {
        return repository.findAllByFileId(resourceID);
    }

    @Override
    public List<Comments> getAllCommentByResourceId(Long resourceId) {
        return repository.findAllByResourceId(resourceId);
    }

    @Override
    public void deleteByResourceId(Long resourceId) {
        repository.deleteByResourceId(resourceId);
    }

    @Override
    public void deleteByCommentId(Long commentId) {
        repository.deleteByCommentId(commentId);
    }

    @Override
    public void updateCommentTextById(Long id, String text) {
        repository.updateCommentTextById(id, text);
    }

    @Override
    public Comments saveOrUpdateComment(Comments comment) {
        return repository.save(comment);
    }
}
