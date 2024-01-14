package com.example.springbackendv2.controller;

import com.example.springbackendv2.exception.UserNotFoundException;
import com.example.springbackendv2.model.FileMetadata;
import com.example.springbackendv2.repository.CommentsRepository;
import com.example.springbackendv2.repository.FileMetadataRepository;
import com.example.springbackendv2.repository.UsersRepository;
import com.example.springbackendv2.service.StorageService;
import com.example.springbackendv2.service.TokensService;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Objects;

@RestController
@CrossOrigin("http://student-sources.s3-website-us-west-1.amazonaws.com")
public class FileMetadataController {

    @Autowired
    private FileMetadataRepository fileMetadataRepository;
    @Autowired
    private StorageService storageService;

    @Autowired
    private TokensService tokensService;

    @Autowired
    CommentsRepository commentsRepository;
    @Autowired
    UsersRepository usersRepository;

    //   --------------------- BASIC POST, GET, DELETE MAPPING BY UNIQUE ID --------------------

    @PostMapping(value = "/postFile/{owner_id}/{filename}/{type}/{token}")
    Long postFile(@RequestParam(value = "file") MultipartFile file,
                  @PathVariable("owner_id") Long owner_id,
                  @PathVariable("filename") String filename,
                  @PathVariable("type") String type,
                  @PathVariable("token") String token) throws IOException {

//        TODO: Authenticate token exists with owner_id
        boolean result = tokensService.checkAndUpdateToken(token, owner_id);
        if (!result) {
            System.out.println("canceled file upload to database.");
            return -1L;
        }

        result = storageService.isExceedingStorageLimit(file, owner_id);
        if(!result) {
            System.out.println("canceled file upload to database.");
            return -2L;
        }

        FileMetadata fileMetadata = new FileMetadata();

        fileMetadata.setFk_owner_id(owner_id); // used for accessing a user's root directory from bucket.
        fileMetadata.setFilename(filename); // <- used for searching
        fileMetadata.setVisibility("Private"); // <- denotes whether this file can be searched.
        fileMetadata.setPermissions("Only you have access"); // <- allows for downloading from search area
        fileMetadata.setType(type); // allows for downloading as zip folder or file, and proper rendering.
        fileMetadata.setSize(file.getSize());

        fileMetadataRepository.save(fileMetadata);

//        uploads raw file to bucket
        if (Objects.equals(type, "mp4") || Objects.equals(type, "mov"))
            result = storageService.streamUploadFile(file.getInputStream(), fileMetadata.getId().toString() + "." + type);
        else
            result = storageService.uploadFile(file, fileMetadata.getId().toString() + "." + type);
        if (!result) {
            System.out.println("Could not upload to bucket");
            fileMetadataRepository.deleteById(fileMetadata.getId());
            return -3L;
        }

//        return positive id for front end
        return fileMetadata.getId();
    }

    @PostMapping(value = "/updateFile/{owner_id}/{fileId}/{type}/{token}")
    Long updateFile(@RequestParam(value = "file") MultipartFile file,
                  @PathVariable("owner_id") Long owner_id,
                  @PathVariable("fileId") Long fileId,
                  @PathVariable("type") String type,
                  @PathVariable("token") String token) throws IOException {

//        TODO: Authenticate token exists with owner_id
        boolean result = tokensService.checkAndUpdateToken(token, owner_id);
        if (!result) {
            System.out.println("canceled file upload to database.");
            return -1L;
        }

        result = storageService.isExceedingStorageLimit(file, owner_id);
        if(!result) {
            System.out.println("canceled file upload to database.");
            return -2L;
        }

        FileMetadata fileMetadata = fileMetadataRepository.findByIdAndUserId(fileId, owner_id);
        if (fileMetadataRepository == null) {
            System.out.println("Could not find file in database");
            return -3L;
        }

//        uploads raw file to bucket
        if (Objects.equals(type, "mp4") || Objects.equals(type, "mov"))
            result = storageService.streamUploadFile(file.getInputStream(), fileMetadata.getId().toString() + "." + type);
        else
            result = storageService.uploadFile(file, fileMetadata.getId().toString() + "." + type);
        if (!result) {
            System.out.println("Could not update file in bucket");
            return -3L;
        }

//        return positive id for front end
        return fileMetadata.getId();
    }

    @PostMapping("/postFolder/{owner_id}/{filename}/{token}")
    Long postFolder(@PathVariable("owner_id") Long owner_id,
                  @PathVariable("filename") String filename,
                  @PathVariable("token") String token) throws IOException {

//        TODO: Authenticate token exists with owner_id
        boolean result = tokensService.checkAndUpdateToken(token, owner_id);
        if (!result) {
            System.out.println("canceled file upload to database.");
            return -1L;
        }

        FileMetadata fileMetadata = new FileMetadata();

        fileMetadata.setFk_owner_id(owner_id); // used for accessing a user's root directory from bucket.
        fileMetadata.setFilename(filename); // <- used for searching
        fileMetadata.setVisibility("Private"); // <- denotes whether this file can be searched.
        fileMetadata.setPermissions("Only you have access"); // <- allows for downloading from search area
        fileMetadata.setType("Folder"); // allows for downloading as zip folder or file, and proper rendering.

        fileMetadataRepository.save(fileMetadata);

//        return positive id for front end
        return fileMetadata.getId();
    }

