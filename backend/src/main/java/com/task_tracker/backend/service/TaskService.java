package com.task_tracker.backend.service;

import com.task_tracker.backend.dto.TaskEvent;
import com.task_tracker.backend.dto.TaskRequest;
import com.task_tracker.backend.dto.TaskResponse;
import com.task_tracker.backend.entity.Role;
import com.task_tracker.backend.entity.Task;
import com.task_tracker.backend.entity.TaskStatus;
import com.task_tracker.backend.entity.User;
import com.task_tracker.backend.exception.ForbiddenActionException;
import com.task_tracker.backend.exception.ResourceNotFoundException;
import com.task_tracker.backend.repository.TaskRepository;
import com.task_tracker.backend.repository.UserRepository;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TaskService {

  private final TaskRepository taskRepository;
  private final UserRepository userRepository;
  private final SimpMessagingTemplate messagingTemplate;

  public TaskResponse createTask(TaskRequest request, Authentication auth) {
    User owner = getCurrentUser(auth);

    Task task =
        Task.builder()
            .title(request.getTitle())
            .description(request.getDescription())
            .status(parseStatus(request.getStatus()))
            .dueDate(request.getDueDate())
            .owner(owner)
            .build();

    TaskResponse response = toResponse(taskRepository.save(task));
    broadcast("CREATED", response);
    return response;
  }

  public TaskResponse getTaskById(UUID id, Authentication auth) {
    Task task = findTaskOrThrow(id);
    User currentUser = getCurrentUser(auth);

    if (!isAdmin(auth) && !task.getOwner().getId().equals(currentUser.getId())) {
      throw new ForbiddenActionException("You do not have permission to view this task");
    }

    return toResponse(task);
  }

  public Page<TaskResponse> getTasks(
      TaskStatus status, UUID ownerIdFilter, Pageable pageable, Authentication auth) {
    User currentUser = getCurrentUser(auth);
    boolean admin = isAdmin(auth);
    UUID effectiveOwnerId = admin ? ownerIdFilter : currentUser.getId();

    Page<Task> tasks;
    if (effectiveOwnerId != null && status != null) {
      tasks = taskRepository.findByOwnerIdAndStatus(effectiveOwnerId, status, pageable);
    } else if (effectiveOwnerId != null) {
      tasks = taskRepository.findByOwnerId(effectiveOwnerId, pageable);
    } else if (status != null) {
      tasks = taskRepository.findByStatus(status, pageable);
    } else {
      tasks = taskRepository.findAll(pageable);
    }

    return tasks.map(this::toResponse);
  }

  public TaskResponse updateTask(UUID id, TaskRequest request, Authentication auth) {
    Task task = findTaskOrThrow(id);
    User currentUser = getCurrentUser(auth);

    if (!isAdmin(auth) && !task.getOwner().getId().equals(currentUser.getId())) {
      throw new ForbiddenActionException("You do not have permission to update this task");
    }

    task.setTitle(request.getTitle());
    task.setDescription(request.getDescription());
    task.setStatus(parseStatus(request.getStatus()));
    task.setDueDate(request.getDueDate());

    TaskResponse response = toResponse(taskRepository.save(task));
    broadcast("UPDATED", response);
    return response;
  }

  public void deleteTask(UUID id, Authentication auth) {
    Task task = findTaskOrThrow(id);
    User currentUser = getCurrentUser(auth);

    if (!isAdmin(auth) && !task.getOwner().getId().equals(currentUser.getId())) {
      throw new ForbiddenActionException("You do not have permission to delete this task");
    }

    TaskResponse response = toResponse(task);
    taskRepository.delete(task);
    broadcast("DELETED", response);
  }

  private void broadcast(String type, TaskResponse task) {
    messagingTemplate.convertAndSend("/topic/tasks", new TaskEvent(type, task));
  }

  private Task findTaskOrThrow(UUID id) {
    return taskRepository
        .findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
  }

  private User getCurrentUser(Authentication auth) {
    String username = auth.getName();
    return userRepository
        .findByUsername(username)
        .orElseThrow(
            () -> new ResourceNotFoundException("Authenticated user not found: " + username));
  }

  private boolean isAdmin(Authentication auth) {
    return auth.getAuthorities().stream()
        .anyMatch(a -> a.getAuthority().equals("ROLE_" + Role.ADMIN.name()));
  }

  private TaskStatus parseStatus(String status) {
    try {
      return TaskStatus.valueOf(status.toUpperCase());
    } catch (IllegalArgumentException e) {
      throw new IllegalArgumentException(
          "Invalid status: " + status + ". Must be one of TODO, IN_PROGRESS, DONE");
    }
  }

  private TaskResponse toResponse(Task task) {
    return new TaskResponse(
        task.getId(),
        task.getTitle(),
        task.getDescription(),
        task.getStatus().name(),
        task.getDueDate(),
        task.getOwner().getUsername(),
        task.getOwner().getId(),
        task.getCreatedAt(),
        task.getUpdatedAt());
  }
}
