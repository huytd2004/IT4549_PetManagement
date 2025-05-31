package com.example.server.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.YearMonth;

@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // One-to-one relationship with Appointment
    @OneToOne
    @JoinColumn(name = "appointment_id", nullable = false, unique = true)
    private Appointment appointment;

    // Payment amount
    @Column(nullable = false)
    private Double amount;

    // Payment information
    @Column(nullable = false)
    private String username;

    @Column(name = "credit_number", nullable = false)
    private String creditNumber;

    @Column(name = "security_code", nullable = false)
    private String securityCode;

    @Column(name = "expiration_date", nullable = false)
    private YearMonth expirationDate;

    // Additional useful fields
    @Column(name = "payment_date")
    private java.time.LocalDateTime paymentDate;

    @Column(name = "payment_status")
    @Enumerated(EnumType.STRING)
    private PaymentStatus status;

    // Payment status enum
    public enum PaymentStatus {
        PENDING,
        COMPLETED,
        FAILED,
        REFUNDED
    }
}