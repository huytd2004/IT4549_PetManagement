package com.example.server.repository;

import com.example.server.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepo extends JpaRepository<Appointment, Integer> {
    List<Appointment> findByPetIdOrderByStartTimeDesc(int petId);

    List<Appointment> findByUserIdAndStatus(int userId, Appointment.AppointmentStatus status);

    List<Appointment> findByVeterinarianIdAndStartTimeBetween(
            Integer veterinarianId, LocalDateTime start, LocalDateTime end);


    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.room.id = :roomId " +
            "AND a.status != 'ĐÃ_HỦY' " +
            "AND ((a.startTime <= :endTime AND a.endTime >= :startTime))")
    long countByRoomIdAndTimeOverlap(int roomId, LocalDateTime startTime, LocalDateTime endTime);
}
