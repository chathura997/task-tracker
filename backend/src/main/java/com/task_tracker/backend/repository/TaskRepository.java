package com.task_tracker.backend.repository;

import com.task_tracker.backend.entity.Task;
import com.task_tracker.backend.entity.TaskStatus;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends JpaRepository<Task, UUID> {
  Page<Task> findByOwnerId(UUID ownerId, Pageable pageable);

  Page<Task> findByStatus(TaskStatus status, Pageable pageable);

  Page<Task> findByOwnerIdAndStatus(UUID ownerId, TaskStatus status, Pageable pageable);
}
