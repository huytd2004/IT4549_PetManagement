package com.example.server.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "health_record")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HealthRecord { // Thông tin sức khỏe thú cưng
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    @Column(name = "health_record_id")
    private Integer id;
    @ManyToOne
    @JoinColumn(name = "pet_id", nullable = false)
    private Pet pet;
    private LocalDate recordDate;

}
