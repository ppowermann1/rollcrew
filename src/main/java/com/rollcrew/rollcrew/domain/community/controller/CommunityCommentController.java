package com.rollcrew.rollcrew.domain.community.controller;

import com.rollcrew.rollcrew.domain.community.dto.CommentCreateRequest;
import com.rollcrew.rollcrew.domain.community.dto.CommentResponse;
import com.rollcrew.rollcrew.domain.community.service.CommunityCommentService;
import com.rollcrew.rollcrew.global.response.ApiResponse;
import com.rollcrew.rollcrew.global.security.CustomOAuth2User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/community/comments")
@RequiredArgsConstructor
public class CommunityCommentController {
    private final CommunityCommentService communityCommentService;

    @PostMapping("/{postId}")
    public ResponseEntity<ApiResponse<CommentResponse>> createComments(@PathVariable Long postId,
                                                                       @RequestBody CommentCreateRequest request,
                                                                       @AuthenticationPrincipal CustomOAuth2User principal) {
        CommentResponse response = communityCommentService.createComments(postId, request,principal);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

}
