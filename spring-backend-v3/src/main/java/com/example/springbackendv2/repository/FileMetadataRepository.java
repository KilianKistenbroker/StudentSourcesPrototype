package com.example.springbackendv2.repository;

import com.example.springbackendv2.model.DirectMessages;
import com.example.springbackendv2.model.FileMetadata;
import com.example.springbackendv2.model.Friends;
import com.example.springbackendv2.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface FileMetadataRepository extends JpaRepository<FileMetadata, Long> {
    @Query(value = "SELECT * FROM file_metadata WHERE visibility LIKE 'Public' AND type LIKE 'Folder'", nativeQuery = true)
    List<FileMetadata> findAllPublicFiles();

    @Query(value = "SELECT * FROM file_metadata WHERE REPLACE(filename, ' ', '') LIKE '%'  :query  '%' AND visibility LIKE 'Public' AND type LIKE 'Folder'", nativeQuery = true)
    List<FileMetadata> searchByFilename(@Param("query") String query);

    @Query(value = "SELECT * FROM file_metadata WHERE id LIKE :fileKey AND fk_owner_id LIKE :userId", nativeQuery = true)
    FileMetadata findByIdAndUserId(@Param("fileKey") Long fileKey, @Param("userId") Long userId);

    @Transactional
    @Modifying
        @Query(value = "Delete FROM file_metadata WHERE id LIKE :id AND fk_owner_id LIKE :userId", nativeQuery = true)
    void deleteByIdAndUserId(@Param("id") Long id, @Param("userId") Long userId);

    @Transactional
    @Modifying
    @Query(value = "Delete FROM file_metadata WHERE fk_owner_id LIKE :userId", nativeQuery = true)
    void deleteByUserId(@Param("userId") Long userId);
}
