package com.example.springbackendv2.repository;

import com.example.springbackendv2.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Long> {

    @Query(value = "select n from user_note n WHERE n.user_id = :userId", nativeQuery = true)
    List<Note> findAllByUserId(@Param("userId") Long userId);

    @Query(value = "select n from user_note n WHERE n.user_id = :userId ODER BY id DESC LIMIT 1", nativeQuery = true)
    Note findLatestNoteByUserId(@Param("userId") Long userId);

    @Query(value = "update user_note n set n.text = :text WHERE n.id = :id", nativeQuery = true)
    void updateNoteTextById(@Param("id") Long id, @Param("text")  String text);
}
