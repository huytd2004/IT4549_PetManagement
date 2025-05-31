package com.example.server.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "service")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ServiceInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "service_id")
    private Integer id;

    @Enumerated(EnumType.STRING)
    private ServiceType serviceType; // KHÁM_BỆNH, LƯU_TRÚ, LÀM_ĐẸP

    // Common fields for all services
    private String name;
    private String description;
    private Double basePrice;

    // Fields specific to Boarding Service
    @Enumerated(EnumType.STRING)
    private RoomType roomType; // PHÒNG_THƯỜNG, PHÒNG_VIP
    private Double pricePerDay; // Giá theo ngày
    private Double pricePerHour; // Giá theo giờ
//    private Integer maxCapacity; // Số thú cưng tối đa

    // Fields specific to Grooming Service
//    @Enumerated(EnumType.STRING)
//    private GroomingType groomingType; // CẮT_TỈA, TẮM, VỆ_SINH

    // Fields specific to Medical Service
//    @Enumerated(EnumType.STRING)
//    private MedicalCategory serviceCategory; // KHÁM_TỔNG_QUÁT, TIÊM_PHÒNG, XÉT_NGHIỆM

//    @ManyToMany(mappedBy = "services")
//    private Set<Center> centers = new HashSet<>();

    public enum ServiceType {
        KHÁM_BỆNH,
        LƯU_TRÚ,
        LÀM_ĐẸP
    }

    public enum RoomType {
        PHÒNG_THƯỜNG,
        PHÒNG_VIP
    }

//    public enum GroomingType {
//        CẮT_TỈA,
//        TẮM,
//        VỆ_SINH,
//        SPA,
//        NHỔ_LÔNG
//    }
//
//    public enum MedicalCategory {
//        KHÁM_TỔNG_QUÁT,
//        TIÊM_PHÒNG,
//        XÉT_NGHIỆM,
//        PHẪU_THUẬT,
//        CHỤP_CHIẾU
//    }
}