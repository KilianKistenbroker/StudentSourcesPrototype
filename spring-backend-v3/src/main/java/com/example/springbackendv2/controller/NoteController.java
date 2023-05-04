package com.example.springbackendv2.controller;

import com.example.springbackendv2.model.Note;
import com.example.springbackendv2.service.impl.NoteServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class NoteController {

    @Autowired
    NoteServiceImpl noteService;

    @GetMapping("/note/latest/{user_id}")
    Note getLatestNoteByUserId(@PathVariable("user_id") Long userId){
        return noteService.getLatestNoteByUserId(userId);
    }

    @GetMapping("/note/all/{user_id}")
    List<Note> getAllNotesByUserId(@PathVariable("user_id") Long userId){
        return noteService.getAllNotesByUserId(userId);
    }

    @PostMapping("/note")
    Note createNote(@RequestBody Note note){
        return noteService.saveOrUpdateNote(note);
    }

    @PutMapping("/note")
    Note updateNote(@RequestBody Note note){
        return noteService.saveOrUpdateNote(note);
    }

    @PutMapping("/note/{note_id}")
    void updateNote(@RequestBody String text, @PathVariable("note_id") Long noteId){
        noteService.updateNoteText(noteId, text);
    }
}
