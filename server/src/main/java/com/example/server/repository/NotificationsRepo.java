package com.example.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.server.model.Notifications;

import java.util.List;

@Repository
public interface NotificationsRepo extends JpaRepository<Notifications, Integer> {
    List<Notifications> findByUserIdOrderBySendAtDesc(Integer userId);
    List<Notifications> findByUserIdAndIsReadOrderBySendAtDesc(Integer userId, boolean isRead);
    List<Notifications> findByUserIdAndIsRead(Integer userId, boolean isRead);
    long countByUserIdAndIsRead(Integer userId, boolean isRead);
}
