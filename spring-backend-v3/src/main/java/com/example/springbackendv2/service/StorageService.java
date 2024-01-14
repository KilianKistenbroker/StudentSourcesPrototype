package com.example.springbackendv2.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.*;
import com.amazonaws.util.IOUtils;
import com.example.springbackendv2.dto.UserJsonDto;
import com.example.springbackendv2.exception.UserNotFoundException;
import com.example.springbackendv2.repository.FileMetadataRepository;
import com.example.springbackendv2.repository.UsersRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.Map;
import java.util.Objects;

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

    @Autowired
    private UsersRepository usersRepository;
    @Autowired
    private FileMetadataRepository fileMetadataRepository;

    public boolean uploadFile(MultipartFile file, String key) {
        try {
            File fileObject = convertMultiPartFileToFile(file);
            s3Client1.putObject(new PutObjectRequest(fileBucket, key, fileObject));
            fileObject.delete();
            System.out.println("File uploaded: " + file.getOriginalFilename() + " as " + key);
            return true;
        } catch (Exception e) {
            System.out.println("upload file threw exception: " + e);
            return false;
        }
    }

    public boolean streamUploadFile(InputStream inputStream, String key) {
        try {
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(inputStream.available()); // Set the content length explicitly
            s3Client1.putObject(new PutObjectRequest(fileBucket, key, inputStream, metadata));
            return true;
        } catch (IOException e) {
            // Handle the exception appropriately
            System.out.println("Failed to read the input stream: " + e.getMessage());
            return false;
        } catch (AmazonS3Exception e) {
            // Handle the exception appropriately
            System.out.println("Failed to read the input stream: " + e.getMessage());
            return false;
        }
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

    public String deleteFile(Long fileId, Long userId, String type) {
        String key = fileId + "." + type;
        System.out.println("trying to remove: " + key + " from bucket");

//        TODO: retrieve size from database instead and removed from current occupied space
        Long dataSize = fileMetadataRepository.findById(fileId)
                .orElseThrow(()-> new UserNotFoundException(fileId)).getSize();

        usersRepository.findById(userId)
                .map(user -> {
                    user.checkAndRemoveOccupiedSpace(dataSize);
                    return usersRepository.save(user);
                }).orElseThrow(()-> new UserNotFoundException(userId));

//        remove from database
        fileMetadataRepository.deleteById(fileId);

        s3Client1.deleteObject(fileBucket, key);
        System.out.println(key + " removed");
        return key + " removed";
    }

//    used for deleting user account
    public String deleteFileOnly(Long fileId, String type) {
        String key = fileId + "." + type;
        s3Client1.deleteObject(fileBucket, key);
        System.out.println(key + " removed");
        return key + " removed";
    }

    public String deleteJson(String fileName) {
        s3Client2.deleteObject(JsonBucket, fileName);
        return fileName + " removed";
    }

    public ResponseEntity<Object> streamFile(String fileName, HttpServletRequest request, HttpServletResponse response) {
        try {
            S3Object s3Object = s3Client1.getObject(fileBucket, fileName);
            S3ObjectInputStream inputStream = s3Object.getObjectContent();

            String contentType = getContentType(fileName);
            response.setHeader(HttpHeaders.CONTENT_TYPE, contentType);

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


    private String getContentType(String fileName) {
        // Get the file extension
        String fileExtension = FilenameUtils.getExtension(fileName);

        // Determine the Content-Type based on the file extension
        switch (fileExtension.toLowerCase()) {
            case "mp4":
                return "video/mp4";
            case "mov":
                return "video/quicktime";
            case "avi":
                return "video/x-msvideo";
            // Add more cases for other supported video file types
            default:
                return "application/octet-stream"; // Default MIME type if the file extension is not recognized
        }
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

    public boolean isExceedingStorageLimit(MultipartFile file, Long userId) throws IOException {
        Long dataSize = (long) file.getBytes().length;
        return usersRepository.findById(userId)
                .map(user -> {
                    if(!user.checkAndAddOccupiedSpace(dataSize)) {
                        System.out.println("Exceeded storage limit.");
                        return false;
                    } else {
                        usersRepository.save(user);
                        return true;
                    }
                }).orElseThrow(()-> new UserNotFoundException(userId));
    }

    JsonNode GLOBALJSON2;


    public void deleteAllFiles(String key) throws JsonProcessingException {
        byte[] data = downloadJson(key);
        // Convert the byte array to a string
        String jsonString = new String(data, StandardCharsets.UTF_8);
        // Create an ObjectMapper
        ObjectMapper mapper = new ObjectMapper();
        // Parse the JSON
        JsonNode jsonNode = mapper.readTree(jsonString);
//        traverse will delete every raw file from bucket
        UserJsonDto userJsonDto = traverseAndDeleteFilesOnly(jsonNode);
    }

    public void deleteAllChildren(String key, Long targetId, Long userId) throws JsonProcessingException {

        byte[] data = downloadJson(key);
        // Convert the byte array to a string
        String jsonString = new String(data, StandardCharsets.UTF_8);
        // Create an ObjectMapper
        ObjectMapper mapper = new ObjectMapper();
        // Parse the JSON
        JsonNode jsonNode = mapper.readTree(jsonString);
        JsonNode userJsonDto = copyChildNode(jsonNode, targetId);
        UserJsonDto filterChild = traverse(GLOBALJSON2, userId);
    }


    private JsonNode copyChildNode(JsonNode node, Long targetId) {

        if (node.isObject()) {
            ObjectNode objectNode = (ObjectNode) node;
            Iterator<Map.Entry<String, JsonNode>> iter = objectNode.fields();

            while (iter.hasNext()) {
                Map.Entry<String, JsonNode> entry = iter.next();
                String fieldName = entry.getKey();
                JsonNode fieldValue = entry.getValue();

                if ("id".equals(fieldName) && fieldValue.asLong() == targetId) {
                    // Return a copy of the entire object if the id matches the targetId
                    return traverseTree(node.deepCopy());
                } else if ("items".equals(fieldName) && fieldValue.isArray()) {
                    ArrayNode copiedItems = objectNode.putArray("items");
                    ArrayNode arrayNode = (ArrayNode) fieldValue;

                    for (JsonNode arrayElement : arrayNode) {
                        if (arrayElement != null) { // Added null check
                            JsonNode copiedItem = copyChildNode(arrayElement, targetId);
                            if (copiedItem != null) {
                                copiedItems.add(copiedItem);
                            }
                        }
                    }
                }
            }
        }

        return null;
    }

    private JsonNode traverseTree(JsonNode node) {
        ObjectNode copiedNode = JsonNodeFactory.instance.objectNode();

        if (node != null && node.isObject()) {
            ObjectNode objectNode = (ObjectNode) node;
            Iterator<Map.Entry<String, JsonNode>> iter = objectNode.fields();

            while (iter.hasNext()) {
                Map.Entry<String, JsonNode> entry = iter.next();
                String fieldName = entry.getKey();
                JsonNode fieldValue = entry.getValue();

                copiedNode.set(fieldName, fieldValue.deepCopy());
            }
        }

//        WORKAROUND IMPLEMENTATION
        GLOBALJSON2 = copiedNode;
        return copiedNode;
    }

    private UserJsonDto traverse(JsonNode node, Long userId) {
        UserJsonDto userJsonDto = new UserJsonDto();

        if (node.isObject()) {
            ObjectNode objectNode = (ObjectNode) node;
            Iterator<Map.Entry<String, JsonNode>> iter = objectNode.fields();

            Long id = null;
            String type = null;

            while (iter.hasNext()) {
                Map.Entry<String, JsonNode> entry = iter.next();
                String fieldName = entry.getKey();
                JsonNode fieldValue = entry.getValue();


                if ("id".equals(fieldName)) {
                    id = fieldValue.asLong();
                    userJsonDto.setId(fieldValue.asLong());
                } else if ("type".equals(fieldName)) {
                    type = fieldValue.asText();
                    userJsonDto.setType(fieldValue.asText());
                } else if ("items".equals(fieldName)) {
                    if (fieldValue.isArray()) {
                        ArrayList<UserJsonDto> items = new ArrayList<>();
                        ArrayNode arrayNode = (ArrayNode) fieldValue;

                        for (JsonNode arrayElement : arrayNode) {
                            UserJsonDto item = traverse(arrayElement, userId);
                            if (item.getVisibility() != null) {
                                items.add(item);
                            }
                        }
                        userJsonDto.setItems(items);
                    }
                }
            }

            if (!Objects.equals(type, "Folder") && id != null) {
                String fileKey = id + "." + type;
                System.out.println("trying to delete dile: " + fileKey);
                deleteFile(id, userId, type);

//                id is > 0 so that trash bin is not deleted, b/c trash bin folder is not saved anywhere.
            } else if (Objects.equals(type, "Folder") && id != null && id > 0) {
                System.out.println("trying to delete folder in database: " + id);
                fileMetadataRepository.deleteById(id);
            }
        }

        return userJsonDto;
    }

//    This is for account deletion
    private UserJsonDto traverseAndDeleteFilesOnly(JsonNode node) {
        UserJsonDto userJsonDto = new UserJsonDto();

        if (node.isObject()) {
            ObjectNode objectNode = (ObjectNode) node;
            Iterator<Map.Entry<String, JsonNode>> iter = objectNode.fields();

            Long id = null;
            String type = null;

            while (iter.hasNext()) {
                Map.Entry<String, JsonNode> entry = iter.next();
                String fieldName = entry.getKey();
                JsonNode fieldValue = entry.getValue();


                if ("id".equals(fieldName)) {
                    id = fieldValue.asLong();
                    userJsonDto.setId(fieldValue.asLong());
                } else if ("type".equals(fieldName)) {
                    type = fieldValue.asText();
                    userJsonDto.setType(fieldValue.asText());
                } else if ("items".equals(fieldName)) {
                    if (fieldValue.isArray()) {
                        ArrayList<UserJsonDto> items = new ArrayList<>();
                        ArrayNode arrayNode = (ArrayNode) fieldValue;

                        for (JsonNode arrayElement : arrayNode) {
                            UserJsonDto item = traverseAndDeleteFilesOnly(arrayElement);
                            if (item.getVisibility() != null) {
                                items.add(item);
                            }
                        }
                        userJsonDto.setItems(items);
                    }
                }
            }

            if (!Objects.equals(type, "Folder") && id != null) {
                String fileKey = id + "." + type;
                System.out.println("trying to delete dile: " + fileKey);
                deleteFileOnly(id, type);
            }
        }

        return userJsonDto;
    }
}