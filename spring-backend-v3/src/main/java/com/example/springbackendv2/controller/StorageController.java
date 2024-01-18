package com.example.springbackendv2.controller;

import com.example.springbackendv2.model.FileMetadata;
import com.example.springbackendv2.repository.FileMetadataRepository;
import com.example.springbackendv2.service.StorageService;
import com.example.springbackendv2.service.TokensService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Objects;

@RestController
public class StorageController {

    @Autowired
    private StorageService storageService;
    @Autowired
    private FileMetadataRepository fileMetadataRepository;
    @Autowired
    private TokensService tokensService;

    @GetMapping("/downloadFile/{fileId}/{userId}/{token}")
    public ResponseEntity<ByteArrayResource> downloadFile(@PathVariable Long fileId,
                                                          @PathVariable Long userId,
                                                          @PathVariable String token) {
//        validate token
        boolean result = tokensService.checkAndUpdateToken(token, userId);
        if (!result) {
            System.out.println("Token not found");
            return null;
        }

//        check that file is either public or owned by userId
        FileMetadata fileMetadata = fileMetadataRepository.findById(fileId)
                .orElseThrow();

        if (!Objects.equals(fileMetadata.getFk_owner_id(), userId) && !Objects.equals(fileMetadata.getVisibility(), "Public")) {
            System.out.println("User does not have permission to access this file");
            return null;
        }

        String fileName = fileId + "." + fileMetadata.getType();
        byte[] data = storageService.downloadFile(fileName);
        ByteArrayResource resource = new ByteArrayResource(data);

        return ResponseEntity
                .ok()
                .contentLength(data.length)
                .header("Content-type", "application/octet-stream")
                .header("Content-disposition", "attachment; filename=\"" + fileName + "\"")
                .body(resource);
    }

    @RequestMapping(value = "/streamVideo/{fileId}/{userId}/{token}")
    public ResponseEntity<Object> streamVideo(@PathVariable Long fileId,
                                              @PathVariable Long userId,
                                              @PathVariable String token,
                                              HttpServletRequest request, HttpServletResponse response) {

//        validate token
        boolean result = tokensService.checkAndUpdateToken(token, userId);
        if (!result) {
            System.out.println("Token not found");
            return null;
        }

//        check that file is either public or owned by userId
        FileMetadata fileMetadata = fileMetadataRepository.findById(fileId)
                .orElseThrow();

        if (!Objects.equals(fileMetadata.getFk_owner_id(), userId) && !Objects.equals(fileMetadata.getVisibility(), "Public")) {
            System.out.println("User does not have permission to access this file");
            return null;
        }

        String fileName = fileId + "." + fileMetadata.getType();
        return storageService.streamFile(fileName, request, response);
    }
}

