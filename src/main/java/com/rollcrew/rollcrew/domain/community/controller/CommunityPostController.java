package com.rollcrew.rollcrew.domain.community.controller;

import com.rollcrew.rollcrew.domain.community.dto.CommunityPostRequest;
import com.rollcrew.rollcrew.domain.community.service.CommunityPostService;
import com.rollcrew.rollcrew.global.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/community/posts")
@RequiredArgsConstructor
public class CommunityPostController {

    private final CommunityPostService communityPostService;

    @PostMapping
    public ResponseEntity<ApiResponse<Long>> createPost(@AuthenticationPrincipal Long userId,
                                                        @RequestBody CommunityPostRequest request) {
        Long response = communityPostService.createPost(userId, request);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}
