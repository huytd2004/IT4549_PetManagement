package com.example.server.service;

import com.example.server.model.Appointment;
import com.example.server.model.Payment;
import com.example.server.repository.AppointmentRepo;
import com.example.server.repository.NotificationsRepo;
import com.example.server.repository.PaymentRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PaymentService {

    @Autowired
    private PaymentRepo paymentRepo;

    @Autowired
    private AppointmentRepo appointmentRepo;
    @Autowired
    private NotificationService notificationService;

    public Payment createPayment(Integer appointmentId, String username, String creditNumber,
                                 String securityCode, YearMonth expirationDate) {

        Appointment appointment = appointmentRepo.findById(appointmentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Không tìm thấy lịch hẹn với ID: " + appointmentId));

        // Check if payment already exists
        Optional<Payment> existingPayment = paymentRepo.findByAppointmentId(appointmentId);
        if (existingPayment.isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Lịch hẹn này đã có thông tin thanh toán");
        }

        // Validate that appointment has a price
        if (appointment.getPrice() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Lịch hẹn không có thông tin giá");
        }

        Payment payment = new Payment();
        payment.setAppointment(appointment);
        payment.setAmount(appointment.getPrice());
        payment.setUsername(username);
        payment.setCreditNumber(creditNumber);
        payment.setSecurityCode(securityCode);
        payment.setExpirationDate(expirationDate);
        payment.setPaymentDate(LocalDateTime.now());
        payment.setStatus(Payment.PaymentStatus.COMPLETED);

        // Update appointment status to ĐÃ_XÁC_NHẬN
        appointment.setStatus(Appointment.AppointmentStatus.ĐÃ_XÁC_NHẬN);
        appointmentRepo.save(appointment);
        // Create notification for the user
        String message = "Thanh toán thành công cho dịch vụ " +
                getServiceTypeString(appointment.getType()) +
                " với số tiền " + payment.getAmount() + "đ.";
        notificationService.createNotification(appointment.getUser(), message);

        return paymentRepo.save(payment);
    }
    private String getServiceTypeString(Appointment.AppointmentType type) {
        switch (type) {
            case KHÁM_BỆNH: return "khám bệnh";
            case LÀM_ĐẸP: return "làm đẹp";
            case LƯU_TRÚ: return "lưu trú";
            default: return "";
        }
    }

    public Payment getPaymentById(Integer paymentId) {
        return paymentRepo.findById(paymentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Không tìm thấy thanh toán với ID: " + paymentId));
    }

    public Payment getPaymentByAppointmentId(Integer appointmentId) {
        return paymentRepo.findByAppointmentId(appointmentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Không tìm thấy thanh toán cho lịch hẹn này"));
    }

    public List<Payment> getAllPayments() {
        return paymentRepo.findAll();
    }

    public Payment refundPayment(Integer paymentId) {
        Payment payment = paymentRepo.findById(paymentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Không tìm thấy thanh toán với ID: " + paymentId));

        payment.setStatus(Payment.PaymentStatus.REFUNDED);

        // Update appointment status if needed
        Appointment appointment = payment.getAppointment();
        appointment.setStatus(Appointment.AppointmentStatus.ĐÃ_HỦY);
        appointmentRepo.save(appointment);

        return paymentRepo.save(payment);
    }
}
