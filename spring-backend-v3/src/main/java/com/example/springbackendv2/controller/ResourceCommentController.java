package com.example.springbackendv2.controller;

import com.example.springbackendv2.dto.ResourceCommentRecord;
import com.example.springbackendv2.model.ResourceComment;
import com.example.springbackendv2.service.impl.ResourceCommentServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:3000/")
public class ResourceCommentController {

    @Autowired
    ResourceCommentServiceImpl resourceCommentService;

    @GetMapping("/resourcecomment/resource/{resource_id}")
    List<ResourceCommentRecord> getAllCommentDtoByResourceId(@PathVariable("resource_id") int resourceId){
        return resourceCommentService.getAllCommentDtoByResourceId(resourceId);
    }

    @GetMapping("/resourcecomment/user/{user_id}")
    List<ResourceComment> getAllCommentsByUserId(@PathVariable("user_id") Long userId){
        return resourceCommentService.getAllCommentByUserId(userId);
    }

    @PostMapping("/resourcecomment")
    ResourceComment createResourceComment(@RequestBody ResourceComment resourceComment){
        return resourceCommentService.saveOrUpdateComment(resourceComment);
    }

    @PutMapping("/resourcecomment")
    ResourceComment updateResourceComment(@RequestBody ResourceComment resourceComment){
        return resourceCommentService.saveOrUpdateComment(resourceComment);
    }

    @PutMapping("/resourcecomment/{comment_id}")
    void updateCommentTextById(@RequestBody String text, @PathVariable("comment_id") Long commentId){
        resourceCommentService.updateCommentTextById(commentId, text);
    }

    @DeleteMapping("/resourcecomment/resource/{resource_id}")
    void deleteResourceCommentByResourceId(@PathVariable("resource_id") int resourceId){
        resourceCommentService.deleteByResourceId(resourceId);
    }

    @DeleteMapping("/resourcecomment/comment/{comment_id}")
    void deleteResourceCommentByCommentId(@PathVariable("comment_id") Long commentId){
        resourceCommentService.deleteByCommentId(commentId);
    }
}
