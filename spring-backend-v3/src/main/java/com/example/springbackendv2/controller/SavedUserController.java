package com.example.springbackendv2.controller;

import com.example.springbackendv2.exception.UserNotFoundException;
import com.example.springbackendv2.model.SavedUser;
import com.example.springbackendv2.repository.SavedUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
public class SavedUserController {
    @Autowired
    private SavedUserRepository savedUserRepository;


//   --------------------- BASIC POST, GET, DELETE MAPPING BY UNIQUE ID --------------------

    @PostMapping("/savedUsers")
    SavedUser savedUsers(@RequestBody SavedUser savedUser){
        return savedUserRepository.save(savedUser);
    }

    @GetMapping("/savedUsers")
    List<SavedUser> getAllSaved(){
        return savedUserRepository.findAll();
    }

    @GetMapping("/savedUsers/{id}")
    SavedUser getSavedById(@PathVariable Long id){
        return  savedUserRepository.findById(id)
                .orElseThrow(()-> new UserNotFoundException(id));
    }

    @DeleteMapping("/savedUsers/{id}")
    String deleteSaved(@PathVariable Long id){
        if(!savedUserRepository.existsById(id)){
            throw new UserNotFoundException(id);
        }

        savedUserRepository.deleteById(id);
        return "Deleted saved with id: " + id;
    }

    //   --------------------- MODIFIED MAPPING (refer to SavedRepository for more info) --------------------

    @DeleteMapping(value = "/deleteSavedUser/{user_id}/{item_id}")
    String deleteSavedUsers(@PathVariable("user_id") Long user_id, @PathVariable("item_id") Long item_id) {
        savedUserRepository.deleteSavedUser(user_id, item_id);

        return "deleted : " + item_id;
    }
}
