package com.example.springbackendv2.model;

import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.util.Date;

// NEW TABLE

@Entity
@Table(name = "Comments")
public class Comments {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "commentID", nullable = false, unique = true)
    private int commentID;

    @Column(name = "comment", nullable = false, columnDefinition = "TINYTEXT")
    private String comment;

    @CreationTimestamp
    @Column(name = "commentDate", nullable = false)
    @Temporal(TemporalType.DATE)
    private Date commentDate;

    @Column(name = "resourceID", nullable = false)
    private int resourceID;

    @ManyToOne
    @JoinColumn(name = "userID", nullable = false)
    private Users user;

    public int getCommentID() {
        return commentID;
    }

    public void setCommentID(int commentID) {
        this.commentID = commentID;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Date getCommentDate() {
        return commentDate;
    }

    public void setCommentDate(Date commentDate) {
        this.commentDate = commentDate;
    }

    public int getResourceID() {
        return resourceID;
    }

    public void setResourceID(int resourceID) {
        this.resourceID = resourceID;
    }

    public Users getRegisteredUser() {
        return user;
    }

    public void setRegisteredUser(Users registeredUser) {
        this.user = registeredUser;
    }
}
