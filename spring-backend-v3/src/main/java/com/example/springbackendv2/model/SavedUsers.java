package com.example.springbackendv2.model;

import javax.persistence.*;

@Entity
@Table(name = "SavedUsers")
public class SavedUsers {

    //    NOTE: generic user data... should be updated later
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long fk_user_id;
    private Long fk_item_id;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getFk_user_id() {
        return fk_user_id;
    }

    public void setFk_user_id(Long fk_user_id) {
        this.fk_user_id = fk_user_id;
    }

    public Long getFk_item_id() {
        return fk_item_id;
    }

    public void setFk_item_id(Long fk_item_id) {
        this.fk_item_id = fk_item_id;
    }
}