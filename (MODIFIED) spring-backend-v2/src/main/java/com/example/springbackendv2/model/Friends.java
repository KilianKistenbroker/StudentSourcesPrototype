package com.example.springbackendv2.model;

import org.hibernate.annotations.RowId;

import javax.persistence.*;

@Entity
@Table(name = "Friends")
public class Friends {

    //    NOTE: generic user data... should be updated later
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long fk_user_id;
    private Long fk_friend_id;


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

    public Long getFk_friend_id() {
        return fk_friend_id;
    }

    public void setFk_friend_id(Long fk_friend_id) {
        this.fk_friend_id = fk_friend_id;
    }
}
