package com.task_tracker.backend.config;

import com.task_tracker.backend.entity.Role;
import com.task_tracker.backend.entity.User;
import com.task_tracker.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class DataSeeder {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner seedAdmin() {
        return args -> {
            if (!userRepository.existsByRole(Role.ADMIN)) {
                User admin = User.builder()
                        .username("admin")
                        .email("admin@tasktracker.com")
                        .password(passwordEncoder.encode("admin123"))
                        .role(Role.ADMIN)
                        .build();
                userRepository.save(admin);
                System.out.println("Seeded default admin user: admin / admin123");
            }
        };
    }
}