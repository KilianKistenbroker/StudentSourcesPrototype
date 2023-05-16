package com.example.springbackendv2.controller;

import com.example.springbackendv2.exception.UserNotFoundException;
import com.example.springbackendv2.model.FileMetadata;
import com.example.springbackendv2.repository.FileMetadataRepository;
import com.example.springbackendv2.service.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
public class FileMetadataController {

    @Autowired
    private FileMetadataRepository fileMetadataRepository;
    @Autowired
    private StorageService service;

    //   --------------------- BASIC POST, GET, DELETE MAPPING BY UNIQUE ID --------------------

    @PostMapping("/postFile/{owner_id}/{filename}")
    Long postFile(@PathVariable("owner_id") Long owner_id,
                  @PathVariable("filename") String filename){

//        TODO: restrict filename length here

        FileMetadata fileMetadata = new FileMetadata();
        fileMetadata.setFk_owner_id(owner_id); // used for accessing a user's root directory from bucket.
        fileMetadata.setFk_comments_id(-1L);  // handle insert later. used for attaching unique comments per file
        fileMetadata.setFk_chatbot_id(-1L);   // handle insert later. used for attaching unique chatbot per file
        fileMetadata.setFilename(filename); // <- used for searching
        fileMetadata.setVisibility("Private"); // <- denotes whether this file can be searched.

        fileMetadataRepository.save(fileMetadata);
        return fileMetadata.getId();
    }

    @PostMapping(value = "/attachFile/{owner_id}/{filename}/{media_type}") // media type may not be necessary or usable.
    public ResponseEntity<String> uploadFile(@RequestParam(value = "file") MultipartFile file,
                                             @PathVariable("owner_id") Long owner_id,
                                             @PathVariable("filename") String filename,
                                             @PathVariable("media_type") String media_type) {

//        posts file to db table here, and then receives a unique id, which is used as a bucket key.
        String key = postFile(owner_id, filename).toString() + '.' + media_type;

//        uploads file to s3 bucket with the key, which is linked with
        return new ResponseEntity<>(service.uploadFile(file, key), HttpStatus.OK);
    }

    @GetMapping("/getAllFiles")
    List<FileMetadata> getAllFiles(){
        return fileMetadataRepository.findAll();
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

    @DeleteMapping("/file/{id}")
    String deleteFileById(@PathVariable Long id){
        if(!fileMetadataRepository.existsById(id)){
            throw new UserNotFoundException(id);
        }

        fileMetadataRepository.deleteById(id);
        return "Deleted file with id: " + id;
    }


    //   --------------------- MODIFIED MAPPING (refer to UserRepository for more info) --------------------

//    @GetMapping("/search/{query}")
//    List<FileMetadata> searchFiles(@PathVariable String query)
//    {
//        /*   This is still a strict search. we will expand on this to
//        return a margin of close results */
//        String newQuery = query.replace(" ", "");
//
//        List<FileMetadata> results = fileMetadataRepository.searchFile(newQuery);
//        for (int i = 0; i < results.size(); i++) {
//            results.get(i).setNotes("");
//            results.get(i).setFk_chatbot_id(-1L);
//            results.get(i).setFk_comments_id(-1L);
//        }
//        if(results.isEmpty()) {
//            return null;
//        }
//        else {
//            return ResponseEntity.status(HttpStatus.OK).body(result).getBody();
//        }
//    }
//
//
//    @GetMapping(value = "/mySavedFiles/{user_id}")
//    List<FileMetadata> getSavedFiles(@PathVariable("file_id") Long file_id) {
//        List<FileMetadata> results = fileMetadataRepository.getSavedFiles(file_id);
//        for (int i = 0; i < results.size(); i++) {
//            results.get(i).setNotes("");
//            results.get(i).setFk_chatbot_id(-1L);
//            results.get(i).setFk_comments_id(-1L);
//        } return ResponseEntity.status(HttpStatus.OK).body(res).getBody();
//    }
}
