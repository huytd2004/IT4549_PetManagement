package com.example.server.controller;

import com.example.server.dto.PetBasicInfoDTO;
import com.example.server.dto.PetHealthStatusDTO;
import com.example.server.dto.PetNutritionPlanDTO;
import com.example.server.dto.ServiceHistoryDTO;
import com.example.server.service.PetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pets")
public class PetController {

    private final PetService petService;

    @Autowired
    public PetController(PetService petService) {
        this.petService = petService;
    }

    // 1. Basic Information API
    @GetMapping("/{petId}/basic-info")
    public ResponseEntity<?> getPetBasicInfo(@PathVariable int petId) {
        // Check if user is authorized to access this pet's data
        if (!petService.isAdminOrPetOwner(petId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "You don't have permission to access this pet's information"));
        }

        PetBasicInfoDTO petInfo = petService.getPetBasicInfo(petId);
        return ResponseEntity.ok(petInfo);
    }

    @PostMapping("/basic-info")
    public ResponseEntity<PetBasicInfoDTO> createPetBasicInfo(@RequestBody PetBasicInfoDTO petBasicInfoDTO) {
        PetBasicInfoDTO savedPetInfo = petService.createPetBasicInfo(petBasicInfoDTO);
        return ResponseEntity.ok(savedPetInfo);
    }

    @PutMapping("/{petId}/basic-info")
    public ResponseEntity<?> updatePetBasicInfo(
            @PathVariable int petId,
            @RequestBody PetBasicInfoDTO petBasicInfoDTO) {
        // Check if user is authorized to update this pet's data
        if (!petService.isAdminOrPetOwner(petId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "You don't have permission to update this pet's information"));
        }

        // Set the pet ID from the path variable to ensure we update the correct pet
        petBasicInfoDTO.setId(petId);
        PetBasicInfoDTO updatedPetInfo = petService.updatePetBasicInfo(petBasicInfoDTO);
        return ResponseEntity.ok(updatedPetInfo);
    }

    // Add DELETE endpoint
    @DeleteMapping("/{petId}")
    public ResponseEntity<?> deletePet(@PathVariable int petId) {
        // Check if user is authorized to delete this pet
        if (!petService.isAdminOrPetOwner(petId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "You don't have permission to delete this pet"));
        }

        petService.deletePet(petId);
        return ResponseEntity.ok(Map.of("message", "Pet deleted successfully"));
    }

    // 2. Health Status API
    @GetMapping("/{petId}/health-status")
    public ResponseEntity<?> getPetHealthStatus(@PathVariable int petId) {
        // Check if user is authorized to access this pet's health data
        if (!petService.isAdminOrPetOwner(petId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "You don't have permission to access this pet's health information"));
        }

        PetHealthStatusDTO healthStatus = petService.getPetHealthStatus(petId);
        return ResponseEntity.ok(healthStatus);
    }

    // 3. Nutrition Plan API
    @GetMapping("/{petId}/nutrition-plan")
    public ResponseEntity<?> getPetNutritionPlan(@PathVariable int petId) {
        // Check if user is authorized to access this pet's nutrition data
        if (!petService.isAdminOrPetOwner(petId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "You don't have permission to access this pet's nutrition plan"));
        }

        PetNutritionPlanDTO nutritionPlan = petService.getPetNutritionPlan(petId);
        return ResponseEntity.ok(nutritionPlan);
    }

    // 4. Service History API
    @GetMapping("/{petId}/service-history")
    public ResponseEntity<?> getPetServiceHistory(@PathVariable int petId) {
        // Check if user is authorized to access this pet's service history
        if (!petService.isAdminOrPetOwner(petId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "You don't have permission to access this pet's service history"));
        }

        List<ServiceHistoryDTO> serviceHistory = petService.getPetServiceHistory(petId);
        return ResponseEntity.ok(serviceHistory);
    }
}