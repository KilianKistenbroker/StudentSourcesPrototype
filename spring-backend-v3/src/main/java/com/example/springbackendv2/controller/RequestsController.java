package com.example.springbackendv2.controller;

import com.example.springbackendv2.exception.UserNotFoundException;
import com.example.springbackendv2.model.Friends;
import com.example.springbackendv2.model.Requests;
import com.example.springbackendv2.model.User;
import com.example.springbackendv2.repository.FriendsRepository;
import com.example.springbackendv2.repository.RequestsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class RequestsController {
    @Autowired
    private RequestsRepository requestsRepository;


    //   --------------------- BASIC POST, GET, DELETE MAPPING BY UNIQUE ID --------------------


    @PostMapping("/request")
    Requests requests(@RequestBody Requests requests){
        return requestsRepository.save(requests);
    }

    @GetMapping("/requests")
    List<Requests> getAllRequests(){
        return requestsRepository.findAll();
    }

    @GetMapping("/requests/{id}")
    Requests getRequestsById(@PathVariable Long id){
        return  requestsRepository.findById(id)
                .orElseThrow(()-> new UserNotFoundException(id));
    }

    @DeleteMapping("/requests/{id}")
    String deleteRequestById(@PathVariable Long id){
        if(!requestsRepository.existsById(id)){
            throw new UserNotFoundException(id);
        }

        requestsRepository.deleteById(id);
        return "Deleted requests with id: " + id;
    }


    //   --------------------- MODIFIED MAPPING (refer to RequestRepository for more info) --------------------


    @GetMapping(value = "/getSent/{user_id}")
    List<Requests> getSentReq(@PathVariable("user_id") Long user_id) {
        List<Requests> res = requestsRepository.getSent(user_id);
        return ResponseEntity.status(HttpStatus.OK).body(res).getBody();
    }

    @DeleteMapping("/deleteRequest/{receiver_id}/{sender_id}")
    String deleteRequest(@PathVariable("receiver_id") Long receiver_id, @PathVariable("sender_id") Long sender_id){
        requestsRepository.deleteRequest(receiver_id, sender_id);
        return "Deleted pending req from : " + receiver_id + ".Deleted by : " + sender_id;
    }
}
