//package com.example.springbackendv2.service;
//
//import com.amazonaws.services.s3.AmazonS3;
//import com.amazonaws.services.s3.model.PutObjectRequest;
//import com.amazonaws.services.s3.model.S3Object;
//import com.amazonaws.services.s3.model.S3ObjectInputStream;
//import com.amazonaws.util.IOUtils;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Service;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.io.File;
//import java.io.FileOutputStream;
//import java.io.IOException;
//
//@Service
//public class StorageService {
//
//    @Value("${application.bucket.name}")
//    private String bucketName;
//
//    @Autowired
//    private AmazonS3 s3Client;
//
//    public String uploadFile(MultipartFile file) {
//        File fileObject = convertMultiPartFileToFile(file);
//
////        this filename is adjusted to ensure uniqueness
//        String filename = System.currentTimeMillis() + "-" + file.getOriginalFilename();
//        s3Client.putObject(new PutObjectRequest(bucketName, filename, fileObject));
//        fileObject.delete();
//
//        return "File uploaded: " + filename;
//    }
//
//    public byte[] downloadFile(String fileName) {
//        S3Object s3Object = s3Client.getObject(bucketName, fileName);
//        S3ObjectInputStream inputStream = s3Object.getObjectContent();
//
//        try {
//            byte[] content = IOUtils.toByteArray(inputStream);
//            return content;
//        } catch (IOException e) {
//            throw new RuntimeException(e);
//        }
//    }
//
//    public String deleteFile(String fileName) {
//        s3Client.deleteObject(bucketName, fileName);
//        return fileName + " removed";
//    }
//
//    private File convertMultiPartFileToFile(MultipartFile file) {
//        File convertedFile = new File(file.getOriginalFilename());
//        try (FileOutputStream fos = new FileOutputStream(convertedFile)) {
//            fos.write(file.getBytes());
//        } catch (IOException e) {
//            throw new RuntimeException(e); // add exception logging for this service later
//        }
//
//        return convertedFile;
//    }
//}
