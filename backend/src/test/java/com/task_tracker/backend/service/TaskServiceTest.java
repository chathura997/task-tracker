package com.task_tracker.backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

import com.task_tracker.backend.dto.TaskEvent;
import com.task_tracker.backend.dto.TaskRequest;
import com.task_tracker.backend.entity.Role;
import com.task_tracker.backend.entity.Task;
import com.task_tracker.backend.entity.TaskStatus;
import com.task_tracker.backend.entity.User;
import com.task_tracker.backend.exception.ForbiddenActionException;
import com.task_tracker.backend.repository.TaskRepository;
import com.task_tracker.backend.repository.UserRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

  @Mock private TaskRepository taskRepository;
  @Mock private UserRepository userRepository;
  @Mock private SimpMessagingTemplate messagingTemplate;

  @InjectMocks private TaskService taskService;

  private User owner;
  private User otherUser;
  private Task task;

  @BeforeEach
  void setUp() {
    owner = User.builder().id(UUID.randomUUID()).username("owner").role(Role.USER).build();

    otherUser = User.builder().id(UUID.randomUUID()).username("otheruser").role(Role.USER).build();

    task =
        Task.builder()
            .id(UUID.randomUUID())
            .title("Test task")
            .status(TaskStatus.TODO)
            .owner(owner)
            .build();
  }

  private Authentication authAs(User user) {
    return new UsernamePasswordAuthenticationToken(
        user.getUsername(),
        null,
        List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())));
  }

  @Test
  void getTaskById_shouldReturnTask_whenRequestedByOwner() {
    when(taskRepository.findById(task.getId())).thenReturn(Optional.of(task));
    when(userRepository.findByUsername("owner")).thenReturn(Optional.of(owner));

    var response = taskService.getTaskById(task.getId(), authAs(owner));

    assertThat(response.getTitle()).isEqualTo("Test task");
  }

  @Test
  void getTaskById_shouldThrowForbidden_whenRequestedByNonOwnerNonAdmin() {
    when(taskRepository.findById(task.getId())).thenReturn(Optional.of(task));
    when(userRepository.findByUsername("otheruser")).thenReturn(Optional.of(otherUser));

    assertThatThrownBy(() -> taskService.getTaskById(task.getId(), authAs(otherUser)))
        .isInstanceOf(ForbiddenActionException.class);
  }

  @Test
  void getTaskById_shouldSucceed_whenRequestedByAdmin() {
    User admin = User.builder().id(UUID.randomUUID()).username("admin").role(Role.ADMIN).build();

    when(taskRepository.findById(task.getId())).thenReturn(Optional.of(task));
    when(userRepository.findByUsername("admin")).thenReturn(Optional.of(admin));

    var response = taskService.getTaskById(task.getId(), authAs(admin));

    assertThat(response.getTitle()).isEqualTo("Test task");
  }

  @Test
  void deleteTask_shouldThrowForbidden_whenNonOwnerTriesToDelete() {
    when(taskRepository.findById(task.getId())).thenReturn(Optional.of(task));
    when(userRepository.findByUsername("otheruser")).thenReturn(Optional.of(otherUser));

    assertThatThrownBy(() -> taskService.deleteTask(task.getId(), authAs(otherUser)))
        .isInstanceOf(ForbiddenActionException.class);

    verify(taskRepository, never()).delete(any());
  }

  @Test
  void createTask_shouldSaveTaskWithCorrectOwner() {
    when(userRepository.findByUsername("owner")).thenReturn(Optional.of(owner));
    when(taskRepository.save(any(Task.class))).thenAnswer(inv -> inv.getArgument(0));

    TaskRequest request = new TaskRequest();
    request.setTitle("New task");
    request.setStatus("TODO");

    var response = taskService.createTask(request, authAs(owner));

    assertThat(response.getTitle()).isEqualTo("New task");
    assertThat(response.getOwnerUsername()).isEqualTo("owner");
    verify(messagingTemplate).convertAndSend(eq("/topic/tasks"), any(TaskEvent.class));
  }
}
