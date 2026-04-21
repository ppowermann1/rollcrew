package com.rollcrew.rollcrew.domain.community.controller;

import com.rollcrew.rollcrew.domain.community.dto.CommunityPostListResponse;
import com.rollcrew.rollcrew.domain.community.dto.CommunityPostRequest;
import com.rollcrew.rollcrew.domain.community.dto.CommunityPostResponse;
import com.rollcrew.rollcrew.domain.community.entity.CommunityCategory;
import com.rollcrew.rollcrew.domain.community.entity.LikeType;
import com.rollcrew.rollcrew.domain.community.service.CommunityPostService;
import com.rollcrew.rollcrew.global.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

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


    @GetMapping
    public ResponseEntity<ApiResponse<Page<CommunityPostListResponse>>> getCommunityPostList(
            @RequestParam(required = false) CommunityCategory communityCategory,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<CommunityPostListResponse> responses = communityPostService.getPostList(communityCategory, pageable);
        return ResponseEntity.ok().body(ApiResponse.ok(responses));
    }


    @GetMapping("/{postId}")
    public ResponseEntity<ApiResponse<CommunityPostResponse>> getCommunityPost(@PathVariable Long postId) {
        CommunityPostResponse response = communityPostService.getCommunityPost(postId);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping("/{postId}/like")
    public ResponseEntity<ApiResponse<Void>> togglePostLike(@PathVariable Long postId,
                                                            @RequestParam LikeType likeType,
                                                            @AuthenticationPrincipal Long userId) {
        communityPostService.togglePostLike(postId, likeType, userId);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    @PatchMapping("/{postId}")
    public ResponseEntity<ApiResponse<CommunityPostResponse>> updatePost(
            @PathVariable Long postId,
            @RequestBody @Valid CommunityPostRequest request,
            @AuthenticationPrincipal Long userId) {

        CommunityPostResponse response = communityPostService.updatePost(postId, request, userId);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<ApiResponse<Void>> deletePost(
            @PathVariable Long postId,
            @AuthenticationPrincipal Long userId) {

        communityPostService.deletePost(postId, userId);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Page<CommunityPostListResponse>>> getMyPosts(
            @AuthenticationPrincipal Long userId,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        Page<CommunityPostListResponse> responses = communityPostService.getMyPosts(userId, pageable);
        return ResponseEntity.ok(ApiResponse.ok(responses));
    }
}
