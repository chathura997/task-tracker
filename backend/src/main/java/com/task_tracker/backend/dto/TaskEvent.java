package com.task_tracker.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TaskEvent {
    private String type;       // "CREATED", "UPDATED", "DELETED"
    private TaskResponse task;
}