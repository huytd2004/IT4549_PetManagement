package com.example.server.service;

import com.example.server.model.Appointment;
import com.example.server.model.Notifications;
import com.example.server.model.User;
import com.example.server.repository.NotificationsRepo;
import com.example.server.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@Transactional
public class NotificationService {

    @Autowired
    private NotificationsRepo notificationRepo;

    @Autowired
    private UserRepo userRepo;

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public List<Notifications> getAllNotificationsByUserId(Integer userId) {
        return notificationRepo.findByUserIdOrderBySendAtDesc(userId);
    }

    public List<Notifications> getUnreadNotificationsByUserId(Integer userId) {
        return notificationRepo.findByUserIdAndIsReadOrderBySendAtDesc(userId, false);
    }

    public long getUnreadNotificationsCount(Integer userId) {
        return notificationRepo.countByUserIdAndIsRead(userId, false);
    }

    public Notifications markAsRead(Integer notificationId) {
        Notifications notification = notificationRepo.findById(notificationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Không tìm thấy thông báo với ID: " + notificationId));

        notification.setRead(true);
        return notificationRepo.save(notification);
    }

    public void markAllAsRead(Integer userId) {
        List<Notifications> unreadNotifications = notificationRepo.findByUserIdAndIsRead(userId, false);
        for (Notifications notification : unreadNotifications) {
            notification.setRead(true);
            notificationRepo.save(notification);
        }
    }

    public Notifications createAppointmentNotification(User user, Appointment appointment) {
        String message = generateAppointmentMessage(appointment);
        return createNotification(user, message);
    }

    public Notifications createNotification(User user, String message) {
        Notifications notification = new Notifications();
        notification.setUser(user);
        notification.setMessage(message);
        notification.setSendAt(LocalDateTime.now().format(FORMATTER));
        notification.setRead(true);

        return notificationRepo.save(notification);
    }

    private String generateAppointmentMessage(Appointment appointment) {
        String serviceType;
        switch (appointment.getType()) {
            case KHÁM_BỆNH:
                serviceType = "khám bệnh";
                break;
            case LÀM_ĐẸP:
                serviceType = "làm đẹp";
                break;
            case LƯU_TRÚ:
                serviceType = "lưu trú";
                break;
            default:
                serviceType = "";
        }

        return "Lịch hẹn dịch vụ " + serviceType + " cho thú cưng " +
                appointment.getPet().getPetName() +
                " đã được xác nhận. Vui lòng thanh toán để hoàn tất đặt lịch.";
    }
}