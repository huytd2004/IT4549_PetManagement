package com.example.server.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class PetHealthStatusDTO {
//    private int id;
    private LocalDateTime examDate;
    private String symptom; //triệu chứng
    private String diagnosis; //chẩn đoán
    private List<VaccinationHistoryDTO> vaccinationHistory; //Thông tin tiêm chủng
}
