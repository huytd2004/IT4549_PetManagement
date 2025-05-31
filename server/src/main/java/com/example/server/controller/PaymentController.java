package com.example.server.controller;

import com.example.server.model.Payment;
import com.example.server.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.YearMonth;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping
    public ResponseEntity<Payment> createPayment(@RequestBody Map<String, Object> paymentRequest) {
        Integer appointmentId = (Integer) paymentRequest.get("appointmentId");
        String username = (String) paymentRequest.get("username");
        String creditNumber = (String) paymentRequest.get("creditNumber");
        String securityCode = (String) paymentRequest.get("securityCode");
        String expirationDateStr = (String) paymentRequest.get("expirationDate"); // Format: yyyy-MM

        YearMonth expirationDate = YearMonth.parse(expirationDateStr);

        Payment payment = paymentService.createPayment(
                appointmentId, username, creditNumber, securityCode, expirationDate);

        return new ResponseEntity<>(payment, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Payment> getPaymentById(@PathVariable Integer id) {
        Payment payment = paymentService.getPaymentById(id);
        return ResponseEntity.ok(payment);
    }

    @GetMapping("/appointment/{appointmentId}")
    public ResponseEntity<Payment> getPaymentByAppointmentId(@PathVariable Integer appointmentId) {
        Payment payment = paymentService.getPaymentByAppointmentId(appointmentId);
        return ResponseEntity.ok(payment);
    }

    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayments() {
        List<Payment> payments = paymentService.getAllPayments();
        return ResponseEntity.ok(payments);
    }

    @PostMapping("/{id}/refund")
    public ResponseEntity<Payment> refundPayment(@PathVariable Integer id) {
        Payment payment = paymentService.refundPayment(id);
        return ResponseEntity.ok(payment);
    }
}