package com.example.springbackendv2.repository;

import com.example.springbackendv2.model.GroupManager;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GroupManagerRepository extends JpaRepository<GroupManager, Long> {
}
