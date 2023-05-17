package com.example.springbackendv2.dto;

import java.util.Date;

// NOTE: this data transfer object will be used for Direct Messaging and Commenting

public class MessengerDto {
    Long id;
    String message;
    Date date_posted;
    String user;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Date getDate_posted() {
        return date_posted;
    }

    public void setDate_posted(Date date_posted) {
        this.date_posted = date_posted;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }
}


