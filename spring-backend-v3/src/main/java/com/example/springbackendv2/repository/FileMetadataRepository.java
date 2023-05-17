package com.example.springbackendv2.repository;

import com.example.springbackendv2.model.DirectMessages;
import com.example.springbackendv2.model.FileMetadata;
import com.example.springbackendv2.model.Friends;
import com.example.springbackendv2.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FileMetadataRepository extends JpaRepository<FileMetadata, Long> {
    @Query(value = "SELECT * FROM file_metadata WHERE visibility LIKE 'Public'", nativeQuery = true)
    List<FileMetadata> findAllPublicFiles();

    @Query(value = "SELECT * FROM file_metadata WHERE REPLACE(filename, ' ', '') LIKE '%'  :query  '%' AND visibility LIKE 'Public'", nativeQuery = true)
    List<FileMetadata> searchByFilename(@Param("query") String query);
}
