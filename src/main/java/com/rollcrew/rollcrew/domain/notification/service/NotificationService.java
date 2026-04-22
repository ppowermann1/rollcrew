package com.rollcrew.rollcrew.domain.notification.service;

import com.rollcrew.rollcrew.domain.notification.dto.NotificationResponse;
import com.rollcrew.rollcrew.domain.notification.entity.Notification;
import com.rollcrew.rollcrew.domain.notification.entity.NotificationType;
import com.rollcrew.rollcrew.domain.notification.repository.NotificationRepository;
import com.rollcrew.rollcrew.domain.user.entity.User;
import com.rollcrew.rollcrew.domain.user.repository.UserRepository;
import com.rollcrew.rollcrew.global.exception.BusinessException;
import com.rollcrew.rollcrew.global.exception.ErrorCode;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;


    public NotificationResponse createNotification(User receiver, NotificationType type, String message, Long referenceId) {

        Notification notification = Notification.builder()
                .receiver(receiver)
                .type(type)
                .message(message)
                .referenceId(referenceId)
                .build();
        notificationRepository.save(notification);
        return NotificationResponse.from(notification);
    }

    public List<NotificationResponse> getNotifications(Long userId, Boolean unreadOnly) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        List<Notification> notifications = (unreadOnly != null && unreadOnly)
                ? notificationRepository.findByReceiverAndIsReadOrderByCreatedAtDesc(user, false)
                : notificationRepository.findByReceiverOrderByCreatedAtDesc(user);

        return notifications.stream()
                .map(NotificationResponse::from)
                .collect(Collectors.toList());
    }


    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOTIFICATION_NOT_FOUND));
        notification.markAsRead();
    }

    public void markAsReadByReference(Long userId, Long referenceId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        notificationRepository.markAsReadByReceiverAndReferenceId(user, referenceId);
    }

}
