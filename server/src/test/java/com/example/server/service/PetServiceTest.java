package com.example.server.service;

import com.example.server.dto.PetBasicInfoDTO;
import com.example.server.dto.PetHealthStatusDTO;
import com.example.server.model.*;
import com.example.server.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PetServiceTest {

    @Mock
    private PetRepo petRepository;

    @Mock
    private HealthRecordRepo healthRecordRepository;

    @Mock
    private AppointmentRepo appointmentRepository;

    @Mock
    private MedicalExamRepo medicalExamRepository;

    @Mock
    private UserRepo userRepository;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private PetService petService;

    private Pet testPet;
    private User testUser;
    private MedicalExam testMedicalExam;

    @BeforeEach
    void setUp() {
        // Setup test user
        testUser = new User();
        testUser.setId(1);
        testUser.setUserUsername("testuser");

        // Setup test pet
        testPet = new Pet();
        testPet.setId(1);
        testPet.setPetName("Fluffy");
        testPet.setSpecies("Cat");
        testPet.setBreed("Persian");
        testPet.setGender("Female");
        testPet.setAge(3);
        testPet.setFurColor("White");
        testPet.setImageUrl("http://example.com/fluffy.jpg");
        testPet.setUser(testUser);

        // Setup test medical exam
        testMedicalExam = new MedicalExam();
        testMedicalExam.setId(1);
        testMedicalExam.setExamDate(LocalDateTime.now());
        testMedicalExam.setSymptom("Coughing");
        testMedicalExam.setDiagnosis("Minor respiratory infection");
        testMedicalExam.setVaccineName("Rabies");
        testMedicalExam.setVaccinationInfo("Annual booster");
        testMedicalExam.setChedoan("High protein diet");
        testMedicalExam.setKhauphanan("100g per day");
        testMedicalExam.setTịmeapdung("22/54/2023");

        // Setup security context
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    void testIsPetOwner_WhenUserIsOwner_ReturnsTrue() {
        // Arrange
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("testuser");
        when(petRepository.findById(1)).thenReturn(Optional.of(testPet));

        // Act
        boolean result = petService.isPetOwner(1);

        // Assert
        assertTrue(result);
        verify(petRepository).findById(1);
        verify(authentication).getName();
    }

    @Test
    void testIsPetOwner_WhenUserIsNotOwner_ReturnsFalse() {
        // Arrange
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("anotheruser");
        when(petRepository.findById(1)).thenReturn(Optional.of(testPet));

        // Act
        boolean result = petService.isPetOwner(1);

        // Assert
        assertFalse(result);
        verify(petRepository).findById(1);
        verify(authentication).getName();
    }

//    @Test
//    void testIsAdminOrPetOwner_WhenUserIsAdmin_ReturnsTrue() {
//        // Arrange
//        when(securityContext.getAuthentication()).thenReturn(authentication);
//
//        // Fix: Create a list of GrantedAuthority objects instead of SimpleGrantedAuthority
//        List<GrantedAuthority> authorities = Collections.singletonList(
//                new SimpleGrantedAuthority("ROLE_ADMIN"));
//
//        // This will now match the return type of getAuthorities()
//        when(authentication.getAuthorities()).thenReturn(authorities);
//
//        // Act
//        boolean result = petService.isAdminOrPetOwner(1);
//
//        // Assert
//        assertTrue(result);
//        verify(authentication).getAuthorities();
//        verifyNoInteractions(petRepository); // Pet is not checked if user is admin
//    }

    @Test
    void testGetPetBasicInfo_ReturnsCorrectInfo() {
        // Arrange
        when(petRepository.findById(1)).thenReturn(Optional.of(testPet));

        // Act
        PetBasicInfoDTO result = petService.getPetBasicInfo(1);

        // Assert
        assertEquals(testPet.getId(), result.getId());
        assertEquals(testPet.getPetName(), result.getName());
        assertEquals(testPet.getGender(), result.getGender());
        assertEquals(testPet.getSpecies(), result.getSpecies());
        assertEquals(testPet.getBreed(), result.getBreed());
        assertEquals(testPet.getFurColor(), result.getFurColor());
        assertEquals(testPet.getImageUrl(), result.getImageUrl());
        assertEquals(testPet.getAge(), result.getAge());
    }

    @Test
    void testCreatePetBasicInfo_Success() {
        // Arrange
        PetBasicInfoDTO inputDto = new PetBasicInfoDTO();
        inputDto.setName("Buddy");
        inputDto.setGender("Male");
        inputDto.setSpecies("Dog");
        inputDto.setBreed("Golden Retriever");
        inputDto.setFurColor("Golden");
        inputDto.setImageUrl("http://example.com/buddy.jpg");
        inputDto.setAge(2);
        inputDto.setUserId(1);

        when(userRepository.findById(1)).thenReturn(Optional.of(testUser));
        when(petRepository.save(any(Pet.class))).thenAnswer(invocation -> {
            Pet savedPet = invocation.getArgument(0);
            savedPet.setId(2); // Simulate auto-generated id
            return savedPet;
        });

        // Act
        PetBasicInfoDTO result = petService.createPetBasicInfo(inputDto);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.getId());
        assertEquals("Buddy", result.getName());
        assertEquals("Male", result.getGender());
        assertEquals("Dog", result.getSpecies());
        assertEquals("Golden Retriever", result.getBreed());
        verify(petRepository).save(any(Pet.class));
    }

    @Test
    void testUpdatePetBasicInfo_Success() {
        // Arrange
        PetBasicInfoDTO inputDto = new PetBasicInfoDTO();
        inputDto.setId(1);
        inputDto.setName("Fluffy Updated");
        inputDto.setGender("Female");
        inputDto.setSpecies("Cat");
        inputDto.setBreed("Persian");
        inputDto.setFurColor("Gray");
        inputDto.setImageUrl("http://example.com/fluffy_updated.jpg");
        inputDto.setAge(4);

        when(petRepository.findById(1)).thenReturn(Optional.of(testPet));
        when(petRepository.save(any(Pet.class))).thenReturn(testPet);

        // Act
        PetBasicInfoDTO result = petService.updatePetBasicInfo(inputDto);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getId());
        assertEquals("Fluffy Updated", result.getName());
        assertEquals("Gray", result.getFurColor());
        assertEquals(4, result.getAge());
        verify(petRepository).save(testPet);
    }

    @Test
    void testDeletePet_Success() {
        // Arrange
        when(petRepository.findById(1)).thenReturn(Optional.of(testPet));

        // Act
        petService.deletePet(1);

        // Assert
        verify(petRepository).findById(1);
        verify(petRepository).delete(testPet);
    }

    @Test
    void testGetPetHealthStatus_WithExistingMedicalExam() {
        // Arrange
        when(petRepository.findById(1)).thenReturn(Optional.of(testPet));
        when(medicalExamRepository.findLatestByPetId(1)).thenReturn(Optional.of(testMedicalExam));

        List<MedicalExam> examList = new ArrayList<>();
        examList.add(testMedicalExam);
        when(medicalExamRepository.findByPetId(1)).thenReturn(Optional.of(examList));

        // Act
        PetHealthStatusDTO result = petService.getPetHealthStatus(1);

        // Assert
        assertNotNull(result);
        assertEquals(testMedicalExam.getSymptom(), result.getSymptom());
        assertEquals(testMedicalExam.getDiagnosis(), result.getDiagnosis());
        assertEquals(1, result.getVaccinationHistory().size());
        assertEquals(testMedicalExam.getVaccineName(), result.getVaccinationHistory().get(0).getVaccineName());
    }

    @Test
    void testGetPetHealthStatus_WithoutMedicalExam() {
        // Arrange
        when(petRepository.findById(1)).thenReturn(Optional.of(testPet));
        when(medicalExamRepository.findLatestByPetId(1)).thenReturn(Optional.empty());

        // Act
        PetHealthStatusDTO result = petService.getPetHealthStatus(1);

        // Assert
        assertNotNull(result);
        assertTrue(result.getVaccinationHistory().isEmpty());
    }

    @Test
    void testGetPetNutritionPlan_ReturnsCorrectData() {
        // Arrange
        when(medicalExamRepository.findLatestByPetId(1)).thenReturn(Optional.of(testMedicalExam));

        // Act
        var result = petService.getPetNutritionPlan(1);

        // Assert
        assertNotNull(result);
        assertEquals(testMedicalExam.getChedoan(), result.getChedoan());
        assertEquals(testMedicalExam.getKhauphanan(), result.getKhauphanan());
        assertEquals(testMedicalExam.getTịmeapdung(), result.getTimeapdung());
    }

    @Test
    void testGetPetBasicInfo_PetNotFound_ThrowsException() {
        // Arrange
        when(petRepository.findById(anyInt())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(IllegalStateException.class, () -> petService.getPetBasicInfo(1));
    }

    @Test
    void testCreatePetBasicInfo_UserNotFound_ThrowsException() {
        // Arrange
        PetBasicInfoDTO inputDto = new PetBasicInfoDTO();
        inputDto.setName("Buddy");
        inputDto.setUserId(999); // Non-existent user ID

        when(userRepository.findById(999)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> petService.createPetBasicInfo(inputDto));
    }
}