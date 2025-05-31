package com.example.server.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "room")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "center_id", nullable = false)
    private Center center;

    private String roomNumber;
    private String roomType; // Loại phòng (ví dụ: phòng đơn, phòng đôi, phòng VIP, v.v.)
//    @Enumerated(EnumType.STRING)
//    private BoardingService.RoomType roomType;

    private Integer capacity;
    private Boolean isAvailable = true;

//    @OneToMany(mappedBy = "room")
//    private List<ServiceUsage> currentBoardings;
}