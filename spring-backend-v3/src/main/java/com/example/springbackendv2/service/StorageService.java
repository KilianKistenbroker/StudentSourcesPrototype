package com.example.springbackendv2.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.*;
import com.amazonaws.util.IOUtils;
import com.example.springbackendv2.config.StorageConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class StorageService {

//    @Value("${aws.s3.bucket}")
//    private String bucketName;
//
//    @Autowired
//    private StorageConfig s3Client;

    @Value("${application.bucket.name}")
    private String bucketName;

    @Autowired
    private AmazonS3 s3Client;

    private static final String trashFolder = "trash/";

    public String uploadFile(MultipartFile file) {
        File fileObject = convertMultiPartFileToFile(file);

//        this filename is adjusted to ensure uniqueness
        String filename = System.currentTimeMillis() + "-" + file.getOriginalFilename();
        s3Client.putObject(new PutObjectRequest(bucketName, filename, fileObject));
        fileObject.delete();

        return "File uploaded: " + filename;
    }

    public byte[] downloadFile(String fileName) {
        S3Object s3Object = s3Client.getObject(bucketName, fileName);
        S3ObjectInputStream inputStream = s3Object.getObjectContent();

        try {
            byte[] content = IOUtils.toByteArray(inputStream);
            return content;
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public void deleteFile(String fileName) {
        //designating a path of the targeted file
        String trashedFile = trashFolder+fileName;

        //creating a copy of the original file and placing in the trash folder
        CopyObjectRequest copyObjectRequest = new CopyObjectRequest(bucketName, fileName, bucketName, trashedFile);
        s3Client.copyObject(copyObjectRequest);

        //deleting the original file
        s3Client.deleteObject(bucketName, fileName);
        //return fileName + " removed";
    }

    public void emptyTrash(){
        //Making a list of all the files in the trash bin
        ObjectListing listings = s3Client.listObjects(bucketName, trashFolder);
        List<S3ObjectSummary> summaries = listings.getObjectSummaries();

        //Selecting each of the files that are to be purged
        List<String> deletedFiles = new ArrayList<>();
        for (S3ObjectSummary summary : summaries) {
            deletedFiles.add(summary.getKey());
        }

        //Deleting all files that have been selected
        if(!deletedFiles.isEmpty()){
            DeleteObjectsRequest deleteObjectsRequest = new DeleteObjectsRequest(bucketName).withKeys(deletedFiles.toArray(new String[0]));
            s3Client.deleteObjects(deleteObjectsRequest);
        }
    }

//    This will get the root folder of the user... I think.

    public ArrayList<String> getRoot(String username) {
        ListObjectsRequest listObjectsRequest = new ListObjectsRequest()
                .withBucketName(bucketName)
                .withPrefix(username).withDelimiter("");

        ObjectListing objects = s3Client.listObjects(listObjectsRequest);

        List<S3ObjectSummary> summaries = objects.getObjectSummaries();
        ArrayList<String> obj_keys = new ArrayList<>();
        for (S3ObjectSummary objectSummary : summaries){
            obj_keys.add(objectSummary.getKey());
        }
        return obj_keys;
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
