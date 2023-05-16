package com.example.springbackendv2.controller;


import com.amazonaws.services.s3.model.S3Object;
import com.example.springbackendv2.service.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.example.springbackendv2.model.FileMetadata;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@RestController
public class StorageController {

    @Autowired
    private StorageService service;

    @PostMapping(value = "/uploadFile/{key}")
    public ResponseEntity<String> uploadFile(@RequestParam(value = "file") MultipartFile file,
                                             @PathVariable("key") String key) {

        return new ResponseEntity<>(service.uploadFile(file, key), HttpStatus.OK);
    }

    @GetMapping("/downloadFile/{fileName}")
    public ResponseEntity<ByteArrayResource> downloadFile(@PathVariable String fileName) {
        byte[] data = service.downloadFile(fileName);
        ByteArrayResource resource = new ByteArrayResource(data);

        return ResponseEntity
                .ok()
                .contentLength(data.length)
                .header("Content-type", "application/octet-stream")
                .header("Content-disposition, ", "attachment; filename=\"" + fileName + "\"")
                .body(resource);
    }


    @RequestMapping(value = "/streamVideo/{fileName}")
    public ResponseEntity<Object> streamVideo(@PathVariable String fileName, HttpServletRequest request, HttpServletResponse response) {

        return service.streamFile(fileName, request, response);
    }

    @DeleteMapping("/deleteFile/{fileName}")
    public ResponseEntity<String> deleteFile(@PathVariable String fileName) {
        return new ResponseEntity<>(service.deleteFile(fileName), HttpStatus.OK);
    }
}

