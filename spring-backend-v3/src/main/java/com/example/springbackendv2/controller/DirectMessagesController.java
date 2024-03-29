package com.example.springbackendv2.controller;

import com.example.springbackendv2.dto.MessengerDto;
import com.example.springbackendv2.exception.UserNotFoundException;
import com.example.springbackendv2.model.DirectMessages;
import com.example.springbackendv2.model.Users;
import com.example.springbackendv2.repository.DirectMessagesRepository;
import com.example.springbackendv2.repository.UsersRepository;
import com.example.springbackendv2.service.TokensService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;

@RestController
public class DirectMessagesController {

    @Autowired
    DirectMessagesRepository directMessagesRepository;

    @Autowired
    UsersRepository usersRepository;
    @Autowired
    TokensService tokensService;



//    retrieve messages based on group id
    @GetMapping("/getMessages/{group_id}")
    List<MessengerDto> getAllMessagesByGroupId(@PathVariable("group_id") Long group_id){

        List<DirectMessages> list = directMessagesRepository.getAllMessagesByGroupId(group_id);

        List<MessengerDto> adjustedList = new ArrayList<>();
        new Users();
        Users user;

//        populating data transfer object here
        for (int i = 0; i < list.size(); i++) {
            int finalI = i;
            user = usersRepository.findById(list.get(i).getFk_user_id())
                    .orElseThrow(()-> new UserNotFoundException(list.get(finalI).getFk_user_id()));

            MessengerDto messengerDto = new MessengerDto();
            messengerDto.setMessage(list.get(i).getMessage());
            messengerDto.setDate_posted(list.get(i).getMessage_date());
            messengerDto.setId(list.get(i).getId());
            messengerDto.setUser(user.getUser());

            adjustedList.add(messengerDto);
        }

        return adjustedList;
    }

    @PostMapping("/createDirectMessage")
    Long createDirectMessage(@RequestBody DirectMessages directMessages,
                             @RequestParam String token){
        boolean result= tokensService.checkAndUpdateToken(token, directMessages.getFk_user_id());
        if (!result) {
            System.out.println("Token not found");
            return -1L;

//            limit chat messages per user per group.
        } else if (directMessagesRepository.findByUserIdAndGroupId(directMessages.getFk_user_id(), directMessages.getFk_group_id()).size() > 5) {
            System.out.println("User exceeded chat limit for this group");
            return -2L;
        }
        directMessagesRepository.save(directMessages);
        return 0L;
    }
}