    @PostMapping("/insertFile/{owner_id}/{filename}/{type}/{token}")
    Long insertFile(@PathVariable("owner_id") Long owner_id,
                    @PathVariable("filename") String filename,
                    @PathVariable("type") String type,
                    @PathVariable("token") String token) throws IOException {

//        TODO: Authenticate token exists with owner_id
        boolean result = tokensService.checkAndUpdateToken(token, owner_id);
        if (!result) {
            System.out.println("canceled file upload to database.");
            return -1L;
        }

        FileMetadata fileMetadata = new FileMetadata();

        fileMetadata.setFk_owner_id(owner_id); // used for accessing a user's root directory from bucket.
        fileMetadata.setFilename(filename); // <- used for searching
        fileMetadata.setVisibility("Private"); // <- denotes whether this file can be searched.
        fileMetadata.setPermissions("Only you have access"); // <- allows for downloading from search area
        fileMetadata.setType(type); // allows for downloading as zip folder or file, and proper rendering.

        fileMetadataRepository.save(fileMetadata);

//        return positive id for front end
        return fileMetadata.getId();
    }

    @PostMapping("/createHome/{owner_id}")
    Long createHome(@PathVariable("owner_id") Long owner_id) throws IOException {

        FileMetadata fileMetadata = new FileMetadata();

        fileMetadata.setFk_owner_id(owner_id); // used for accessing a user's root directory from bucket.
        fileMetadata.setFilename("Home"); // <- used for searching
        fileMetadata.setVisibility("Private"); // <- denotes whether this file can be searched.
        fileMetadata.setPermissions("Only you have access"); // <- allows for downloading from search area
        fileMetadata.setType("Folder"); // allows for downloading as zip folder or file, and proper rendering.

        fileMetadataRepository.save(fileMetadata);

//        return positive id for front end
        return fileMetadata.getId();
    }

    @GetMapping("/searchFolder/{query}")
    List<FileMetadata> searchUser(@PathVariable String query)
    {
        String newQuery = query.replace(" ", "");
        List<FileMetadata> result = fileMetadataRepository.searchByFilename(newQuery);
        if(result.isEmpty()) {
            return null;
        }
        else {
            return ResponseEntity.status(HttpStatus.OK).body(result).getBody();
        }
    }


    @GetMapping("/getAllFiles")
    List<FileMetadata> getAllFiles(){
        return fileMetadataRepository.findAllPublicFiles();
    }

    @GetMapping("/file/{id}")
    FileMetadata getFileById(@PathVariable Long id){
        return  fileMetadataRepository.findById(id)
                .orElseThrow(()-> new UserNotFoundException(id));
    }

    @PutMapping("/file/{id}")
    FileMetadata updateFile(@RequestBody FileMetadata newFileMetadata, @PathVariable Long id){

        return fileMetadataRepository.findById(id)
                .map(fileMetadata -> {
                    fileMetadata.setFilename(newFileMetadata.getFilename());
                    fileMetadata.setVisibility(newFileMetadata.getVisibility());

                    return fileMetadataRepository.save(fileMetadata);
                }).orElseThrow(()-> new UserNotFoundException(id));
    }

    @PostMapping("/deleteFile/{fileId}/{userId}/{token}")
    String deleteFileById(@RequestParam(value = "file") MultipartFile file,
                          @PathVariable Long fileId,
                          @PathVariable Long userId,
                          @PathVariable String token) throws JsonProcessingException {

        if (!tokensService.checkAndUpdateToken(token, userId)) {
            System.out.println("Invalid Token.");
            throw new UserNotFoundException(userId);
        }

        FileMetadata fileMetadata = fileMetadataRepository.findById(fileId)
                .orElseThrow(()-> new UserNotFoundException(fileId));

//        delete comments on file
        commentsRepository.deleteByResourceId(fileId);

//        upload json in case they are not in sync with frontend.
        storageService.uploadJson(file, userId + ".json");

        //        delete file in bucket
        if (Objects.equals(fileMetadata.getType(), "Folder")) {
            //            delete folder
            String key = userId + ".json";
            System.out.println("Trying to delete children from root: " + key);
            storageService.deleteAllChildren(key, fileId, userId);
        } else {
            storageService.deleteFile(fileId, userId, fileMetadata.getType());
        }

        return "Deleted file with id: " + fileId;
    }
}
