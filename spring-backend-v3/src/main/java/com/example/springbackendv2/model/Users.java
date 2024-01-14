package com.example.springbackendv2.model;
import javax.persistence.*;

@Entity
@Table(name = "Users")
public class Users {

//    NOTE: generic user data... should be updated later
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String user; // <- username
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private Long occupiedSpace;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }


    // Default constructor
    public Users() {
        this.occupiedSpace = 0L;
    }

    public Long getOccupiedSpace() {
        return occupiedSpace;
    }

    public void setOccupiedSpace(Long occupiedSpace) {
        this.occupiedSpace = occupiedSpace;
    }

    public boolean checkAndAddOccupiedSpace(Long size) {
        if (this.occupiedSpace + size > 1_073_741_824) {
            return false;
        } else {
            this.occupiedSpace += size;
            return true;
        }
    }

    public boolean checkAndRemoveOccupiedSpace(Long size) {
        if ( this.occupiedSpace - size < 0) {
            this.occupiedSpace = 0L;
        }  else {
            this.occupiedSpace -= size;
        }
        return true;
    }
}

