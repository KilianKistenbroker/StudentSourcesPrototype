package com.example.springbackendv2.model;

import javax.persistence.*;

@Entity
@Table(name = "FileMetadata")
public class FileMetadata {

    // NOTE: this also includes folders.

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long fk_owner_id;
    private Long fk_comments_id;
    private Long fk_chatbot_id;
    private String filename;
    private String visibility;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getFk_owner_id() {
        return fk_owner_id;
    }

    public void setFk_owner_id(Long fk_owner_id) {
        this.fk_owner_id = fk_owner_id;
    }

    public Long getFk_comments_id() {
        return fk_comments_id;
    }

    public void setFk_comments_id(Long fk_comments_id) {
        this.fk_comments_id = fk_comments_id;
    }

    public Long getFk_chatbot_id() {
        return fk_chatbot_id;
    }

    public void setFk_chatbot_id(Long fk_chatbot_id) {
        this.fk_chatbot_id = fk_chatbot_id;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public String getVisibility() {
        return visibility;
    }

    public void setVisibility(String visibility) {
        this.visibility = visibility;
    }
}
