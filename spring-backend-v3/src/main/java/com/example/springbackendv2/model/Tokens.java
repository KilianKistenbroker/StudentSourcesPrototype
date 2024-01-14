package com.example.springbackendv2.model;

import javax.persistence.Entity;
import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Tokens")
public class Tokens {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String token;

    private Long fk_user_id;

    private LocalDateTime expirationDate;

    private LocalDateTime lastUsedDate;


//    Constructor
    public Tokens() {
        this.expirationDate = LocalDateTime.now().plusHours(24); // e.g., 24 hours from now
        this.lastUsedDate = LocalDateTime.now();
    }



//    GETTERS AND SETTERS

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Long getFk_user_id() {
        return fk_user_id;
    }

    public void setFk_user_id(Long fk_user_id) {
        this.fk_user_id = fk_user_id;
    }

    public LocalDateTime getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(LocalDateTime expirationDate) {
        this.expirationDate = expirationDate;
    }

    public LocalDateTime getLastUsedDate() {
        return lastUsedDate;
    }

    public void setLastUsedDate(LocalDateTime lastUsedDate) {
        this.lastUsedDate = lastUsedDate;
    }
}
