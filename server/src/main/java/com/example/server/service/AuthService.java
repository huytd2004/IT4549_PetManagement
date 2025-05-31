package com.example.server.service;

import com.example.server.model.Role;
import com.example.server.model.User;
import com.example.server.repository.RoleRepo;
import com.example.server.repository.UserRepo;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class AuthService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private RoleRepo roleRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private HttpServletRequest request;

    public Map<String, Object> register(String name, String username, String password,
                                        String email, String phone, String dob, String address) {
        // Check if username already exists
        if (userRepo.existsByUserUsername(username)) {
            throw new RuntimeException("Username is already taken!");
        }

        // Check if email already exists
        if (userRepo.existsByUserEmail(email)) {
            throw new RuntimeException("Email is already in use!");
        }

        // Create new user
        User user = new User();
        user.setUserName(name);
        user.setUserUsername(username);
        user.setUserPassword(passwordEncoder.encode(password));
        user.setUserEmail(email);
        user.setUserPhone(phone);
        user.setUserDob(dob);
        user.setUserAddress(address);

        // Set default role as USER
        Role userRole = roleRepo.findByRoleName("USER")
                .orElseThrow(() -> new RuntimeException("Default role not found."));
        user.setRoles(new HashSet<>(Collections.singletonList(userRole)));

        User savedUser = userRepo.save(user);

        return mapUserToResponse(savedUser);
    }

    public Map<String, Object> login(String username, String password) {
        // Xác thực người dùng
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
        );

        // Lưu authentication vào SecurityContext
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Lưu SecurityContext vào session
        HttpSession session = request.getSession();
        session.setAttribute(
                "SPRING_SECURITY_CONTEXT",
                SecurityContextHolder.getContext()
        );
        // Get the user details and return them
        User user = userRepo.findByUserUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));

        return mapUserToResponse(user);
    }

//    public void logout() {
//        SecurityContextHolder.clearContext();
//    }

    public Map<String, Object> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userRepo.findByUserUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));

        return mapUserToResponse(user);
    }

    private Map<String, Object> mapUserToResponse(User user) {
        Map<String, Object> userResponse = new HashMap<>();
        userResponse.put("id", user.getId());
        userResponse.put("name", user.getUserName());
        userResponse.put("username", user.getUserUsername());
        userResponse.put("email", user.getUserEmail());
        userResponse.put("phone", user.getUserPhone());
        userResponse.put("roles", user.getRoles().stream()
                .map(Role::getRoleName)
                .collect(Collectors.toList()));
        return userResponse;
    }
}