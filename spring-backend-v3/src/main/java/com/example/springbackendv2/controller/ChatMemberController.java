package com.example.springbackendv2.controller;

import com.example.springbackendv2.dto.GroupInfoDto;
import com.example.springbackendv2.model.ChatMembers;
import com.example.springbackendv2.model.GroupManager;
import com.example.springbackendv2.model.Users;
import com.example.springbackendv2.repository.ChatMemberRepository;
import com.example.springbackendv2.repository.GroupManagerRepository;
import com.example.springbackendv2.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
public class ChatMemberController {
    @Autowired
    ChatMemberRepository chatMemberRepository;

    @Autowired
    UsersRepository usersRepository;

    @Autowired
    GroupManagerRepository groupManagerRepository;

    @GetMapping("/getGroups/{user_id}")
    List<GroupInfoDto> getAllCommentDtoByResourceId(@PathVariable("user_id") Long user_id){
        List<ChatMembers> list = chatMemberRepository.getAllChatGroupsByUserId(user_id);


        List<GroupInfoDto> adjustedList = new ArrayList<>();
        new Users();
        Users user;

        StringBuilder groupName = new StringBuilder();

//        populating data transfer object here
        for (ChatMembers chatMembers : list) {
            List<Users> usersList = usersRepository.getAllUsersByGroupId(chatMembers.getFk_group_id());
            GroupManager group = groupManagerRepository.getById(chatMembers.getFk_group_id());


            for (Users users : usersList) {
                groupName.append(", ").append(users.getUser());
            }

            String adjustedGroupName = groupName.substring(2);
            GroupInfoDto groupInfoDto = new GroupInfoDto();
            groupInfoDto.setGroupName(String.valueOf(adjustedGroupName));
            groupInfoDto.setTotalMembers((long) usersList.size());
            groupInfoDto.setFk_owner_id(group.getFk_owner_id());
            groupInfoDto.setId(chatMembers.getFk_group_id());
            adjustedList.add(groupInfoDto);

            groupName = new StringBuilder();
        }
        return adjustedList;
    }

    @DeleteMapping("/leaveGroupChat/{group_id}/{user_id}")
    void leaveGroupChat(@PathVariable("group_id") Long group_id,
                       @PathVariable("user_id") Long user_id){
        chatMemberRepository.leaveGroupChat(group_id, user_id);
    }
}
