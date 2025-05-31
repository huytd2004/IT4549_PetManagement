package com.example.server.service;

import com.example.server.model.Role;
import com.example.server.model.User;
import com.example.server.repository.RoleRepo;
import com.example.server.repository.UserRepo;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Collections;
import java.util.HashSet;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private UserRepo userRepo;

    @Mock
    private RoleRepo roleRepo;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpSession session;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private AuthService authService;

    private User testUser;
    private Role userRole;

    @BeforeEach
    void setUp() {
        // Setup test user
        testUser = new User();
        testUser.setId(1);
        testUser.setUserName("Test User");
        testUser.setUserUsername("testuser");
        testUser.setUserPassword("encodedPassword");
        testUser.setUserEmail("test@example.com");
        testUser.setUserPhone("1234567890");
        testUser.setUserDob("01/01/1990");
        testUser.setUserAddress("123 Test St");

        // Setup role
        userRole = new Role();
        userRole.setId(1);
        userRole.setRoleName("USER");

        // Set user roles
        testUser.setRoles(new HashSet<>(Collections.singletonList(userRole)));

        // Setup security context
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    void register_Success() {
        // Arrange
        when(userRepo.existsByUserUsername("newuser")).thenReturn(false);
        when(userRepo.existsByUserEmail("new@example.com")).thenReturn(false);
        when(roleRepo.findByRoleName("USER")).thenReturn(Optional.of(userRole));
        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");

        User newUser = new User();
        newUser.setId(2);
        newUser.setUserName("New User");
        newUser.setUserUsername("newuser");
        newUser.setUserPassword("encodedPassword");
        newUser.setUserEmail("new@example.com");
        newUser.setUserPhone("0987654321");
        newUser.setUserDob("02/02/1995");
        newUser.setUserAddress("456 New St");
        newUser.setRoles(new HashSet<>(Collections.singletonList(userRole)));

        when(userRepo.save(any(User.class))).thenReturn(newUser);

        // Act
        Map<String, Object> result = authService.register(
                "New User", "newuser", "password123",
                "new@example.com", "0987654321", "02/02/1995", "456 New St"
        );

        // Assert
        assertNotNull(result);
        assertEquals(2, result.get("id"));
        assertEquals("New User", result.get("name"));
        assertEquals("newuser", result.get("username"));
        assertEquals("new@example.com", result.get("email"));
        assertEquals("0987654321", result.get("phone"));
        assertTrue(result.get("roles") instanceof java.util.List);
        assertEquals("USER", ((java.util.List<?>) result.get("roles")).get(0));

        verify(passwordEncoder).encode("password123");
        verify(userRepo).save(any(User.class));
    }

    @Test
    void register_UsernameAlreadyExists_ThrowsException() {
        // Arrange
        when(userRepo.existsByUserUsername("existinguser")).thenReturn(true);

        // Act & Assert
        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> authService.register(
                        "Existing User", "existinguser", "password123",
                        "existing@example.com", "0987654321", "02/02/1995", "456 New St"
                )
        );

        assertEquals("Username is already taken!", exception.getMessage());
        verify(userRepo, never()).save(any(User.class));
    }

    @Test
    void register_EmailAlreadyExists_ThrowsException() {
        // Arrange
        when(userRepo.existsByUserUsername("newuser")).thenReturn(false);
        when(userRepo.existsByUserEmail("existing@example.com")).thenReturn(true);

        // Act & Assert
        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> authService.register(
                        "New User", "newuser", "password123",
                        "existing@example.com", "0987654321", "02/02/1995", "456 New St"
                )
        );

        assertEquals("Email is already in use!", exception.getMessage());
        verify(userRepo, never()).save(any(User.class));
    }

    @Test
    void login_Success() {
        // Arrange
        UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken("testuser", "password123");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(request.getSession()).thenReturn(session);
        when(userRepo.findByUserUsername("testuser")).thenReturn(Optional.of(testUser));

        // Act
        Map<String, Object> result = authService.login("testuser", "password123");

        // Assert
        assertNotNull(result);
        assertEquals(1, result.get("id"));
        assertEquals("Test User", result.get("name"));
        assertEquals("testuser", result.get("username"));

        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(request).getSession();
        verify(session).setAttribute(eq("SPRING_SECURITY_CONTEXT"), any());
    }

    @Test
    void login_UserNotFound_ThrowsException() {
        // Arrange
        UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken("nonexistent", "password123");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(request.getSession()).thenReturn(session);
        when(userRepo.findByUserUsername("nonexistent")).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> authService.login("nonexistent", "password123")
        );

        assertEquals("User not found with username: nonexistent", exception.getMessage());
    }

    @Test
    void getCurrentUser_Success() {
        // Arrange
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("testuser");
        when(userRepo.findByUserUsername("testuser")).thenReturn(Optional.of(testUser));

        // Act
        Map<String, Object> result = authService.getCurrentUser();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.get("id"));
        assertEquals("Test User", result.get("name"));
        assertEquals("testuser", result.get("username"));
        assertEquals("test@example.com", result.get("email"));

        verify(securityContext).getAuthentication();
        verify(authentication).getName();
    }

    @Test
    void getCurrentUser_UserNotFound_ThrowsException() {
        // Arrange
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("nonexistent");
        when(userRepo.findByUserUsername("nonexistent")).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> authService.getCurrentUser()
        );

        assertEquals("User not found with username: nonexistent", exception.getMessage());
    }
}