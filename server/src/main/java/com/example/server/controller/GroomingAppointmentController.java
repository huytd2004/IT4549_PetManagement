package com.example.server.controller;

import com.example.server.model.Appointment;
import com.example.server.service.GroomingAppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class GroomingAppointmentController {

    @Autowired
    private GroomingAppointmentService groomingAppointmentService;

    @PostMapping("/groomingappointments")
    public ResponseEntity<Appointment> createGroomingAppointment(@RequestBody Map<String, Object> appointmentData) {
        // Extract parameters from the request body
        int userId = Integer.parseInt(appointmentData.get("userId").toString());
        int petId = Integer.parseInt(appointmentData.get("petId").toString());
        int serviceId = Integer.parseInt(appointmentData.get("serviceId").toString());
        int centerId = Integer.parseInt(appointmentData.get("centerId").toString());
        LocalDateTime startTime = LocalDateTime.parse(appointmentData.get("startTime").toString());
        String customerNotes = appointmentData.containsKey("customerNotes") ?
                (String) appointmentData.get("customerNotes") : null;

        // Create the appointment
        Appointment createdAppointment = groomingAppointmentService.createGroomingAppointment(
                userId, petId, serviceId, centerId, startTime, customerNotes
        );

        return ResponseEntity.ok(createdAppointment);
    }
}