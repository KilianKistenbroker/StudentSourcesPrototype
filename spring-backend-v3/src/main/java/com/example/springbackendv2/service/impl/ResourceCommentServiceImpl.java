package com.example.springbackendv2.service.impl;

import com.example.springbackendv2.dto.ResourceCommentRecord;
import com.example.springbackendv2.model.ResourceComment;
import com.example.springbackendv2.repository.ResourceCommentRepository;
import com.example.springbackendv2.service.ResourceCommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResourceCommentServiceImpl implements ResourceCommentService {

    @Autowired
    ResourceCommentRepository repository;

    @Override
    public List<ResourceComment> getAllCommentByUserId(Long userId) {
        return repository.findAllByUserId(userId);
    }

    @Override
    public List<ResourceCommentRecord> getAllCommentDtoByResourceId(int resourceId) {
        return repository.findAllResourceCommentDTOByResourceID(resourceId);
    }

    @Override
    public List<ResourceComment> getAllCommentByResourceId(int resourceId) {
        return repository.findAllByResourceId(resourceId);
    }

    @Override
    public void deleteByResourceId(int resourceId) {
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
    public ResourceComment saveOrUpdateComment(ResourceComment comment) {
        return repository.save(comment);
    }
}
