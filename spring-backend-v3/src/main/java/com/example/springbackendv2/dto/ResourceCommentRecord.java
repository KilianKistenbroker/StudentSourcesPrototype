package com.example.springbackendv2.dto;

import java.util.Date;

public record ResourceCommentRecord(
        int commentID,
        String comment,
        Date commentDate,
        String username,
        byte[] userImage
){}
