package com.rollcrew.rollcrew.domain.notification.controller;

import com.rollcrew.rollcrew.domain.notification.dto.NotificationResponse;
import com.rollcrew.rollcrew.domain.notification.service.NotificationService;
import com.rollcrew.rollcrew.global.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {


    private final NotificationService notificationService;


    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getNotifications(@AuthenticationPrincipal Long userId) {
        List<NotificationResponse> responses = notificationService.getNotifications(userId);
        return ResponseEntity.ok(ApiResponse.ok(responses));

    }

    @PatchMapping("/{notificationId}")
    public ResponseEntity<ApiResponse<Void>> markAsRead(@PathVariable Long notificationId) {

        notificationService.markAsRead(notificationId);
        return ResponseEntity.ok(ApiResponse.ok(null));

    }


}
