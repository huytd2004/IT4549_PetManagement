package com.example.server.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class VaccinationHistoryDTO {
    private String vaccineName;
    private LocalDate vaccineDate;
    private String notes;
}
