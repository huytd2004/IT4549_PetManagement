package com.example.server.service;

import com.example.server.dto.*;
import com.example.server.model.*;
import com.example.server.repository.*;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.Year;
import java.util.Calendar;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PetService {

    private final PetRepo petRepository;
    private final HealthRecordRepo healthRecordRepository;
    private final AppointmentRepo appointmentRepository;
    private final MedicalExamRepo medicalExamRepository;

    @Autowired
    public PetService(PetRepo petRepository,
                      HealthRecordRepo healthRecordRepository,
                      AppointmentRepo appointmentRepository,
                        MedicalExamRepo medicalExamRepository) {
        this.petRepository = petRepository;
        this.healthRecordRepository = healthRecordRepository;
        this.appointmentRepository = appointmentRepository;
        this.medicalExamRepository = medicalExamRepository;

    }
    // Check if the currently authenticated user owns the pet
    public boolean isPetOwner(int petId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();

        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new IllegalStateException("Pet not found with id: " + petId));

        return pet.getUser().getUserUsername().equals(currentUsername);
    }

    // Method to check if user is admin or pet owner
    public boolean isAdminOrPetOwner(int petId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (isAdmin) {
            return true;
        }

        return isPetOwner(petId);
    }
    // 1. Basic Information
    public PetBasicInfoDTO getPetBasicInfo(int petId) {
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new IllegalStateException("Pet not found with id: " + petId));
        PetBasicInfoDTO petBasicInfoDTO = new PetBasicInfoDTO();
        petBasicInfoDTO.setId(pet.getId());
        petBasicInfoDTO.setName(pet.getPetName());
        petBasicInfoDTO.setGender(pet.getGender());
        petBasicInfoDTO.setSpecies(pet.getSpecies());
        petBasicInfoDTO.setBreed(pet.getBreed());
        petBasicInfoDTO.setFurColor(pet.getFurColor());
        petBasicInfoDTO.setImageUrl(pet.getImageUrl());
        petBasicInfoDTO.setAge(pet.getAge());
        return petBasicInfoDTO;
    }
    @Autowired
    private UserRepo userRepository; // Add this repository

    public PetBasicInfoDTO createPetBasicInfo(PetBasicInfoDTO petBasicInfoDTO) {
        try {
            // Tạo mới đối tượng Pet
            Pet pet = new Pet();

            // Đặt các thuộc tính
            pet.setPetName(petBasicInfoDTO.getName());
            pet.setGender(petBasicInfoDTO.getGender());
            pet.setSpecies(petBasicInfoDTO.getSpecies());
            pet.setBreed(petBasicInfoDTO.getBreed());
            pet.setFurColor(petBasicInfoDTO.getFurColor() != null ? petBasicInfoDTO.getFurColor() : "");
            pet.setImageUrl(petBasicInfoDTO.getImageUrl() != null ? petBasicInfoDTO.getImageUrl() : "");

            if (petBasicInfoDTO.getAge() != null) {
                pet.setAge(petBasicInfoDTO.getAge());
            }

            // Set user based on userId
            if (petBasicInfoDTO.getUserId() != null) {
                User user = userRepository.findById(petBasicInfoDTO.getUserId())
                        .orElseThrow(() -> new RuntimeException("User not found with id: " + petBasicInfoDTO.getUserId()));
                pet.setUser(user);
            } else {
                throw new RuntimeException("UserId is required to create a pet");
            }

            // Lưu pet và lấy kết quả
            Pet savedPet = petRepository.save(pet);

            // Map to DTO
            PetBasicInfoDTO result = new PetBasicInfoDTO();
            result.setId(savedPet.getId());
            result.setName(savedPet.getPetName());
            result.setGender(savedPet.getGender());
            result.setSpecies(savedPet.getSpecies());
            result.setBreed(savedPet.getBreed());
            result.setFurColor(savedPet.getFurColor());
            result.setImageUrl(savedPet.getImageUrl());
            result.setAge(savedPet.getAge());
            result.setUserId(petBasicInfoDTO.getUserId());

            return result;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Không thể tạo thông tin thú cưng: " + e.getMessage(), e);
        }
    }
    public PetBasicInfoDTO updatePetBasicInfo(PetBasicInfoDTO petBasicInfoDTO) {
        // Check if pet exists
        Pet pet = petRepository.findById(petBasicInfoDTO.getId())
                .orElseThrow(() -> new IllegalStateException("Pet not found with id: " + petBasicInfoDTO.getId()));

        // Update pet properties
        pet.setPetName(petBasicInfoDTO.getName());
        pet.setGender(petBasicInfoDTO.getGender());
        pet.setSpecies(petBasicInfoDTO.getSpecies());
        pet.setBreed(petBasicInfoDTO.getBreed());
        pet.setFurColor(petBasicInfoDTO.getFurColor() != null ? petBasicInfoDTO.getFurColor() : pet.getFurColor());
        pet.setImageUrl(petBasicInfoDTO.getImageUrl() != null ? petBasicInfoDTO.getImageUrl() : pet.getImageUrl());
        pet.setAge(petBasicInfoDTO.getAge() != null ? petBasicInfoDTO.getAge() : pet.getAge());

        // If userId is provided and different, update the user
        if (petBasicInfoDTO.getUserId() != null && pet.getUser().getId() != petBasicInfoDTO.getUserId()) {
            User user = userRepository.findById(petBasicInfoDTO.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + petBasicInfoDTO.getUserId()));
            pet.setUser(user);
        }

        // Save updated pet
        Pet updatedPet = petRepository.save(pet);

        // Map to DTO for response
        PetBasicInfoDTO result = new PetBasicInfoDTO();
        result.setId(updatedPet.getId());
        result.setName(updatedPet.getPetName());
        result.setGender(updatedPet.getGender());
        result.setSpecies(updatedPet.getSpecies());
        result.setBreed(updatedPet.getBreed());
        result.setFurColor(updatedPet.getFurColor());
        result.setImageUrl(updatedPet.getImageUrl());
        result.setAge(updatedPet.getAge());
        result.setUserId(updatedPet.getUser().getId());

        return result;
    }
    // Add delete pet method
    public void deletePet(int petId) {
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new IllegalStateException("Pet not found with id: " + petId));

        petRepository.delete(pet);
    }
    // 2. Health Status
    public PetHealthStatusDTO getPetHealthStatus(int petId) {
        try {
            // First check if pet exists
            Pet pet = petRepository.findById(petId)
                    .orElseThrow(() -> new IllegalStateException("Pet not found with id: " + petId));

            // Find latest medical exam, but handle case where none exists
            Optional<MedicalExam> latestExamOpt = medicalExamRepository.findLatestByPetId(petId);

            PetHealthStatusDTO dto = new PetHealthStatusDTO();

            if (latestExamOpt.isPresent()) {
                MedicalExam medicalExam = latestExamOpt.get();
                dto.setExamDate(medicalExam.getExamDate());
                dto.setSymptom(medicalExam.getSymptom());
                dto.setDiagnosis(medicalExam.getDiagnosis());

                // Get all medical exams for vaccination history
                List<MedicalExam> allExams = medicalExamRepository.findByPetId(petId)
                        .orElse(List.of()); // Return empty list if none found

                // Transform to vaccination history DTOs
                List<VaccinationHistoryDTO> vaccinationHistory = allExams.stream()
                        .filter(exam -> exam.getVaccineName() != null && !exam.getVaccineName().isEmpty())
                        .map(exam -> {
                            VaccinationHistoryDTO vaccineDto = new VaccinationHistoryDTO();
                            vaccineDto.setVaccineName(exam.getVaccineName());
                            vaccineDto.setVaccineDate(exam.getExamDate().toLocalDate());
                            vaccineDto.setNotes(exam.getVaccinationInfo());
                            return vaccineDto;
                        })
                        .collect(Collectors.toList());

                dto.setVaccinationHistory(vaccinationHistory);
            } else {
                // No medical exam found, return empty data
                dto.setVaccinationHistory(List.of());
            }

            return dto;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error retrieving pet health status: " + e.getMessage(), e);
        }
    }

    // 3. Nutrition Plan
    public PetNutritionPlanDTO getPetNutritionPlan(int petId) {
        MedicalExam medicalExam = medicalExamRepository.findLatestByPetId(petId)
                .orElseThrow(() -> new IllegalStateException("Health record not found for pet id: " + petId));
        PetNutritionPlanDTO dto = new PetNutritionPlanDTO();
        dto.setChedoan(medicalExam.getChedoan());
        dto.setKhauphanan(medicalExam.getKhauphanan());
        dto.setTimeapdung(medicalExam.getTịmeapdung());
        return dto;
    }

    // 4. Service History
    public List<ServiceHistoryDTO> getPetServiceHistory(int petId) {
        List<Appointment> appointments = appointmentRepository.findByPetIdOrderByStartTimeDesc(petId);
        return appointments.stream()
                .map(appointment -> {
                    ServiceHistoryDTO dto = new ServiceHistoryDTO();
                    // Set service type based on appointment type
                    if (appointment.isMedicalService()) {
                        dto.setServiceType("MedicalService");
                    } else if (appointment.isBoardingService()) {
                        dto.setServiceType("BoardingService");
                    } else if (appointment.isGroomingService()) {
                        dto.setServiceType("GroomingService");
                    }

                    dto.setPrice(appointment.getPrice());
                    dto.setStatus(appointment.getStatus().toString());
                    dto.setRequestTime(appointment.getRequestTime());

                    return dto;
                })
                .collect(Collectors.toList());}}

