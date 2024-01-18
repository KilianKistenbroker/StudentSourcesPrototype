package com.example.springbackendv2.controller;

import com.example.springbackendv2.exception.UserNotFoundException;
import com.example.springbackendv2.model.ChatMembers;
import com.example.springbackendv2.model.DirectMessages;
import com.example.springbackendv2.model.GroupManager;
import com.example.springbackendv2.model.Users;
import com.example.springbackendv2.repository.ChatMemberRepository;
import com.example.springbackendv2.repository.DirectMessagesRepository;
import com.example.springbackendv2.repository.GroupManagerRepository;
import com.example.springbackendv2.repository.UsersRepository;
import com.example.springbackendv2.service.TokensService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@RestController
public class GroupManagerController {

    @Autowired
    GroupManagerRepository groupManagerRepository;

    @Autowired
    UsersRepository usersRepository;

    @Autowired
    DirectMessagesRepository directMessagesRepository;

    @Autowired
    ChatMemberRepository chatMemberRepository;

    @Autowired
    TokensService tokensService;

    @PostMapping("/createGroupChat")
    GroupManager createGroupChat(@RequestBody GroupManager groupManager,
                                 @RequestParam ArrayList<Long> user_ids,
                                 @RequestParam String token){
        boolean result = tokensService.checkAndUpdateToken(token, groupManager.getFk_owner_id());
        if (!result) {
            System.out.println("Token not found.");
            GroupManager res = new GroupManager();
            res.setId(-1L);
            return res;

//            limit amount of group chats a user can own
        } else if (groupManagerRepository.findByOwnerId(groupManager.getFk_owner_id()).size() > 1) {
            System.out.println("exceeded limit of group chats.");
            GroupManager res = new GroupManager();
            res.setId(-2L);
            return res;
        }

        GroupManager groupRef = groupManagerRepository.save(groupManager);

        for (Long userId : user_ids) {
            ChatMembers chatMembers = new ChatMembers();
            chatMembers.setFk_group_id(groupRef.getId());
            chatMembers.setFk_member_id(userId);
            chatMemberRepository.save(chatMembers);
        }

        new Users();
        Users user;
        for (int i = 0; i < user_ids.size(); i++) {
            int finalI = i;
            user = usersRepository.findById(user_ids.get(i))
                    .orElseThrow(()-> new UserNotFoundException(user_ids.get(finalI)));

            DirectMessages directMessages = new DirectMessages();
            directMessages.setFk_group_id(groupRef.getId());
            directMessages.setMessage("Added " + user.getUser() + " to group chat.");
            directMessages.setFk_user_id(user.getId());

            directMessagesRepository.save(directMessages);
        }

        return groupRef;
    }

    @DeleteMapping("/deleteGroup/{id}/{userId}/{token}")
    String deleteGroup(@PathVariable Long id,
                       @PathVariable Long userId,
                       @PathVariable String token){

        if (!tokensService.checkAndUpdateToken(token, userId)) {
            System.out.println("invalid token");
            return null;
        }

        if(!groupManagerRepository.existsById(id)){
            throw new UserNotFoundException(id);
        }

//        groupManagerRepository.deleteById(id);
        chatMemberRepository.removeMembersByGroupId(id);
        directMessagesRepository.deleteMessagesByGroupId(id);
        groupManagerRepository.deleteGroup(id);
        return "Deleted user with id: " + id;
    }
}
