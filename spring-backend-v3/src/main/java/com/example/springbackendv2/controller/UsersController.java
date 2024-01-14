package com.example.springbackendv2.controller;

import com.example.springbackendv2.exception.UserNotFoundException;
import com.example.springbackendv2.model.Users;
import com.example.springbackendv2.repository.FileMetadataRepository;
import com.example.springbackendv2.repository.GroupManagerRepository;
import com.example.springbackendv2.repository.UsersRepository;
import com.example.springbackendv2.service.StorageService;
import com.example.springbackendv2.service.TokensService;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RestController
@CrossOrigin("http://student-sources.s3-website-us-west-1.amazonaws.com")
public class UsersController {
    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private TokensService tokensService;
    @Autowired
    private FileMetadataRepository fileMetadataRepository;
    @Autowired
    StorageService storageService;
    @Autowired
    private GroupManagerRepository groupManagerRepository;

    //   --------------------- BASIC POST, GET, DELETE MAPPING BY UNIQUE ID --------------------


    @PostMapping("/user")
    Users newUser(@RequestBody Users newUser){

        //        if user amount exceeds 20, then do not create new user.
        if (usersRepository.findAll().size() >= 20) {
            newUser.setId(-3L);
            return newUser;
        }

        if (usersRepository.checkUsername(newUser.getUser()) != null) {
            newUser.setId(-1L);
            return newUser;
        }
        else if (usersRepository.checkEmail(newUser.getEmail()) != null) {
            newUser.setId(-2L);
            return newUser;
        }
        usersRepository.save(newUser);
        String token = tokensService.saveToken(newUser.getId());

//        Clearing fields before sending data back to frontend
        newUser.setUser("");
        newUser.setEmail("");
        newUser.setFirstName("");
        newUser.setLastName("");
        newUser.setPassword(token);

        return newUser;
    }

    @GetMapping("/users")
    List<Users> getAllUsers(){
        return usersRepository.findAll();
    }

    @GetMapping("/user/{id}")
    Users getUserById(@PathVariable Long id){
        return  usersRepository.findById(id)
                    .orElseThrow(()-> new UserNotFoundException(id));
    }

    @PutMapping("/user/{id}")
    Users updateUser(@RequestBody Users newUser, @PathVariable Long id){

        if (usersRepository.checkUsername(newUser.getUser()) != null && !Objects.equals(usersRepository.checkUsername(newUser.getUser()).getId(), id)) {
            Users res = new Users();
            res.setId(-1L);
            return res;
        } else if (usersRepository.checkEmail(newUser.getEmail()) != null && !Objects.equals(usersRepository.checkEmail(newUser.getEmail()).getId(), id)) {
            Users res = new Users();
            res.setId(-2L);
            return res;
        }

        return usersRepository.findById(id)
                .map(user -> {
                    user.setUser(newUser.getUser());
                    user.setFirstName(newUser.getFirstName());
                    user.setLastName(newUser.getLastName());
                    user.setPassword(newUser.getPassword());
                    user.setEmail(newUser.getEmail());

                    return usersRepository.save(user);
                }).orElseThrow(()-> new UserNotFoundException(id));
    }

    @DeleteMapping(value = "/user/{userId}/{token}")
    String deleteUser(@PathVariable("userId") Long userId,
                      @PathVariable("token") String token) throws JsonProcessingException {
        if(!usersRepository.existsById(userId)){
            throw new UserNotFoundException(userId);
        } else if (!tokensService.checkAndUpdateToken(token, userId)) {
            throw new UserNotFoundException(userId);
        }

        String key = userId + ".json";
        try {
            storageService.deleteAllFiles(key);
            storageService.deleteJson(key);
        } catch (Exception e) {
            System.out.println("Failed to delete some or all files from bucket: " + e);
        }

        fileMetadataRepository.deleteByUserId(userId);
        tokensService.deleteAllByUserId(userId);

//        delete all groups where user is the owner.
        groupManagerRepository.deleteDirectMessagesByOwnerId(userId);
        groupManagerRepository.deleteChatMembersByOwnerId(userId);
        groupManagerRepository.deleteGroupManagerByOwnerId(userId);

        usersRepository.deleteById(userId);
        return "Deleted user with id: " + userId;
    }


    //   --------------------- MODIFIED MAPPING (refer to UserRepository for more info) --------------------
    @DeleteMapping(value = "/userToken/{token}/{userId}")
    void deleteByTokenAndUserId(@PathVariable("token") String token,
                                @PathVariable("userId") Long userId) {
        tokensService.deleteByTokenAndUserId(token, userId);
    }

    @GetMapping(value = "/login/{user}/{password}")
    public Users findByName(@PathVariable("user") String user, @PathVariable("password") String password) {
        Users res = usersRepository.findUsers(user);

//        USERNAME OR EMAIL DOES NOT EXIST
        if(res == null) {
            res = new Users();
            res.setId(-1L);
            return res;
        }

//        PASSWORD DOES NOT MATCH
        else if (!Objects.equals(res.getPassword(), password)) {
            res = new Users();
            res.setId(-2L);
            return res;
        } else {
            String token = tokensService.saveToken(res.getId());
            res.setPassword(token);
            return res;
        }
    }

    @GetMapping(value = "/authenticate/{password}/{user_id}/{token}")
    public Boolean authenticateUser(@PathVariable("password") String password,
                                    @PathVariable("user_id") Long user_id,
                                    @PathVariable("token") String tokenValue) {

//        If token does not exist or is expired.
        boolean result = tokensService.checkAndUpdateToken(tokenValue, user_id);
        if (!result) {
            return false;
        }

        Users res = usersRepository.authenticateUser(password, user_id);
        return res != null;
    }

    @GetMapping("/search/{query}")
    List<Users> searchUser(@PathVariable String query)
    {
        /*   This is still a strict search. we will expand on this to
        return a margin of close results */
        String newQuery = query.replace(" ", "");

        List<Users> result = usersRepository.searchUsersByUsername(newQuery);
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
    List<Users> findByUserId(@PathVariable("user_id") Long user_id) {
        List<Users> res = usersRepository.findFriends(user_id);
        for (int i = 0; i < res.size(); i++) {
            res.get(i).setPassword("");
            res.get(i).setEmail("");
        } return ResponseEntity.status(HttpStatus.OK).body(res).getBody();
    }

    @GetMapping(value = "/getPending/{user_id}")
    List<Users> getPendingReq(@PathVariable("user_id") Long user_id) {
        List<Users> res = usersRepository.getPending(user_id);
        for (int i = 0; i < res.size(); i++) {
            res.get(i).setPassword("");
            res.get(i).setEmail("");
        } return ResponseEntity.status(HttpStatus.OK).body(res).getBody();
    }

    @GetMapping(value = "/mySavedUsers/{user_id}")
    List<Users> getSavedUsers(@PathVariable("user_id") Long user_id) {
        List<Users> res = usersRepository.getSavedUsers(user_id);
        for (int i = 0; i < res.size(); i++) {
            res.get(i).setPassword("");
            res.get(i).setEmail("");
        } return ResponseEntity.status(HttpStatus.OK).body(res).getBody();
    }
}