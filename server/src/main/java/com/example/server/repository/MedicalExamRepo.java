package com.example.server.repository;

import com.example.server.model.MedicalExam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MedicalExamRepo extends JpaRepository<MedicalExam, Integer> {
    // Lấy tất cả MedicalExam của một Pet thông qua Appointment
    @Query("SELECT me FROM MedicalExam me JOIN me.appointment a WHERE a.pet.id = :petId")
    Optional<List<MedicalExam>> findByPetId(@Param("petId") int petId);

    @Query(value = "SELECT me.* FROM medical_exam me " +
            "JOIN appointments a ON me.appointment_id = a.id " +
            "WHERE a.pet_id = :petId " +
            "ORDER BY me.exam_date DESC LIMIT 1",
            nativeQuery = true)
    Optional<MedicalExam> findLatestByPetId(@Param("petId") int petId);

}
