package com.example.springbackendv2.controller;

import com.example.springbackendv2.exception.UserNotFoundException;
import com.example.springbackendv2.model.Users;
import com.example.springbackendv2.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RestController
public class UsersController {
    @Autowired
    private UsersRepository usersRepository;

    //   --------------------- BASIC POST, GET, DELETE MAPPING BY UNIQUE ID --------------------


    @PostMapping("/user")
    Long newUser(@RequestBody Users newUser){

        if (usersRepository.checkUsername(newUser.getUser()) != null)
            return -1L;
        else if (usersRepository.checkEmail(newUser.getEmail()) != null) {
            return -2L;
        }
        usersRepository.save(newUser);
        return newUser.getId();
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
        }

        else if (usersRepository.checkEmail(newUser.getEmail()) != null && !Objects.equals(usersRepository.checkEmail(newUser.getEmail()).getId(), id)) {
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

    @DeleteMapping("/user/{id}")
    String deleteUser(@PathVariable Long id){
        if(!usersRepository.existsById(id)){
            throw new UserNotFoundException(id);
        }

        usersRepository.deleteById(id);
        return "Deleted user with id: " + id;
    }


    //   --------------------- MODIFIED MAPPING (refer to UserRepository for more info) --------------------


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
//            System.out.println("this is being printed");
            res.setId(-2L);
            return res;
        } else {
            return res;
        }
    }

    @GetMapping(value = "/authenticate/{password}/{user_id}")
    public Boolean authenticateUser(@PathVariable("password") String password,
                                    @PathVariable("user_id") Long user_id) {
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