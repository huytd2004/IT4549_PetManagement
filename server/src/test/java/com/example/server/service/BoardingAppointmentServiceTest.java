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
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class BoardingAppointmentServiceTest {

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

    @Mock
    private RoomRepo roomRepo;

    @InjectMocks
    private BoardingAppointmentService boardingAppointmentService;

    private User testUser;
    private Pet testPet;
    private ServiceInfo boardingService;
    private Center testCenter;
    private Room availableRoom;
    private LocalDateTime startTime;
    private LocalDateTime endTime;

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

        boardingService = new ServiceInfo();
        boardingService.setId(1);
        boardingService.setServiceType(ServiceInfo.ServiceType.LƯU_TRÚ);
        boardingService.setBasePrice(100.0);
        boardingService.setPricePerHour(5.0);
        boardingService.setPricePerDay(120.0);

        testCenter = new Center();
        testCenter.setId(1);

        availableRoom = new Room();
        availableRoom.setId(1);
        availableRoom.setCapacity(2);
        availableRoom.setIsAvailable(true);
        availableRoom.setCenter(testCenter);

        // Setup time range (3 days)
        startTime = LocalDateTime.now().plusDays(1);
        endTime = startTime.plusDays(3);
    }

    @Test
    void createBoardingAppointment_Success() {
        // Arrange
        when(userRepo.findById(1)).thenReturn(Optional.of(testUser));
        when(petRepo.findById(1)).thenReturn(Optional.of(testPet));
        when(serviceInfoRepo.findById(1)).thenReturn(Optional.of(boardingService));
        when(centerRepo.findById(1)).thenReturn(Optional.of(testCenter));

        // Fix: Use the enum value's string representation instead of "STANDARD"
        when(roomRepo.findByCenterIdAndRoomType(1, Appointment.RoomType.PHÒNG_THƯỜNG.toString()))
                .thenReturn(Collections.singletonList(availableRoom));

        when(appointmentRepository.countByRoomIdAndTimeOverlap(1, startTime, endTime)).thenReturn(0L);

        when(appointmentRepository.save(any(Appointment.class))).thenAnswer(invocation -> {
            Appointment saved = invocation.getArgument(0);
            saved.setId(1);
            return saved;
        });

        // Act
        Appointment result = boardingAppointmentService.createBoardingAppointment(
                1, 1, 1, 1, Appointment.RoomType.PHÒNG_THƯỜNG,
                startTime, endTime, "Please take good care of my pet."
        );

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getId());
        assertEquals(testUser, result.getUser());
        assertEquals(testPet, result.getPet());
        assertEquals(boardingService, result.getServiceInfo());
        assertEquals(testCenter, result.getCenter());
        assertEquals(availableRoom, result.getRoom());
        assertEquals(Appointment.RoomType.PHÒNG_THƯỜNG, result.getAppointmentRoomType());
        assertEquals(startTime, result.getStartTime());
        assertEquals(endTime, result.getEndTime());
        assertEquals("Please take good care of my pet.", result.getCustomerNotes());
        assertEquals(Appointment.AppointmentType.LƯU_TRÚ, result.getType());
        assertEquals(Appointment.AppointmentStatus.CHỜ_XÁC_NHẬN, result.getStatus());

        // Price should be for 3 days (3 * 120.0 = 360.0)
        assertEquals(360.0, result.getPrice());

        verify(appointmentRepository).save(any(Appointment.class));
    }

    @Test
    void createBoardingAppointment_UserNotFound() {
        // Arrange
        when(userRepo.findById(999)).thenReturn(Optional.empty());

        // Act & Assert
        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> boardingAppointmentService.createBoardingAppointment(
                        999, 1, 1, 1, Appointment.RoomType.PHÒNG_THƯỜNG,
                        startTime, endTime, "Test notes"
                )
        );

        assertEquals("Không tìm thấy người dùng", exception.getReason());
        verify(appointmentRepository, never()).save(any(Appointment.class));
    }

    @Test
    void createBoardingAppointment_PetNotFound() {
        // Arrange
        when(userRepo.findById(1)).thenReturn(Optional.of(testUser));
        when(petRepo.findById(999)).thenReturn(Optional.empty());

        // Act & Assert
        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> boardingAppointmentService.createBoardingAppointment(
                        1, 999, 1, 1, Appointment.RoomType.PHÒNG_THƯỜNG,
                        startTime, endTime, "Test notes"
                )
        );

        assertEquals("Không tìm thấy thú cưng", exception.getReason());
        verify(appointmentRepository, never()).save(any(Appointment.class));
    }

    @Test
    void createBoardingAppointment_ServiceNotFound() {
        // Arrange
        when(userRepo.findById(1)).thenReturn(Optional.of(testUser));
        when(petRepo.findById(1)).thenReturn(Optional.of(testPet));
        when(serviceInfoRepo.findById(999)).thenReturn(Optional.empty());

        // Act & Assert
        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> boardingAppointmentService.createBoardingAppointment(
                        1, 1, 999, 1, Appointment.RoomType.PHÒNG_THƯỜNG,
                        startTime, endTime, "Test notes"
                )
        );

        assertEquals("Không tìm thấy dịch vụ", exception.getReason());
        verify(appointmentRepository, never()).save(any(Appointment.class));
    }

    @Test
    void createBoardingAppointment_NonBoardingService() {
        // Arrange
        ServiceInfo groomingService = new ServiceInfo();
        groomingService.setId(2);
        groomingService.setServiceType(ServiceInfo.ServiceType.LÀM_ĐẸP);

        when(userRepo.findById(1)).thenReturn(Optional.of(testUser));
        when(petRepo.findById(1)).thenReturn(Optional.of(testPet));
        when(serviceInfoRepo.findById(2)).thenReturn(Optional.of(groomingService));

        // Act & Assert
        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> boardingAppointmentService.createBoardingAppointment(
                        1, 1, 2, 1, Appointment.RoomType.PHÒNG_THƯỜNG,
                        startTime, endTime, "Test notes"
                )
        );

        assertEquals("Không phải dịch vụ lưu trú", exception.getReason());
        verify(appointmentRepository, never()).save(any(Appointment.class));
    }

    @Test
    void createBoardingAppointment_CenterNotFound() {
        // Arrange
        when(userRepo.findById(1)).thenReturn(Optional.of(testUser));
        when(petRepo.findById(1)).thenReturn(Optional.of(testPet));
        when(serviceInfoRepo.findById(1)).thenReturn(Optional.of(boardingService));
        when(centerRepo.findById(999)).thenReturn(Optional.empty());

        // Act & Assert
        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> boardingAppointmentService.createBoardingAppointment(
                        1, 1, 1, 999, Appointment.RoomType.PHÒNG_THƯỜNG,
                        startTime, endTime, "Test notes"
                )
        );

        assertEquals("Không tìm thấy trung tâm", exception.getReason());
        verify(appointmentRepository, never()).save(any(Appointment.class));
    }

    @Test
    void createBoardingAppointment_NoAvailableRoom() {
        // Arrange
        when(userRepo.findById(1)).thenReturn(Optional.of(testUser));
        when(petRepo.findById(1)).thenReturn(Optional.of(testPet));
        when(serviceInfoRepo.findById(1)).thenReturn(Optional.of(boardingService));
        when(centerRepo.findById(1)).thenReturn(Optional.of(testCenter));
        when(roomRepo.findByCenterIdAndRoomType(1, "STANDARD")).thenReturn(Collections.singletonList(availableRoom));
        when(appointmentRepository.countByRoomIdAndTimeOverlap(1, startTime, endTime)).thenReturn(2L); // Full capacity

        // Act & Assert
        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> boardingAppointmentService.createBoardingAppointment(
                        1, 1, 1, 1, Appointment.RoomType.PHÒNG_THƯỜNG,
                        startTime, endTime, "Test notes"
                )
        );

        assertEquals("Không có phòng STANDARD trống trong khoảng thời gian đã chọn", exception.getReason());
        verify(appointmentRepository, never()).save(any(Appointment.class));
    }

    @Test
    void createBoardingAppointment_RoomNotAvailable() {
        // Arrange
        Room unavailableRoom = new Room();
        unavailableRoom.setId(2);
        unavailableRoom.setRoomType(Appointment.RoomType.PHÒNG_THƯỜNG.toString());
        unavailableRoom.setCapacity(2);
        unavailableRoom.setIsAvailable(false); // Room is not available
        unavailableRoom.setCenter(testCenter);

        when(userRepo.findById(1)).thenReturn(Optional.of(testUser));
        when(petRepo.findById(1)).thenReturn(Optional.of(testPet));
        when(serviceInfoRepo.findById(1)).thenReturn(Optional.of(boardingService));
        when(centerRepo.findById(1)).thenReturn(Optional.of(testCenter));
        when(roomRepo.findByCenterIdAndRoomType(1, "STANDARD")).thenReturn(Collections.singletonList(unavailableRoom));

        // Act & Assert
        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> boardingAppointmentService.createBoardingAppointment(
                        1, 1, 1, 1, Appointment.RoomType.PHÒNG_THƯỜNG,
                        startTime, endTime, "Test notes"
                )
        );

        assertEquals("Không có phòng STANDARD trống trong khoảng thời gian đã chọn", exception.getReason());
        verify(appointmentRepository, never()).save(any(Appointment.class));
    }

    @Test
    void createBoardingAppointment_MultipleRoomsOneAvailable() {
        // Arrange
        Room fullRoom = new Room();
        fullRoom.setId(2);
        fullRoom.setRoomType(Appointment.RoomType.PHÒNG_THƯỜNG.toString());
        fullRoom.setCapacity(2);
        fullRoom.setIsAvailable(true);
        fullRoom.setCenter(testCenter);

        List<Room> rooms = Arrays.asList(fullRoom, availableRoom);

        when(userRepo.findById(1)).thenReturn(Optional.of(testUser));
        when(petRepo.findById(1)).thenReturn(Optional.of(testPet));
        when(serviceInfoRepo.findById(1)).thenReturn(Optional.of(boardingService));
        when(centerRepo.findById(1)).thenReturn(Optional.of(testCenter));
        when(roomRepo.findByCenterIdAndRoomType(1, "STANDARD")).thenReturn(rooms);

        // First room is full, second room has space
        when(appointmentRepository.countByRoomIdAndTimeOverlap(2, startTime, endTime)).thenReturn(2L);
        when(appointmentRepository.countByRoomIdAndTimeOverlap(1, startTime, endTime)).thenReturn(1L);

        when(appointmentRepository.save(any(Appointment.class))).thenAnswer(invocation -> {
            Appointment saved = invocation.getArgument(0);
            saved.setId(1);
            return saved;
        });

        // Act
        Appointment result = boardingAppointmentService.createBoardingAppointment(
                1, 1, 1, 1, Appointment.RoomType.PHÒNG_THƯỜNG,
                startTime, endTime, "Test notes"
        );

        // Assert
        assertNotNull(result);
        assertEquals(availableRoom, result.getRoom());
        verify(appointmentRepository).save(any(Appointment.class));
    }

    @Test
    void createBoardingAppointment_PartialDay() {
        // Arrange
        // Setup time range (2 days and 10 hours)
        LocalDateTime partialStartTime = LocalDateTime.now().plusDays(1);
        LocalDateTime partialEndTime = partialStartTime.plusDays(2).plusHours(10);

        when(userRepo.findById(1)).thenReturn(Optional.of(testUser));
        when(petRepo.findById(1)).thenReturn(Optional.of(testPet));
        when(serviceInfoRepo.findById(1)).thenReturn(Optional.of(boardingService));
        when(centerRepo.findById(1)).thenReturn(Optional.of(testCenter));
        when(roomRepo.findByCenterIdAndRoomType(1, "STANDARD")).thenReturn(Collections.singletonList(availableRoom));
        when(appointmentRepository.countByRoomIdAndTimeOverlap(1, partialStartTime, partialEndTime)).thenReturn(0L);

        when(appointmentRepository.save(any(Appointment.class))).thenAnswer(invocation -> {
            Appointment saved = invocation.getArgument(0);
            saved.setId(1);
            return saved;
        });

        // Act
        Appointment result = boardingAppointmentService.createBoardingAppointment(
                1, 1, 1, 1, Appointment.RoomType.PHÒNG_THƯỜNG,
                partialStartTime, partialEndTime, "Test notes"
        );

        // Assert
        assertNotNull(result);
        // Price should be for 2 days and 10 hours (2 * 120.0 + Math.min(10*5.0, 120.0)) = 240.0 + 50.0 = 290.0
        assertEquals(290.0, result.getPrice());
    }

    @Test
    void createBoardingAppointment_OverDayHourlyPricing() {
        // Arrange
        // Setup time range (1 day and 20 hours - hourly fee would exceed daily rate)
        LocalDateTime overDayStartTime = LocalDateTime.now().plusDays(1);
        LocalDateTime overDayEndTime = overDayStartTime.plusDays(1).plusHours(20);

        when(userRepo.findById(1)).thenReturn(Optional.of(testUser));
        when(petRepo.findById(1)).thenReturn(Optional.of(testPet));
        when(serviceInfoRepo.findById(1)).thenReturn(Optional.of(boardingService));
        when(centerRepo.findById(1)).thenReturn(Optional.of(testCenter));
        when(roomRepo.findByCenterIdAndRoomType(1, "STANDARD")).thenReturn(Collections.singletonList(availableRoom));
        when(appointmentRepository.countByRoomIdAndTimeOverlap(1, overDayStartTime, overDayEndTime)).thenReturn(0L);

        when(appointmentRepository.save(any(Appointment.class))).thenAnswer(invocation -> {
            Appointment saved = invocation.getArgument(0);
            saved.setId(1);
            return saved;
        });

        // Act
        Appointment result = boardingAppointmentService.createBoardingAppointment(
                1, 1, 1, 1, Appointment.RoomType.PHÒNG_THƯỜNG,
                overDayStartTime, overDayEndTime, "Test notes"
        );

        // Assert
        assertNotNull(result);
        // Price should be for 1 day plus another day (since hourly fee would exceed daily rate)
        // 1 * 120.0 + Math.min(20*5.0, 120.0) = 120.0 + 120.0 = 240.0
        assertEquals(240.0, result.getPrice());
    }
}