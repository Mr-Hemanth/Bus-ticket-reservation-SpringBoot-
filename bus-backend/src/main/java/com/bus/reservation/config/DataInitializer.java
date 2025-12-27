package com.bus.reservation.config;

import com.bus.reservation.entity.Role;
import com.bus.reservation.entity.User;
import com.bus.reservation.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Check if admin user already exists
        if (userRepository.findByEmail("busadmin@test.com").isEmpty()) {
            User adminUser = new User();
            adminUser.setName("Bus Admin");
            adminUser.setEmail("busadmin@test.com");
            adminUser.setPassword(passwordEncoder.encode("admin123"));
            adminUser.setRole(Role.ADMIN);
            
            userRepository.save(adminUser);
            System.out.println("Admin user created: busadmin@test.com / admin123");
        }
    }
}