package com.rollcrew.rollcrew.domain.notification.repository;

import com.rollcrew.rollcrew.domain.notification.entity.Notification;
import com.rollcrew.rollcrew.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByReceiverOrderByCreatedAtDesc(User receiver);

    List<Notification> findByReceiverAndIsReadOrderByCreatedAtDesc(User receiver, Boolean isRead);

    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.receiver = :receiver AND n.referenceId = :referenceId AND n.isRead = false")
    void markAsReadByReceiverAndReferenceId(@Param("receiver") User receiver, @Param("referenceId") Long referenceId);

}
