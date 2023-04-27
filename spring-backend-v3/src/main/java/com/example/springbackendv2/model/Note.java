package com.example.springbackendv2.model;

import javax.persistence.*;
// OLD TABLE can be deleted after front end verifies

@Entity
@Table(name ="UserNote")
public class Note {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String text;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Note(){}
    public Note(Long id, String text, User user) {
        this.id = id;
        this.text = text;
        this.user = user;
    }
}
