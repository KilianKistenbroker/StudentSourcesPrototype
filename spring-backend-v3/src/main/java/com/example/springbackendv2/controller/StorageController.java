package com.example.springbackendv2.controller;

import com.example.springbackendv2.service.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@RestController
@CrossOrigin("http://student-sources.s3-website-us-west-1.amazonaws.com")
public class StorageController {

    @Autowired
    private StorageService service;

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
}

