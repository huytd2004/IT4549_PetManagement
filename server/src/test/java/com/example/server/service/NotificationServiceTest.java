package com.example.server.service;

import com.example.server.model.Appointment;
import com.example.server.model.Notifications;
import com.example.server.model.Pet;
import com.example.server.model.User;
import com.example.server.repository.NotificationsRepo;
import com.example.server.repository.UserRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class NotificationServiceTest {

    @Mock
    private NotificationsRepo notificationRepo;

    @Mock
    private UserRepo userRepo;

    @InjectMocks
    private NotificationService notificationService;

    private User testUser;
    private Notifications notification1;
    private Notifications notification2;
    private DateTimeFormatter formatter;
    private Pet testPet;
    private Appointment testAppointment;

    @BeforeEach
    void setUp() {
        // Setup test data
        formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String currentTime = LocalDateTime.now().format(formatter);

        testUser = new User();
        testUser.setId(1);
        testUser.setUserName("Test User");

        notification1 = new Notifications();
        notification1.setId(1);
        notification1.setUser(testUser);
        notification1.setMessage("Test notification 1");
        notification1.setSendAt(currentTime);
        notification1.setRead(false);

        notification2 = new Notifications();
        notification2.setId(2);
        notification2.setUser(testUser);
        notification2.setMessage("Test notification 2");
        notification2.setSendAt(currentTime);
        notification2.setRead(true);

        testPet = new Pet();
        testPet.setId(1);
        testPet.setPetName("Fluffy");

        testAppointment = new Appointment();
        testAppointment.setPet(testPet);
        testAppointment.setType(Appointment.AppointmentType.KHÁM_BỆNH);
    }

    @Test
    void getAllNotificationsByUserId_Success() {
        // Arrange
        List<Notifications> expectedNotifications = Arrays.asList(notification1, notification2);
        when(notificationRepo.findByUserIdOrderBySendAtDesc(1)).thenReturn(expectedNotifications);

        // Act
        List<Notifications> result = notificationService.getAllNotificationsByUserId(1);

        // Assert
        assertEquals(2, result.size());
        assertEquals(expectedNotifications, result);
        verify(notificationRepo).findByUserIdOrderBySendAtDesc(1);
    }

    @Test
    void getUnreadNotificationsByUserId_Success() {
        // Arrange
        when(notificationRepo.findByUserIdAndIsReadOrderBySendAtDesc(1, false))
                .thenReturn(Collections.singletonList(notification1));

        // Act
        List<Notifications> result = notificationService.getUnreadNotificationsByUserId(1);

        // Assert
        assertEquals(1, result.size());
        assertEquals(notification1, result.get(0));
        verify(notificationRepo).findByUserIdAndIsReadOrderBySendAtDesc(1, false);
    }

    @Test
    void getUnreadNotificationsCount_Success() {
        // Arrange
        when(notificationRepo.countByUserIdAndIsRead(1, false)).thenReturn(5L);

        // Act
        long result = notificationService.getUnreadNotificationsCount(1);

        // Assert
        assertEquals(5L, result);
        verify(notificationRepo).countByUserIdAndIsRead(1, false);
    }

    @Test
    void markAsRead_Success() {
        // Arrange
        when(notificationRepo.findById(1)).thenReturn(Optional.of(notification1));
        when(notificationRepo.save(any(Notifications.class))).thenReturn(notification1);

        // Act
        Notifications result = notificationService.markAsRead(1);

        // Assert
        assertTrue(result.isRead());
        verify(notificationRepo).findById(1);
        verify(notificationRepo).save(notification1);
    }

    @Test
    void markAsRead_NotificationNotFound() {
        // Arrange
        when(notificationRepo.findById(999)).thenReturn(Optional.empty());

        // Act & Assert
        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> notificationService.markAsRead(999)
        );

        assertEquals("Không tìm thấy thông báo với ID: 999", exception.getReason());
        verify(notificationRepo).findById(999);
        verify(notificationRepo, never()).save(any(Notifications.class));
    }

    @Test
    void markAllAsRead_Success() {
        // Arrange
        List<Notifications> unreadNotifications = Collections.singletonList(notification1);
        when(notificationRepo.findByUserIdAndIsRead(1, false)).thenReturn(unreadNotifications);

        // Act
        notificationService.markAllAsRead(1);

        // Assert
        assertTrue(notification1.isRead());
        verify(notificationRepo).findByUserIdAndIsRead(1, false);
        verify(notificationRepo).save(notification1);
    }

    @Test
    void createAppointmentNotification_MedicalAppointment() {
        // Arrange
        testAppointment.setType(Appointment.AppointmentType.KHÁM_BỆNH);
        when(notificationRepo.save(any(Notifications.class))).thenAnswer(invocation -> {
            Notifications saved = invocation.getArgument(0);
            saved.setId(3);
            return saved;
        });

        // Act
        Notifications result = notificationService.createAppointmentNotification(testUser, testAppointment);

        // Assert
        assertNotNull(result);
        assertEquals(3, result.getId());
        assertEquals(testUser, result.getUser());
        assertTrue(result.getMessage().contains("khám bệnh"));
        assertTrue(result.getMessage().contains("Fluffy"));
        assertTrue(result.isRead());
        verify(notificationRepo).save(any(Notifications.class));
    }

    @Test
    void createAppointmentNotification_GroomingAppointment() {
        // Arrange
        testAppointment.setType(Appointment.AppointmentType.LÀM_ĐẸP);
        when(notificationRepo.save(any(Notifications.class))).thenAnswer(invocation -> {
            Notifications saved = invocation.getArgument(0);
            saved.setId(3);
            return saved;
        });

        // Act
        Notifications result = notificationService.createAppointmentNotification(testUser, testAppointment);

        // Assert
        assertNotNull(result);
        assertEquals(3, result.getId());
        assertEquals(testUser, result.getUser());
        assertTrue(result.getMessage().contains("làm đẹp"));
        assertTrue(result.getMessage().contains("Fluffy"));
        assertTrue(result.isRead());
        verify(notificationRepo).save(any(Notifications.class));
    }

    @Test
    void createAppointmentNotification_BoardingAppointment() {
        // Arrange
        testAppointment.setType(Appointment.AppointmentType.LƯU_TRÚ);
        when(notificationRepo.save(any(Notifications.class))).thenAnswer(invocation -> {
            Notifications saved = invocation.getArgument(0);
            saved.setId(3);
            return saved;
        });

        // Act
        Notifications result = notificationService.createAppointmentNotification(testUser, testAppointment);

        // Assert
        assertNotNull(result);
        assertEquals(3, result.getId());
        assertEquals(testUser, result.getUser());
        assertTrue(result.getMessage().contains("lưu trú"));
        assertTrue(result.getMessage().contains("Fluffy"));
        assertTrue(result.isRead());
        verify(notificationRepo).save(any(Notifications.class));
    }

    @Test
    void createNotification_Success() {
        // Arrange
        when(notificationRepo.save(any(Notifications.class))).thenAnswer(invocation -> {
            Notifications saved = invocation.getArgument(0);
            saved.setId(3);
            return saved;
        });

        // Act
        Notifications result = notificationService.createNotification(testUser, "Custom message");

        // Assert
        assertNotNull(result);
        assertEquals(3, result.getId());
        assertEquals(testUser, result.getUser());
        assertEquals("Custom message", result.getMessage());
        assertTrue(result.isRead());
        assertNotNull(result.getSendAt());

        // Verify the sendAt time is formatted correctly and is approximately the current time
        LocalDateTime sendAt = LocalDateTime.parse(result.getSendAt(), formatter);
        LocalDateTime now = LocalDateTime.now();
        assertTrue(sendAt.isAfter(now.minusMinutes(1)));
        assertTrue(sendAt.isBefore(now.plusMinutes(1)));

        verify(notificationRepo).save(any(Notifications.class));
    }
}