package com.task_tracker.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Getter
@AllArgsConstructor
public class TaskResponse {
    private UUID id;
    private String title;
    private String description;
    private String status;
    private LocalDate dueDate;
    private String ownerUsername;
    private UUID ownerId;
    private Instant createdAt;
    private Instant updatedAt;
}