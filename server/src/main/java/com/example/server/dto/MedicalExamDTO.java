package com.example.server.dto;

import lombok.Data;

import java.util.Date;

@Data
public class MedicalExamDTO {
    private Long id;
    private Date examDate;
    private String diagnosis;
    private String treatment;
    private String notes;
}
