package com.example.server.repository;

import com.example.server.model.HealthRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HealthRecordRepo extends JpaRepository<HealthRecord, Integer> {
    Optional<HealthRecord> findByPetId(int petId);


}
