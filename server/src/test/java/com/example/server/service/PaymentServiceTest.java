package com.example.server.service;

import com.example.server.model.*;
import com.example.server.repository.AppointmentRepo;
import com.example.server.repository.PaymentRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PaymentServiceTest {

    @Mock
    private PaymentRepo paymentRepo;

    @Mock
    private AppointmentRepo appointmentRepo;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private PaymentService paymentService;

    private Appointment testAppointment;
    private Payment testPayment;
    private User testUser;
    private Pet testPet;
    private ServiceInfo testService;
    private Center testCenter;
    private YearMonth expirationDate;

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

        testService = new ServiceInfo();
        testService.setId(1);
        testService.setServiceType(ServiceInfo.ServiceType.KHÁM_BỆNH);
        testService.setBasePrice(300.0);

        testCenter = new Center();
        testCenter.setId(1);

        testAppointment = new Appointment();
        testAppointment.setId(1);
        testAppointment.setUser(testUser);
        testAppointment.setPet(testPet);
        testAppointment.setServiceInfo(testService);
        testAppointment.setCenter(testCenter);
        testAppointment.setType(Appointment.AppointmentType.KHÁM_BỆNH);
        testAppointment.setStatus(Appointment.AppointmentStatus.CHỜ_XÁC_NHẬN);
        testAppointment.setPrice(300.0);

        expirationDate = YearMonth.now().plusMonths(12);

        testPayment = new Payment();
        testPayment.setId(1);
        testPayment.setAppointment(testAppointment);
        testPayment.setAmount(300.0);
        testPayment.setUsername("John Doe");
        testPayment.setCreditNumber("4111111111111111");
        testPayment.setSecurityCode("123");
        testPayment.setExpirationDate(expirationDate);
        testPayment.setPaymentDate(LocalDateTime.now());
        testPayment.setStatus(Payment.PaymentStatus.COMPLETED);
    }

    @Test
    void createPayment_Success() {
        // Arrange
        when(appointmentRepo.findById(1)).thenReturn(Optional.of(testAppointment));
        when(paymentRepo.findByAppointmentId(1)).thenReturn(Optional.empty());
        when(paymentRepo.save(any(Payment.class))).thenReturn(testPayment);

        // Act
        Payment result = paymentService.createPayment(
                1, "John Doe", "4111111111111111", "123", expirationDate);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getId());
        assertEquals(testAppointment, result.getAppointment());
        assertEquals(300.0, result.getAmount());
        assertEquals("John Doe", result.getUsername());
        assertEquals("4111111111111111", result.getCreditNumber());
        assertEquals("123", result.getSecurityCode());
        assertEquals(expirationDate, result.getExpirationDate());
        assertEquals(Payment.PaymentStatus.COMPLETED, result.getStatus());

        // Verify appointment status is updated
        assertEquals(Appointment.AppointmentStatus.ĐÃ_XÁC_NHẬN, testAppointment.getStatus());

        // Verify methods are called
        verify(appointmentRepo).findById(1);
        verify(paymentRepo).findByAppointmentId(1);
        verify(appointmentRepo).save(testAppointment);
        verify(paymentRepo).save(any(Payment.class));
        verify(notificationService).createNotification(eq(testUser), anyString());
    }

    @Test
    void createPayment_AppointmentNotFound() {
        // Arrange
        when(appointmentRepo.findById(999)).thenReturn(Optional.empty());

        // Act & Assert
        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> paymentService.createPayment(
                        999, "John Doe", "4111111111111111", "123", expirationDate)
        );

        assertEquals("Không tìm thấy lịch hẹn với ID: 999", exception.getReason());
        verify(appointmentRepo).findById(999);
        verify(paymentRepo, never()).save(any(Payment.class));
    }

    @Test
    void createPayment_PaymentAlreadyExists() {
        // Arrange
        when(appointmentRepo.findById(1)).thenReturn(Optional.of(testAppointment));
        when(paymentRepo.findByAppointmentId(1)).thenReturn(Optional.of(testPayment));

        // Act & Assert
        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> paymentService.createPayment(
                        1, "John Doe", "4111111111111111", "123", expirationDate)
        );

        assertEquals("Lịch hẹn này đã có thông tin thanh toán", exception.getReason());
        verify(appointmentRepo).findById(1);
        verify(paymentRepo).findByAppointmentId(1);
        verify(paymentRepo, never()).save(any(Payment.class));
    }

    @Test
    void createPayment_NoPriceInformation() {
        // Arrange
        Appointment appointmentWithoutPrice = new Appointment();
        appointmentWithoutPrice.setId(2);
        appointmentWithoutPrice.setUser(testUser);
        appointmentWithoutPrice.setPet(testPet);
        appointmentWithoutPrice.setType(Appointment.AppointmentType.KHÁM_BỆNH);
        appointmentWithoutPrice.setPrice(null); // No price set

        when(appointmentRepo.findById(2)).thenReturn(Optional.of(appointmentWithoutPrice));
        when(paymentRepo.findByAppointmentId(2)).thenReturn(Optional.empty());

        // Act & Assert
        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> paymentService.createPayment(
                        2, "John Doe", "4111111111111111", "123", expirationDate)
        );

        assertEquals("Lịch hẹn không có thông tin giá", exception.getReason());
        verify(appointmentRepo).findById(2);
        verify(paymentRepo).findByAppointmentId(2);
        verify(paymentRepo, never()).save(any(Payment.class));
    }

    @Test
    void getPaymentById_Success() {
        // Arrange
        when(paymentRepo.findById(1)).thenReturn(Optional.of(testPayment));

        // Act
        Payment result = paymentService.getPaymentById(1);

        // Assert
        assertNotNull(result);
        assertEquals(testPayment, result);
        verify(paymentRepo).findById(1);
    }

    @Test
    void getPaymentById_NotFound() {
        // Arrange
        when(paymentRepo.findById(999)).thenReturn(Optional.empty());

        // Act & Assert
        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> paymentService.getPaymentById(999)
        );

        assertEquals("Không tìm thấy thanh toán với ID: 999", exception.getReason());
        verify(paymentRepo).findById(999);
    }

    @Test
    void getPaymentByAppointmentId_Success() {
        // Arrange
        when(paymentRepo.findByAppointmentId(1)).thenReturn(Optional.of(testPayment));

        // Act
        Payment result = paymentService.getPaymentByAppointmentId(1);

        // Assert
        assertNotNull(result);
        assertEquals(testPayment, result);
        verify(paymentRepo).findByAppointmentId(1);
    }

    @Test
    void getPaymentByAppointmentId_NotFound() {
        // Arrange
        when(paymentRepo.findByAppointmentId(999)).thenReturn(Optional.empty());

        // Act & Assert
        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> paymentService.getPaymentByAppointmentId(999)
        );

        assertEquals("Không tìm thấy thanh toán cho lịch hẹn này", exception.getReason());
        verify(paymentRepo).findByAppointmentId(999);
    }

    @Test
    void getAllPayments_Success() {
        // Arrange
        Payment payment2 = new Payment();
        payment2.setId(2);
        List<Payment> expectedPayments = Arrays.asList(testPayment, payment2);
        when(paymentRepo.findAll()).thenReturn(expectedPayments);

        // Act
        List<Payment> result = paymentService.getAllPayments();

        // Assert
        assertEquals(2, result.size());
        assertEquals(expectedPayments, result);
        verify(paymentRepo).findAll();
    }

    @Test
    void refundPayment_Success() {
        // Arrange
        when(paymentRepo.findById(1)).thenReturn(Optional.of(testPayment));
        when(paymentRepo.save(testPayment)).thenReturn(testPayment);

        // Act
        Payment result = paymentService.refundPayment(1);

        // Assert
        assertNotNull(result);
        assertEquals(Payment.PaymentStatus.REFUNDED, result.getStatus());
        assertEquals(Appointment.AppointmentStatus.ĐÃ_HỦY, testAppointment.getStatus());

        verify(paymentRepo).findById(1);
        verify(appointmentRepo).save(testAppointment);
        verify(paymentRepo).save(testPayment);
    }

    @Test
    void refundPayment_NotFound() {
        // Arrange
        when(paymentRepo.findById(999)).thenReturn(Optional.empty());

        // Act & Assert
        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> paymentService.refundPayment(999)
        );

        assertEquals("Không tìm thấy thanh toán với ID: 999", exception.getReason());
        verify(paymentRepo).findById(999);
        verify(paymentRepo, never()).save(any(Payment.class));
    }
}