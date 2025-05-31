package com.example.server.model;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(exclude = {"roles", "pets"})
@ToString(exclude = {"roles", "pets"})
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer id;
    @Column(name = "user_name", nullable = false)
    private String userName;
    @Column(name = "user_username", nullable = false, unique = true)
    private String userUsername;
    @Column(name = "user_password", nullable = false)
    private String userPassword;
    @Column(name = "user_dob", nullable = false)
    private String userDob;  // Nếu lưu dạng chuỗi "yyyy-MM-dd", có thể dùng String. Nếu dùng java.util.Date thì cần đổi kiểu.
    @Column(name = "user_phone", nullable = false)
    private String userPhone;
    @Column(name = "user_email", nullable = false, unique = true)
    private String userEmail;
    @Column(name = "user_address")
    private String userAddress;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_role",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Pet> pets = new ArrayList<>();


}
