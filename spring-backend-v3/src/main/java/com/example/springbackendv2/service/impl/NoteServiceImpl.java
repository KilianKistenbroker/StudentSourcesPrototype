package com.example.springbackendv2.service.impl;

import com.example.springbackendv2.model.Note;
import com.example.springbackendv2.repository.NoteRepository;
import com.example.springbackendv2.service.NoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NoteServiceImpl implements NoteService {

    @Autowired
    NoteRepository repository;
    @Override
    public Note getLatestNoteByUserId(Long userId) {
        return repository.findLatestNoteByUserId(userId);
    }

    @Override
    public List<Note> getAllNotesByUserId(Long userId) {
        return repository.findAllByUserId(userId);
    }

    @Override
    public void updateNoteText(Long noteId, String text) {
        repository.updateNoteTextById(noteId, text);
    }

    @Override
    public Note saveOrUpdateNote(Note note) {
        return repository.save(note);
    }
}
