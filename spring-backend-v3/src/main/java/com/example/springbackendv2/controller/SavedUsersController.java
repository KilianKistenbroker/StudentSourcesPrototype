package com.example.springbackendv2.controller;

import com.example.springbackendv2.exception.UserNotFoundException;
import com.example.springbackendv2.model.SavedUsers;
import com.example.springbackendv2.repository.SavedUsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class SavedUsersController {
    @Autowired
    private SavedUsersRepository savedUsersRepository;


//   --------------------- BASIC POST, GET, DELETE MAPPING BY UNIQUE ID --------------------

    @PostMapping("/savedUsers")
    SavedUsers savedUsers(@RequestBody SavedUsers savedUsers){
        return savedUsersRepository.save(savedUsers);
    }

    @GetMapping("/savedUsers")
    List<SavedUsers> getAllSaved(){
        return savedUsersRepository.findAll();
    }

    @GetMapping("/savedUsers/{id}")
    SavedUsers getSavedById(@PathVariable Long id){
        return  savedUsersRepository.findById(id)
                .orElseThrow(()-> new UserNotFoundException(id));
    }

    @DeleteMapping("/savedUsers/{id}")
    String deleteSaved(@PathVariable Long id){
        if(!savedUsersRepository.existsById(id)){
            throw new UserNotFoundException(id);
        }

        savedUsersRepository.deleteById(id);
        return "Deleted saved with id: " + id;
    }

    //   --------------------- MODIFIED MAPPING (refer to SavedRepository for more info) --------------------

    @DeleteMapping(value = "/deleteSavedUser/{user_id}/{item_id}")
    String deleteSavedUsers(@PathVariable("user_id") Long user_id, @PathVariable("item_id") Long item_id) {
        savedUsersRepository.deleteSavedUser(user_id, item_id);

        return "deleted : " + item_id;
    }
}
