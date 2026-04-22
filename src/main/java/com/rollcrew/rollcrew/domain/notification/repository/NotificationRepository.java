package com.rollcrew.rollcrew.domain.notification.repository;

import com.rollcrew.rollcrew.domain.notification.entity.Notification;
import com.rollcrew.rollcrew.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface NotificationRepository extends JpaRepository<Notification, Long> {



    List<Notification> findByReceiverOrderByCreatedAtDesc(User receiver);

    List<Notification> findByReceiverAndIsReadOrderByCreatedAtDesc(User receiver, Boolean isRead);


}
