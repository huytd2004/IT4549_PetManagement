package com.example.server.model;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.Set;

@Entity
@Table(name = "pet")
@Data // Tự động sinh getter/setter
@NoArgsConstructor
@AllArgsConstructor
public class Pet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pet_id")
    private int id;
    @Column(name = "pet_name", nullable = false)
    private String petName;
    @Column(name = "pet_age", nullable = false)
    private Integer age;
    @Column(name = "pet_gender", nullable = false)
    private String gender;
    @Column(name = "pet_species", nullable = false)
    private String species;
    @Column(name = "pet_breed", nullable = false)
    private String breed;
    @Column(name = "pet_fur_color", nullable = false)
    private String furColor;
    @Column(name = "pet_images", nullable = true)
    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;  // Assuming User is another entity that relates to Pet


}
