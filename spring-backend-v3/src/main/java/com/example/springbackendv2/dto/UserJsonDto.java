package com.example.springbackendv2.dto;

import java.util.ArrayList;

// PURPOSE: for returning a json of a users directory tree

public class UserJsonDto {
    Long id;
    String name;
    String pathname;
    String type;
    String visibility;
    String permissions;
    String dataUrl;
    ArrayList<UserJsonDto> items;

    public String getDataUrl() {
        return dataUrl;
    }

    public void setDataUrl(String dataUrl) {
        this.dataUrl = dataUrl;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPathname() {
        return pathname;
    }

    public void setPathname(String pathname) {
        this.pathname = pathname;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getVisibility() {
        return visibility;
    }

    public void setVisibility(String visibility) {
        this.visibility = visibility;
    }

    public String getPermissions() {
        return permissions;
    }

    public void setPermissions(String permissions) {
        this.permissions = permissions;
    }

    public ArrayList<UserJsonDto> getItems() {
        return items;
    }

    public void setItems(ArrayList<UserJsonDto> items) {
        this.items = items;
    }
}
