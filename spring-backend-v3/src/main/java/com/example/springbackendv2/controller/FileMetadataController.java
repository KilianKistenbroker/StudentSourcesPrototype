package com.example.springbackendv2.controller;

import com.example.springbackendv2.exception.UserNotFoundException;
import com.example.springbackendv2.model.FileMetadata;
import com.example.springbackendv2.repository.CommentsRepository;
import com.example.springbackendv2.repository.FileMetadataRepository;
import com.example.springbackendv2.service.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class FileMetadataController {

    @Autowired
    private FileMetadataRepository fileMetadataRepository;
    @Autowired
    private StorageService service;

    @Autowired
    CommentsRepository commentsRepository;

    //   --------------------- BASIC POST, GET, DELETE MAPPING BY UNIQUE ID --------------------

    @PostMapping("/postFile/{owner_id}/{filename}/{type}")
    Long postFile(@PathVariable("owner_id") Long owner_id,
                  @PathVariable("filename") String filename,
                  @PathVariable("type") String type){

//        TODO: restrict filename length here

        FileMetadata fileMetadata = new FileMetadata();

        fileMetadata.setFk_owner_id(owner_id); // used for accessing a user's root directory from bucket.
        fileMetadata.setFilename(filename); // <- used for searching
        fileMetadata.setVisibility("Private"); // <- denotes whether this file can be searched.
        fileMetadata.setPermissions("Only you have access"); // <- allows for downloading from search area
        fileMetadata.setType(type); // allows for downloading as zip folder or file, and proper rendering.


        fileMetadataRepository.save(fileMetadata);
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

    @DeleteMapping("/file/{id}")
    String deleteFileById(@PathVariable Long id){

        commentsRepository.deleteByResourceId(id);


        if(!fileMetadataRepository.existsById(id)){
            throw new UserNotFoundException(id);
        }

        fileMetadataRepository.deleteById(id);



        return "Deleted file with id: " + id;
    }
}
