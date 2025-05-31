package com.example.server.repository;

import com.example.server.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepo extends JpaRepository<Room, Integer> {
    List<Room> findByCenterId(int centerId);
    List<Room> findByCenterIdAndRoomType(int centerId, String roomType);
}
