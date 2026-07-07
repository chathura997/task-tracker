package com.task_tracker.backend.repository;

import com.task_tracker.backend.entity.Task;
import com.task_tracker.backend.entity.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository<Task,UUID> {
    Page<Task> findByOwnerId(UUID ownerId, Pageable pageable);
    Page<Task> findByStatus(TaskStatus status,Pageable pageable);
    Page<Task> findByOwnerIdAndStatus(UUID ownerId,TaskStatus status,Pageable pageable);
}
