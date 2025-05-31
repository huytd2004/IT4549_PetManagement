package com.example.server.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "medical_exam")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicalExam { // Thông tin khám bệnh
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    @Column(name = "medical_exam_id")
    private Integer id;
    //    @ManyToOne
//    @JoinColumn(name = "record_id", nullable = false)
//    private HealthRecord healthRecord;
    @OneToOne
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;


//    @ManyToOne
//    @JoinColumn(name = "veterinarian_id", nullable = false)
//    private User veterinarian;

    private LocalDateTime examDate;
    private String symptom; //triệu chứng
    private String diagnosis; //chẩn đoán
    private String treatment;
    private String notes;
    private String vaccineName;
    private String vaccinationInfo; //Thông tin tiêm chủng
    private String chedoan; //Chế độ ăn
    private String tịmeapdung; //Thời gian áp dụng
    private String khauphanan; //Khẩu phần ăn
}