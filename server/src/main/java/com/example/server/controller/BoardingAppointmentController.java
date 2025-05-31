package com.example.server.controller;

import com.example.server.model.Appointment;
import com.example.server.model.Room;
import com.example.server.service.BoardingAppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class BoardingAppointmentController {

    @Autowired
    private BoardingAppointmentService boardingAppointmentService;

    @PostMapping("/boardingappointments")
    public ResponseEntity<Appointment> createBoardingAppointment(@RequestBody Map<String, Object> appointmentData) {
        // Trích xuất thông tin từ dữ liệu đầu vào
        int userId = Integer.parseInt(appointmentData.get("userId").toString());
        int petId = Integer.parseInt(appointmentData.get("petId").toString());
        int serviceId = Integer.parseInt(appointmentData.get("serviceId").toString());
        int centerId = Integer.parseInt(appointmentData.get("centerId").toString());
        Appointment.RoomType roomType = Appointment.RoomType.valueOf(appointmentData.get("roomType").toString());
        LocalDateTime startTime = LocalDateTime.parse(appointmentData.get("startTime").toString());
        LocalDateTime endTime = LocalDateTime.parse(appointmentData.get("endTime").toString());
        String customerNotes = appointmentData.containsKey("customerNotes") ?
                (String) appointmentData.get("customerNotes") : null;

        // Tạo lịch hẹn và tự động chọn phòng
        Appointment createdAppointment = boardingAppointmentService.createBoardingAppointment(
                userId, petId, serviceId, centerId, roomType, startTime, endTime, customerNotes
        );

        return ResponseEntity.ok(createdAppointment);
    }
}