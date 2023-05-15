package com.example.springbackendv2.repository;

import com.example.springbackendv2.model.FileMetadata;
import com.example.springbackendv2.model.Friends;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FileMetadataRepository extends JpaRepository<FileMetadata, Long> {
}
