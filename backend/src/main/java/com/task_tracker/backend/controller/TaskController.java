package com.task_tracker.backend.controller;

import com.task_tracker.backend.dto.TaskRequest;
import com.task_tracker.backend.dto.TaskResponse;
import com.task_tracker.backend.entity.TaskStatus;
import com.task_tracker.backend.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(
            @Valid @RequestBody TaskRequest request,
            Authentication auth
    ) {
        TaskResponse response = taskService.createTask(request, auth);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskResponse> getTaskById(
            @PathVariable UUID id,
            Authentication auth
    ) {
        return ResponseEntity.ok(taskService.getTaskById(id, auth));
    }

    @GetMapping
    public ResponseEntity<Page<TaskResponse>> getTasks(
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(required = false) UUID owner,
            Pageable pageable,
            Authentication auth
    ) {
        return ResponseEntity.ok(taskService.getTasks(status, owner, pageable, auth));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> updateTask(
            @PathVariable UUID id,
            @Valid @RequestBody TaskRequest request,
            Authentication auth
    ) {
        return ResponseEntity.ok(taskService.updateTask(id, request, auth));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable UUID id,
            Authentication auth
    ) {
        taskService.deleteTask(id, auth);
        return ResponseEntity.noContent().build();
    }
}