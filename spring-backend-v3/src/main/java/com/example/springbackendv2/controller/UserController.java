package com.example.springbackendv2.controller;

import com.example.springbackendv2.exception.UserNotFoundException;
import com.example.springbackendv2.model.User;
import com.example.springbackendv2.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Query;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@RestController
@CrossOrigin("http://localhost:3000/")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    //   --------------------- BASIC POST, GET, DELETE MAPPING BY UNIQUE ID --------------------


    @PostMapping("/user")
    Long newUser(@RequestBody User newUser){

        if (userRepository.checkUsername(newUser.getUser()) != null)
            return -1L;
        else if (userRepository.checkEmail(newUser.getEmail()) != null) {
            return -2L;
        }
        userRepository.save(newUser);
        return newUser.getId();
    }

    @GetMapping("/users")
    List<User> getAllUsers(){
        return userRepository.findAll();
    }

    @GetMapping("/user/{id}")
    User getUserById(@PathVariable Long id){
        return  userRepository.findById(id)
                    .orElseThrow(()-> new UserNotFoundException(id));
    }

    @PutMapping("/user/{id}")
    User updateUser(@RequestBody User newUser, @PathVariable Long id){
        return userRepository.findById(id)
                .map(user -> {
                    user.setUser(newUser.getUser());
                    user.setFirstName(newUser.getFirstName());
                    user.setEmail(newUser.getEmail());

                    return userRepository.save(user);
                }).orElseThrow(()-> new UserNotFoundException(id));
    }

    @DeleteMapping("/user/{id}")
    String deleteUser(@PathVariable Long id){
        if(!userRepository.existsById(id)){
            throw new UserNotFoundException(id);
        }

        userRepository.deleteById(id);
        return "Deleted user with id: " + id;
    }


    //   --------------------- MODIFIED MAPPING (refer to UserRepository for more info) --------------------


    @GetMapping(value = "/login/{user}/{password}")
    public Long findByName(@PathVariable("user") String user, @PathVariable("password") String password) {
        User res = userRepository.findUsers(user);

//        USERNAME OR EMAIL DOES NOT EXIST
        if(res == null) {
            return -1L;
        }

//        PASSWORD DOES NOT MATCH
        else if (!Objects.equals(res.getPassword(), password)) {
            System.out.println("this is being printed");
            return -2L;
        } else {
            return res.getId();
        }
    }

    @GetMapping(value = "/authenticate/{password}/{user_id}")
    public Boolean authenticateUser(@PathVariable("password") String password,
                                    @PathVariable("user_id") Long user_id) {
        User res = userRepository.authenticateUser(password, user_id);
        return res != null;
    }

    @GetMapping("/search/{query}")
    List<User> searchUser(@PathVariable String query)
    {
        /*   This is still a strict search. we will expand on this to
        return a margin of close results */

        String newQuery = query.replace(" ", "");
        List<User> result = userRepository.searchUsersByUsername(newQuery);
        for (int i = 0; i < result.size(); i++) {
            result.get(i).setPassword("");
            result.get(i).setEmail("");
        }
        if(result.isEmpty()) {
            return null;
        }
        else {
            return ResponseEntity.status(HttpStatus.OK).body(result).getBody();
        }
    }

    @GetMapping(value = "/findFriends/{user_id}")
    List<User> findByUserId(@PathVariable("user_id") Long user_id) {
        List<User> res = userRepository.findFriends(user_id);
        for (int i = 0; i < res.size(); i++) {
            res.get(i).setPassword("");
            res.get(i).setEmail("");
        } return ResponseEntity.status(HttpStatus.OK).body(res).getBody();
    }

    @GetMapping(value = "/getPending/{user_id}")
    List<User> getPendingReq(@PathVariable("user_id") Long user_id) {
        List<User> res = userRepository.getPending(user_id);
        for (int i = 0; i < res.size(); i++) {
            res.get(i).setPassword("");
            res.get(i).setEmail("");
        } return ResponseEntity.status(HttpStatus.OK).body(res).getBody();
    }

    @GetMapping(value = "/mySavedUsers/{user_id}")
    List<User> getSavedUsers(@PathVariable("user_id") Long user_id) {
        List<User> res = userRepository.getSavedUsers(user_id);
        for (int i = 0; i < res.size(); i++) {
            res.get(i).setPassword("");
            res.get(i).setEmail("");
        } return ResponseEntity.status(HttpStatus.OK).body(res).getBody();
    }
}