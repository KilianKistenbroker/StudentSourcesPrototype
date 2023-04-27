package com.example.springbackendv2.controller;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ListObjectsRequest;
import com.amazonaws.services.s3.model.ObjectListing;
import com.amazonaws.services.s3.model.S3ObjectSummary;
import com.example.springbackendv2.service.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

/*
* This class will handle requests for file
* upload, download, and deletion from the
* front end. Restrictions should be implemented
* later, so that only signed-in users can
* interact with the aws s3 bucket(s).
*/

@RestController
@RequestMapping("/file")
public class StorageController {

    @Autowired
    private StorageService service;

//    @Autowired
//    private AmazonS3 s3Client;
//
//    @Value("${aws.s3.bucket}")
//    private String bucketName;

    /* This function will handle file upload requests */
    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam(value = "file") MultipartFile file) {
        return new ResponseEntity<>(service.uploadFile(file), HttpStatus.OK);
    }

    /* This function will handle file download requests */
    @GetMapping("/download/{fileName}")
    public ResponseEntity<ByteArrayResource> downloadFile(@PathVariable String fileName) {

//        ----------

        byte[] data = service.downloadFile(fileName);
        ByteArrayResource resource = new ByteArrayResource(data);

        return ResponseEntity
                .ok()
                .contentLength(data.length)
                .header("Content-type", "application/octet-stream")
                .header("Content-disposition, ", "attachment; filename=\"" + fileName + "\"")
                .body(resource);
    }

    /* This function will handle file deletion requests */
    @DeleteMapping("/delete/{fileName}")
    public ResponseEntity<String> deleteFile(@PathVariable String fileName) {
        service.deleteFile(fileName);
        return new ResponseEntity<>("File deleted successfully", HttpStatus.OK);
    }

    @DeleteMapping("/trash")
    public ResponseEntity<String> emptyTrash(){
        service.emptyTrash();
        return new ResponseEntity<>("Trash emptied successfully", HttpStatus.OK);
    }

    /* This endpoint loads the user's saved file directory
    *  The object keys (bucket paths) are returned as an array*/
    @GetMapping("/getUserDir/{userName}")
    public ArrayList<String> listBucket(@PathVariable String userName) {
        return service.getRoot(userName);
    }
}
