package com.example.springbackendv2.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.*;
import com.amazonaws.util.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import javax.persistence.LockTimeoutException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;

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

    public ResponseEntity<Object> streamFile(String fileName, HttpServletRequest request, HttpServletResponse response) {
        try {
            S3Object s3Object = s3Client1.getObject(fileBucket, fileName);
            S3ObjectInputStream inputStream = s3Object.getObjectContent();

            long contentLength = s3Object.getObjectMetadata().getContentLength();
            int bufferSize = 1024;
            byte[] buffer = new byte[bufferSize];

            String rangeHeader = request.getHeader(HttpHeaders.RANGE);
            if (rangeHeader != null) {
                String[] rangeValues = rangeHeader.replace("bytes=", "").split("-");
                long startRange = Long.parseLong(rangeValues[0]);
                long endRange = contentLength - 1;

                if (rangeValues.length == 2) {
                    endRange = Long.parseLong(rangeValues[1]);
                }

                long requestedBytes = endRange - startRange + 1;

                response.setStatus(HttpServletResponse.SC_PARTIAL_CONTENT);
                response.setHeader(HttpHeaders.CONTENT_RANGE, "bytes " + startRange + "-" + endRange + "/" + contentLength);
                response.setHeader(HttpHeaders.ACCEPT_RANGES, "bytes");
                response.setContentLengthLong(requestedBytes);

                inputStream.skip(startRange);
            } else {
                response.setStatus(HttpServletResponse.SC_OK);
                response.setHeader(HttpHeaders.ACCEPT_RANGES, "bytes");
                response.setHeader(HttpHeaders.CONTENT_LENGTH, String.valueOf(contentLength));
            }

            OutputStream outputStream = response.getOutputStream();
            int bytesRead;
            while ((bytesRead = inputStream.read(buffer)) != -1) {
                outputStream.write(buffer, 0, bytesRead);
            }

            outputStream.flush();
            outputStream.close();
            inputStream.close();
        } catch (IOException e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(HttpStatus.OK);
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