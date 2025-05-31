package com.example.server.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;

@Data
public class ServiceHistoryDTO {
    private String serviceType; // "BoardingService", "GroomingService", or "MedicalService"
    private Double price;
    private String status;
    private LocalDateTime requestTime;

}
