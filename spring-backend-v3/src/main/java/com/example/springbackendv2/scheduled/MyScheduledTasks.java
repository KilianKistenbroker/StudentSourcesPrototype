package com.example.springbackendv2.scheduled;

import com.example.springbackendv2.repository.*;
import com.example.springbackendv2.service.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Configuration
@EnableScheduling
public class MyScheduledTasks {

    @Autowired
    UsersRepository usersRepository;
    @Autowired
    ChatMemberRepository chatMemberRepository;
    @Autowired
    CommentsRepository commentsRepository;
    @Autowired
    DirectMessagesRepository directMessagesRepository;
    @Autowired
    FileMetadataRepository fileMetadataRepository;
    @Autowired
    FriendRequestsRepository friendRequestsRepository;
    @Autowired
    FriendsRepository friendsRepository;
    @Autowired
    GroupManagerRepository groupManagerRepository;
    @Autowired
    SavedUsersRepository savedUsersRepository;
    @Autowired
    TokensRepository tokensRepository;

    @Scheduled(cron = "0 0 0 * * ?") // Runs at 12:00 AM every day
    public void myScheduledMethod() {
        // Your code to be executed at the specified time
        usersRepository.deleteAll();
        chatMemberRepository.deleteAll();
        commentsRepository.deleteAll();
        directMessagesRepository.deleteAll();
        fileMetadataRepository.deleteAll();
        friendRequestsRepository.deleteAll();
        friendsRepository.deleteAll();
        groupManagerRepository.deleteAll();
        savedUsersRepository.deleteAll();
        tokensRepository.deleteAll();

        System.out.println("executed scheduled tasks.");
    }
}
