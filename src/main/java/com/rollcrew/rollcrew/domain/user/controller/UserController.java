package com.rollcrew.rollcrew.domain.user.controller;

import com.rollcrew.rollcrew.domain.user.dto.ProfileResponse;
import com.rollcrew.rollcrew.domain.user.dto.ProfileUpdateRequest;
import com.rollcrew.rollcrew.domain.user.dto.UserResponse;
import com.rollcrew.rollcrew.domain.user.entity.User;
import com.rollcrew.rollcrew.domain.user.service.UserService;
import com.rollcrew.rollcrew.global.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;


    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getMyInfo(@AuthenticationPrincipal Long userId) {
        UserResponse response = userService.getMyInfo(userId);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<ProfileResponse>> getProfile(@AuthenticationPrincipal Long userId) {
        ProfileResponse response = userService.getProfile(userId);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }


    @PatchMapping("/profile")
    public ResponseEntity<ApiResponse<ProfileResponse>> updateProfile(@AuthenticationPrincipal Long userId,
                                                                      @RequestBody ProfileUpdateRequest request) {
        ProfileResponse response = userService.updateProfile(userId, request);
        return ResponseEntity.ok(ApiResponse.ok(response));
    };
}
