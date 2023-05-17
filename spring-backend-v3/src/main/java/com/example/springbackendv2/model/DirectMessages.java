package com.example.springbackendv2.model;

import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "DirectMessages")
public class DirectMessages {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @CreationTimestamp
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Temporal(TemporalType.DATE)
    private Date message_date;

    private String message;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Date getMessage_date() {
        return message_date;
    }

    public void setMessage_date(Date message_date) {
        this.message_date = message_date;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Long getFk_group_id() {
        return fk_group_id;
    }

    public void setFk_group_id(Long fk_group_id) {
        this.fk_group_id = fk_group_id;
    }

    public Long getFk_user_id() {
        return fk_user_id;
    }

    public void setFk_user_id(Long fk_user_id) {
        this.fk_user_id = fk_user_id;
    }

    private Long fk_group_id;

    private Long fk_user_id;
}