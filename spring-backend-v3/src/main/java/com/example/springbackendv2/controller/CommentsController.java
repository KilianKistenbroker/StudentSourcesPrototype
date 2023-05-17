package com.example.springbackendv2.controller;

import com.example.springbackendv2.dto.MessengerDto;
import com.example.springbackendv2.exception.UserNotFoundException;
import com.example.springbackendv2.model.Comments;
import com.example.springbackendv2.model.Users;
import com.example.springbackendv2.repository.UsersRepository;
import com.example.springbackendv2.service.impl.CommentsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
public class CommentsController {

    @Autowired
    CommentsServiceImpl commentsService;

    @Autowired
    UsersRepository usersRepository;

    @GetMapping("/getComments/{resource_id}")
    List<MessengerDto> getAllCommentDtoByResourceId(@PathVariable("resource_id") Long resourceId){
        List<Comments> list = commentsService.getAllCommentDtoByResourceId(resourceId);
        List<MessengerDto> adjustedList = new ArrayList<>();
        new Users();
        Users user;

//        populating data transfer object here
        for (int i = 0; i < list.size(); i++) {
            int finalI = i;
            user = usersRepository.findById(list.get(i).getFk_user_id())
                    .orElseThrow(()-> new UserNotFoundException(list.get(finalI).getFk_user_id()));

            MessengerDto messengerDto = new MessengerDto();
            messengerDto.setMessage(list.get(i).getComment());
            messengerDto.setDate_posted(list.get(i).getComment_date());
            messengerDto.setId(list.get(i).getId());
            messengerDto.setUser(user.getUser());

            adjustedList.add(messengerDto);
        }
        return adjustedList;
    }

    @GetMapping("/commentsByUser/{user_id}")
    List<Comments> getAllCommentsByUserId(@PathVariable("user_id") Long userId){
        return commentsService.getAllCommentByUserId(userId);
    }

    @PostMapping("/createComment")
    Comments createComment(@RequestBody Comments comment){
        return commentsService.saveOrUpdateComment(comment);
    }

    @PostMapping("/saveComment")
    Comments saveComment(@RequestBody Comments comment){
        return commentsService.saveOrUpdateComment(comment);
    }

    @PutMapping("/saveCommentText/{comment_id}")
    void saveCommentText(@RequestBody String text, @PathVariable("comment_id") Long commentId){
        commentsService.updateCommentTextById(commentId, text);
    }

    @DeleteMapping("/deleteAllComments/{resource_id}")
    void deleteAllComments(@PathVariable("resource_id") Long resourceId){
        commentsService.deleteByResourceId(resourceId);
    }

    @DeleteMapping("/deleteComment/{comment_id}")
    void deleteComment(@PathVariable("comment_id") Long commentId){
        commentsService.deleteByCommentId(commentId);
    }
}
