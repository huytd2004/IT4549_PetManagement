package com.example.server.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class MedicalAppointmentRequest {
    private Integer userId;
    private Integer petId;
    private Integer serviceId;
    private Integer centerId;
    private LocalDateTime startTime;
//    private LocalDateTime endTime;
    private String customerNotes;
}