package com.example.springbackendv2.controller;

import com.example.springbackendv2.dto.ResourceCommentsRecord;
import com.example.springbackendv2.model.Comments;
import com.example.springbackendv2.service.impl.CommentsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class CommentsController {

    @Autowired
    CommentsServiceImpl resourceCommentService;

    @GetMapping("/resourcecomment/resource/{resource_id}")
    List<ResourceCommentsRecord> getAllCommentDtoByResourceId(@PathVariable("resource_id") int resourceId){
        return resourceCommentService.getAllCommentDtoByResourceId(resourceId);
    }

    @GetMapping("/resourcecomment/user/{user_id}")
    List<Comments> getAllCommentsByUserId(@PathVariable("user_id") Long userId){
        return resourceCommentService.getAllCommentByUserId(userId);
    }

    @PostMapping("/resourcecomment")
    Comments createResourceComment(@RequestBody Comments comment){
        return resourceCommentService.saveOrUpdateComment(comment);
    }

    @PutMapping("/resourcecomment")
    Comments updateResourceComment(@RequestBody Comments comment){
        return resourceCommentService.saveOrUpdateComment(comment);
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
