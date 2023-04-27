package com.example.springbackendv2.controller;

import com.example.springbackendv2.exception.UserNotFoundException;
import com.example.springbackendv2.model.Friends;
import com.example.springbackendv2.model.User;
import com.example.springbackendv2.repository.FriendsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin("http://localhost:3000/")
public class FriendsController {
    @Autowired
    private FriendsRepository friendsRepository;


    //   --------------------- BASIC POST, GET, DELETE MAPPING BY UNIQUE ID --------------------


    @PostMapping("/friend")
    Friends friends(@RequestBody Friends friends){
        return friendsRepository.save(friends);
    }

    @GetMapping("/friends")
    List<Friends> getAllFriends(){
        return friendsRepository.findAll();
    }

    @GetMapping("/friends/{id}")
    Friends getFriendsById(@PathVariable Long id){
        return  friendsRepository.findById(id)
                .orElseThrow(()-> new UserNotFoundException(id));
    }

    @DeleteMapping("/friends/{id}")
    String deleteFriendsById(@PathVariable Long id){
        if(!friendsRepository.existsById(id)){
            throw new UserNotFoundException(id);
        }

        friendsRepository.deleteById(id);
        return "Deleted friends with id: " + id;
    }



    //   --------------------- MODIFIED MAPPING (refer to FriendRepository for more info) --------------------



    @DeleteMapping("/deleteFriends/{user_id}/{friend_id}")
    String deleteFriends(@PathVariable Long user_id, @PathVariable Long friend_id){
        friendsRepository.deleteFriends(user_id, friend_id);
        friendsRepository.deleteFriends(friend_id, user_id);
        return "Deleted friends : " + user_id + " and " + friend_id;
    }

}
