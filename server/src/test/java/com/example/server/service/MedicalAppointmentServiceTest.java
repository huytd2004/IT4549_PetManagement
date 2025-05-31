package com.example.server.service;

import com.example.server.dto.MedicalAppointmentRequest;
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
public class MedicalAppointmentServiceTest {

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
    private MedicalAppointmentService medicalAppointmentService;

    private User testUser;
    private Pet testPet;
    private ServiceInfo medicalService;
    private Center testCenter;
    private MedicalAppointmentRequest validRequest;
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

        medicalService = new ServiceInfo();
        medicalService.setId(1);
        medicalService.setServiceType(ServiceInfo.ServiceType.KHÁM_BỆNH);
        medicalService.setBasePrice(300.0);

        testCenter = new Center();
        testCenter.setId(1);

        // Setup appointment time
        startTime = LocalDateTime.now().plusDays(1);

        // Setup valid request
        validRequest = new MedicalAppointmentRequest();
        validRequest.setUserId(1);
        validRequest.setPetId(1);
        validRequest.setServiceId(1);
        validRequest.setCenterId(1);
        validRequest.setStartTime(startTime);
        validRequest.setCustomerNotes("My dog has been coughing lately");
    }

    @Test
    void createMedicalAppointment_Success() {
        // Arrange
        when(userRepo.findById(1)).thenReturn(Optional.of(testUser));
        when(petRepo.findById(1)).thenReturn(Optional.of(testPet));
        when(serviceInfoRepo.findById(1)).thenReturn(Optional.of(medicalService));
        when(centerRepo.findById(1)).thenReturn(Optional.of(testCenter));

        when(appointmentRepository.save(any(Appointment.class))).thenAnswer(invocation -> {
            Appointment saved = invocation.getArgument(0);
            saved.setId(1);
            return saved;
        });

        // Act
        Appointment result = medicalAppointmentService.createMedicalAppointment(validRequest);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getId());
        assertEquals(testUser, result.getUser());
        assertEquals(testPet, result.getPet());
        assertEquals(medicalService, result.getServiceInfo());
        assertEquals(testCenter, result.getCenter());
        assertEquals(startTime, result.getStartTime());
        assertEquals("My dog has been coughing lately", result.getCustomerNotes());
        assertEquals(Appointment.AppointmentType.KHÁM_BỆNH, result.getType());
        assertEquals(Appointment.AppointmentStatus.CHỜ_XÁC_NHẬN, result.getStatus());
        assertEquals(300.0, result.getPrice());
        assertNotNull(result.getMedicalExam());

        verify(appointmentRepository).save(any(Appointment.class));
    }

    @Test
    void createMedicalAppointment_UserNotFound() {
        // Arrange
        validRequest.setUserId(999);
        when(userRepo.findById(999)).thenReturn(Optional.empty());

        // Act & Assert
        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> medicalAppointmentService.createMedicalAppointment(validRequest)
        );

        assertEquals("User not found", exception.getReason());
        verify(appointmentRepository, never()).save(any(Appointment.class));
    }

    @Test
    void createMedicalAppointment_PetNotFound() {
        // Arrange
        validRequest.setPetId(999);
        when(userRepo.findById(1)).thenReturn(Optional.of(testUser));
        when(petRepo.findById(999)).thenReturn(Optional.empty());

        // Act & Assert
        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> medicalAppointmentService.createMedicalAppointment(validRequest)
        );

        assertEquals("Pet not found", exception.getReason());
        verify(appointmentRepository, never()).save(any(Appointment.class));
    }

    @Test
    void createMedicalAppointment_ServiceNotFound() {
        // Arrange
        validRequest.setServiceId(999);
        when(userRepo.findById(1)).thenReturn(Optional.of(testUser));
        when(petRepo.findById(1)).thenReturn(Optional.of(testPet));
        when(serviceInfoRepo.findById(999)).thenReturn(Optional.empty());

        // Act & Assert
        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> medicalAppointmentService.createMedicalAppointment(validRequest)
        );

        assertEquals("Service not found", exception.getReason());
        verify(appointmentRepository, never()).save(any(Appointment.class));
    }

    @Test
    void createMedicalAppointment_NonMedicalService() {
        // Arrange
        validRequest.setServiceId(2);
        ServiceInfo boardingService = new ServiceInfo();
        boardingService.setId(2);
        boardingService.setServiceType(ServiceInfo.ServiceType.LƯU_TRÚ);

        when(userRepo.findById(1)).thenReturn(Optional.of(testUser));
        when(petRepo.findById(1)).thenReturn(Optional.of(testPet));
        when(serviceInfoRepo.findById(2)).thenReturn(Optional.of(boardingService));

        // Act & Assert
        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> medicalAppointmentService.createMedicalAppointment(validRequest)
        );

        assertEquals("Not a medical service", exception.getReason());
        verify(appointmentRepository, never()).save(any(Appointment.class));
    }

    @Test
    void createMedicalAppointment_CenterNotFound() {
        // Arrange
        validRequest.setCenterId(999);
        when(userRepo.findById(1)).thenReturn(Optional.of(testUser));
        when(petRepo.findById(1)).thenReturn(Optional.of(testPet));
        when(serviceInfoRepo.findById(1)).thenReturn(Optional.of(medicalService));
        when(centerRepo.findById(999)).thenReturn(Optional.empty());

        // Act & Assert
        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> medicalAppointmentService.createMedicalAppointment(validRequest)
        );

        assertEquals("Center not found", exception.getReason());
        verify(appointmentRepository, never()).save(any(Appointment.class));
    }

    @Test
    void createMedicalAppointment_VerifyRequestTimeAndMedicalExam() {
        // Arrange
        when(userRepo.findById(1)).thenReturn(Optional.of(testUser));
        when(petRepo.findById(1)).thenReturn(Optional.of(testPet));
        when(serviceInfoRepo.findById(1)).thenReturn(Optional.of(medicalService));
        when(centerRepo.findById(1)).thenReturn(Optional.of(testCenter));

        when(appointmentRepository.save(any(Appointment.class))).thenAnswer(invocation -> {
            Appointment saved = invocation.getArgument(0);
            saved.setId(1);
            return saved;
        });

        // Act
        Appointment result = medicalAppointmentService.createMedicalAppointment(validRequest);

        // Assert
        // Verify that request time is set to current time (approximately)
        assertNotNull(result.getRequestTime());
        LocalDateTime now = LocalDateTime.now();
        assertTrue(result.getRequestTime().isAfter(now.minusMinutes(1)));
        assertTrue(result.getRequestTime().isBefore(now.plusMinutes(1)));

        // Verify that a medical exam object was created and linked to the appointment
        assertNotNull(result.getMedicalExam());
        assertEquals(result, result.getMedicalExam().getAppointment());
    }
}