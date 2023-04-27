package com.example.springbackendv2.service;

import com.example.springbackendv2.model.Note;

import java.util.List;

public interface NoteService {


    Note getLatestNoteByUserId(Long userId);

    List<Note> getAllNotesByUserId(Long userId);

    void updateNoteText(Long noteId, String text);

    Note saveOrUpdateNote(Note note);
}
