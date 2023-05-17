package com.example.springbackendv2.model;

import javax.persistence.*;

@Entity
@Table(name = "ChatMembers")
public class ChatMembers {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long fk_member_id;
    private Long fk_group_id;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getFk_member_id() {
        return fk_member_id;
    }

    public void setFk_member_id(Long fk_member_id) {
        this.fk_member_id = fk_member_id;
    }

    public Long getFk_group_id() {
        return fk_group_id;
    }

    public void setFk_group_id(Long fk_group_id) {
        this.fk_group_id = fk_group_id;
    }
}
