package com.bus.reservation.service;

import com.bus.reservation.dto.UserRegistrationRequest;
import com.bus.reservation.entity.User;

public interface UserService {
    User registerUser(UserRegistrationRequest request);
    User findByEmail(String email);
}