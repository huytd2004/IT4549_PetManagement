package com.example.server.dto;

import lombok.Data;

@Data
public class PetBasicInfoDTO {
    private Integer id;
    private String name;
    private Integer age;
    private String gender;
    private String species;
    private String breed;
    private String furColor;
    private String imageUrl;
    private Integer userId; // Add this field
}