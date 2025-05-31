package com.example.server.service;

import com.example.server.model.*;
import com.example.server.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class GroomingAppointmentServiceTest {

    @Mock
    private AppointmentRepo appointmentRepository;

    @Mock
    private UserRepo userRepo;

    @Mock
    private PetRepo petRepo;

    @Mock
    private ServiceInfoRepo serviceInfoRepo;

    @Mock
    private CenterRepo centerRepo;

    @InjectMocks
    private GroomingAppointmentService groomingAppointmentService;

    private User testUser;
    private Pet testPet;
    private ServiceInfo groomingService;
    private Center testCenter;
    private LocalDateTime startTime;

    @BeforeEach
    void setUp() {
        // Setup test data
        testUser = new User();
        testUser.setId(1);
        testUser.setUserName("Test User");

        testPet = new Pet();
        testPet.setId(1);
        testPet.setPetName("Fluffy");
        testPet.setUser(testUser);

        groomingService = new ServiceInfo();
        groomingService.setId(1);
        groomingService.setServiceType(ServiceInfo.ServiceType.LÀM_ĐẸP);
        groomingService.setBasePrice(200.0);

        testCenter = new Center();
        testCenter.setId(1);

        // Setup appointment time
        startTime = LocalDateTime.now().plusDays(1);
    }

    @Test
    void createGroomingAppointment_Success() {
        // Arrange
        when(userRepo.findById(1)).thenReturn(Optional.of(testUser));
        when(petRepo.findById(1)).thenReturn(Optional.of(testPet));
        when(serviceInfoRepo.findById(1)).thenReturn(Optional.of(groomingService));
        when(centerRepo.findById(1)).thenReturn(Optional.of(testCenter));

        when(appointmentRepository.save(any(Appointment.class))).thenAnswer(invocation -> {
            Appointment saved = invocation.getArgument(0);
            saved.setId(1);
            return saved;
        });

        // Act
        Appointment result = groomingAppointmentService.createGroomingAppointment(
                1, 1, 1, 1, startTime, "Please take good care of my pet's fur"
        );

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getId());
        assertEquals(testUser, result.getUser());
        assertEquals(testPet, result.getPet());
        assertEquals(groomingService, result.getServiceInfo());
        assertEquals(testCenter, result.getCenter());
        assertEquals(startTime, result.getStartTime());
        assertEquals("Please take good care of my pet's fur", result.getCustomerNotes());
        assertEquals(Appointment.AppointmentType.LÀM_ĐẸP, result.getType());
        assertEquals(Appointment.AppointmentStatus.CHỜ_XÁC_NHẬN, result.getStatus());
        assertEquals(200.0, result.getPrice());

        verify(appointmentRepository).save(any(Appointment.class));
    }

    @Test
    void createGroomingAppointment_UserNotFound() {
        // Arrange
        when(userRepo.findById(999)).thenReturn(Optional.empty());

        // Act & Assert
        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> groomingAppointmentService.createGroomingAppointment(
                        999, 1, 1, 1, startTime, "Test notes"
                )
        );

        assertEquals("User not found", exception.getReason());
        verify(appointmentRepository, never()).save(any(Appointment.class));
    }

    @Test
    void createGroomingAppointment_PetNotFound() {
        // Arrange
        when(userRepo.findById(1)).thenReturn(Optional.of(testUser));
        when(petRepo.findById(999)).thenReturn(Optional.empty());

        // Act & Assert
        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> groomingAppointmentService.createGroomingAppointment(
                        1, 999, 1, 1, startTime, "Test notes"
                )
        );

        assertEquals("Pet not found", exception.getReason());
        verify(appointmentRepository, never()).save(any(Appointment.class));
    }

    @Test
    void createGroomingAppointment_ServiceNotFound() {
        // Arrange
        when(userRepo.findById(1)).thenReturn(Optional.of(testUser));
        when(petRepo.findById(1)).thenReturn(Optional.of(testPet));
        when(serviceInfoRepo.findById(999)).thenReturn(Optional.empty());

        // Act & Assert
        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> groomingAppointmentService.createGroomingAppointment(
                        1, 1, 999, 1, startTime, "Test notes"
                )
        );

        assertEquals("Service not found", exception.getReason());
        verify(appointmentRepository, never()).save(any(Appointment.class));
    }

    @Test
    void createGroomingAppointment_NonGroomingService() {
        // Arrange
        ServiceInfo boardingService = new ServiceInfo();
        boardingService.setId(2);
        boardingService.setServiceType(ServiceInfo.ServiceType.LƯU_TRÚ);

        when(userRepo.findById(1)).thenReturn(Optional.of(testUser));
        when(petRepo.findById(1)).thenReturn(Optional.of(testPet));
        when(serviceInfoRepo.findById(2)).thenReturn(Optional.of(boardingService));

        // Act & Assert
        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> groomingAppointmentService.createGroomingAppointment(
                        1, 1, 2, 1, startTime, "Test notes"
                )
        );

        assertEquals("Not a grooming service", exception.getReason());
        verify(appointmentRepository, never()).save(any(Appointment.class));
    }

    @Test
    void createGroomingAppointment_CenterNotFound() {
        // Arrange
        when(userRepo.findById(1)).thenReturn(Optional.of(testUser));
        when(petRepo.findById(1)).thenReturn(Optional.of(testPet));
        when(serviceInfoRepo.findById(1)).thenReturn(Optional.of(groomingService));
        when(centerRepo.findById(999)).thenReturn(Optional.empty());

        // Act & Assert
        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> groomingAppointmentService.createGroomingAppointment(
                        1, 1, 1, 999, startTime, "Test notes"
                )
        );

        assertEquals("Center not found", exception.getReason());
        verify(appointmentRepository, never()).save(any(Appointment.class));
    }

    @Test
    void createGroomingAppointment_VerifyRequestTime() {
        // Arrange
        when(userRepo.findById(1)).thenReturn(Optional.of(testUser));
        when(petRepo.findById(1)).thenReturn(Optional.of(testPet));
        when(serviceInfoRepo.findById(1)).thenReturn(Optional.of(groomingService));
        when(centerRepo.findById(1)).thenReturn(Optional.of(testCenter));

        when(appointmentRepository.save(any(Appointment.class))).thenAnswer(invocation -> {
            Appointment saved = invocation.getArgument(0);
            saved.setId(1);
            return saved;
        });

        // Act
        Appointment result = groomingAppointmentService.createGroomingAppointment(
                1, 1, 1, 1, startTime, "Test notes"
        );

        // Assert
        assertNotNull(result.getRequestTime());
        // Verify that request time is set to current time (approximately)
        LocalDateTime now = LocalDateTime.now();
        assertTrue(result.getRequestTime().isAfter(now.minusMinutes(1)));
        assertTrue(result.getRequestTime().isBefore(now.plusMinutes(1)));
    }
}