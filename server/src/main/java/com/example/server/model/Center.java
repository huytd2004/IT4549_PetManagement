package com.example.server.model;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "center")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Center {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;
    private String address;
    private String phone;
    private String email;
    private String operatingHours;

//    @ManyToMany
//    @JoinTable(
//            name = "center_services",
//            joinColumns = @JoinColumn(name = "center_id"),
//            inverseJoinColumns = @JoinColumn(name = "service_id"))
//    private Set<Service> services = new HashSet<>();

}
