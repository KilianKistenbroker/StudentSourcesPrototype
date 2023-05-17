package com.example.springbackendv2.dto;

public class GroupInfoDto {
    private Long id;
    private String groupName;
    private Long totalMembers;

    private Long fk_owner_id;


    public Long getFk_owner_id() {
        return fk_owner_id;
    }

    public void setFk_owner_id(Long fk_owner_id) {
        this.fk_owner_id = fk_owner_id;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public Long getTotalMembers() {
        return totalMembers;
    }

    public void setTotalMembers(Long totalMembers) {
        this.totalMembers = totalMembers;
    }
}
