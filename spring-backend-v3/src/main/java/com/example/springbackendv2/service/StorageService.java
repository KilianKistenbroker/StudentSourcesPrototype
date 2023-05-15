package com.example.springbackendv2.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import com.amazonaws.util.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

@Service
public class StorageService {

    @Value("${application.bucket1.name1}")
    private String fileBucket;

    @Value("${application.bucket2.name2}")
    private String JsonBucket;

    @Autowired
    private AmazonS3 s3Client1;

    @Autowired
    private AmazonS3 s3Client2;

    public String uploadFile(MultipartFile file, String key) {
        File fileObject = convertMultiPartFileToFile(file);
        s3Client1.putObject(new PutObjectRequest(fileBucket, key, fileObject));
        fileObject.delete();

        return "File uploaded: " + file.getOriginalFilename() + " as " + key;
    }

    public String uploadJson(MultipartFile file, String key) {
        File fileObject = convertMultiPartFileToFile(file);
        s3Client2.putObject(new PutObjectRequest(JsonBucket, key, fileObject));
        fileObject.delete();

        return "File uploaded: " + file.getOriginalFilename() + " as " + key;
    }

    public byte[] downloadFile(String fileName) {
        S3Object s3Object = s3Client1.getObject(fileBucket, fileName);
        S3ObjectInputStream inputStream = s3Object.getObjectContent();

        try {
            byte[] content = IOUtils.toByteArray(inputStream);
            return content;
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public byte[] downloadJson(String fileName) {
        S3Object s3Object = s3Client2.getObject(JsonBucket, fileName);
        S3ObjectInputStream inputStream = s3Object.getObjectContent();

        try {
            byte[] content = IOUtils.toByteArray(inputStream);
            return content;
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public String deleteFile(String fileName) {
        s3Client1.deleteObject(fileBucket, fileName);
        return fileName + " removed";
    }

    public String deleteJson(String fileName) {
        s3Client2.deleteObject(JsonBucket, fileName);
        return fileName + " removed";
    }

    private File convertMultiPartFileToFile(MultipartFile file) {
        File convertedFile = new File(file.getOriginalFilename());
        try (FileOutputStream fos = new FileOutputStream(convertedFile)) {
            fos.write(file.getBytes());
        } catch (IOException e) {
            throw new RuntimeException(e); // add exception logging for this service later
        }

        return convertedFile;
    }

}