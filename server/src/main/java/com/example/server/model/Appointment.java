package com.example.server.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // Thông tin người dùng và thú cưng
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "pet_id", nullable = false)
    private Pet pet;

    // Thông tin dịch vụ và trung tâm
    @ManyToOne
    @JoinColumn(name = "service_id", nullable = false)
    private ServiceInfo serviceInfo;

    @ManyToOne
    @JoinColumn(name = "center_id", nullable = false)
    private Center center;

    // Thông tin thời gian
    private LocalDateTime requestTime; // Thời gian yêu cầu
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    // Thông tin trạng thái
    @Enumerated(EnumType.STRING)
    private AppointmentStatus status;
    @Enumerated(EnumType.STRING)
    private AppointmentType type;

    // Thông tin nhân viên
    @ManyToOne
    @JoinColumn(name = "assigned_staff_id")
    private User assignedStaff; // Nhân viên được phân công (nếu là dịch vụ làm đẹp)
    @ManyToOne
    @JoinColumn(name = "veterinarian_id")
    private User veterinarian; // Bác sĩ thú y (nếu là dịch vụ khám bệnh)

    // Thông tin phòng (cho dịch vụ lưu trú)
    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;
    @Enumerated(EnumType.STRING)
    private RoomType appointmentRoomType; // PHÒNG_THƯỜNG, PHÒNG_VIP
//    private String boardingStatus; // Trạng thái lưu trú

    // Thông tin ghi chú
    private String customerNotes;  // Ghi chú từ khách hàng
    private String staffNotes;     // Ghi chú từ nhân viên
    //    private String resultNotes;    // Kết quả khám/chẩn đoán
    @OneToOne(mappedBy = "appointment")
    private MedicalExam medicalExam;

    // Thông tin thanh toán
    private Double price; // Giá ước tính khi đặt lịch
    // Enum định nghĩa loại dịch vụ
    public enum AppointmentType {
        KHÁM_BỆNH,
        LƯU_TRÚ,
        LÀM_ĐẸP
    }

    // Enum định nghĩa trạng thái
    public enum AppointmentStatus {
        CHỜ_XÁC_NHẬN,     // Mới tạo, chờ xác nhận
        ĐÃ_XÁC_NHẬN,      // Đã xác nhận với khách
        ĐÃ_HỦY,           // Đã hủy bởi khách hoặc hệ thống
        ĐANG_THỰC_HIỆN,   // Đang được thực hiện
        HOÀN_THÀNH,       // Đã hoàn thành dịch vụ
    }
    public enum RoomType {
        PHÒNG_THƯỜNG,
        PHÒNG_VIP
    }

    // Các phương thức tiện ích
    public boolean isMedicalService() {
        return type == AppointmentType.KHÁM_BỆNH;
    }

    public boolean isBoardingService() {
        return type == AppointmentType.LƯU_TRÚ;
    }

    public boolean isGroomingService() {
        return type == AppointmentType.LÀM_ĐẸP;
    }

}