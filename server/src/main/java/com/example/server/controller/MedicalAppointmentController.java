package com.example.server.controller;

import com.example.server.dto.MedicalAppointmentRequest;
import com.example.server.model.Appointment;
import com.example.server.service.MedicalAppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class MedicalAppointmentController {

    @Autowired
    private MedicalAppointmentService medicalAppointmentService;

    @PostMapping("/medicalappointments")
    public ResponseEntity<Appointment> createMedicalAppointment(@RequestBody MedicalAppointmentRequest request) {
        Appointment createdAppointment = medicalAppointmentService.createMedicalAppointment(request);
        return ResponseEntity.ok(createdAppointment);
    }
}