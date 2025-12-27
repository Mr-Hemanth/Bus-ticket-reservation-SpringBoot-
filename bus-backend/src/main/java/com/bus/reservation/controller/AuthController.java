package com.bus.reservation.controller;

import com.bus.reservation.dto.AuthRequest;
import com.bus.reservation.dto.AuthResponse;
import com.bus.reservation.dto.UserRegistrationRequest;
import com.bus.reservation.entity.User;
import com.bus.reservation.security.JwtUtil;
import com.bus.reservation.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest authRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            authRequest.getEmail(),
                            authRequest.getPassword()
                    )
            );

            User user = (User) authentication.getPrincipal();
            String jwt = jwtUtil.generateToken(user);

            AuthResponse response = new AuthResponse(jwt, "Login successful", user.getRole().toString());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(new AuthResponse(null, "Invalid credentials. Please try again.", null));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody UserRegistrationRequest request) {
        try {
            User user = userService.registerUser(request);
            // Generate token for the newly registered user
            String jwt = jwtUtil.generateToken(user);
            return ResponseEntity.ok(new AuthResponse(jwt, "User registered successfully", user.getRole().toString()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new AuthResponse(null, e.getMessage(), null));
        }
    }
}