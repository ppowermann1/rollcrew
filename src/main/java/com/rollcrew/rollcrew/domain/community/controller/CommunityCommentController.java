package com.rollcrew.rollcrew.domain.community.controller;

import com.rollcrew.rollcrew.domain.community.dto.CommentCreateRequest;
import com.rollcrew.rollcrew.domain.community.dto.CommentResponse;
import com.rollcrew.rollcrew.domain.community.dto.CommentUpdateRequest;
import com.rollcrew.rollcrew.domain.community.entity.LikeType;
import com.rollcrew.rollcrew.domain.community.service.CommunityCommentService;
import com.rollcrew.rollcrew.global.response.ApiResponse;
import com.rollcrew.rollcrew.global.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/community/comments")
@RequiredArgsConstructor
public class CommunityCommentController {
    private final CommunityCommentService communityCommentService;

    @PostMapping("/{postId}")
    public ResponseEntity<ApiResponse<CommentResponse>> createComments(@PathVariable Long postId,
                                                                       @RequestBody CommentCreateRequest request,
                                                                       @AuthenticationPrincipal Long userId) {
        CommentResponse response = communityCommentService.createComments(postId, request, userId);

        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/{postId}")
    public ResponseEntity<ApiResponse<List<CommentResponse>>> getComments(@PathVariable Long postId,
                                                                          @RequestParam(defaultValue = "0") int page) {
        List<CommentResponse> responses = communityCommentService.getComments(postId, page);
        return ResponseEntity.ok(ApiResponse.ok(responses));
    }

    @PatchMapping("/{commentId}")
    public ResponseEntity<ApiResponse<CommentResponse>> updateComment(@PathVariable Long commentId,
                                                                      @RequestBody @Valid CommentUpdateRequest request,
                                                                      @AuthenticationPrincipal Long userId) {
        CommentResponse response = communityCommentService.updateComment(commentId, request, userId);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<ApiResponse<Void>> deleteComment(@PathVariable Long commentId,
                                                           @AuthenticationPrincipal Long userId) {
        communityCommentService.deleteComment(commentId, userId);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    @PostMapping("/{commentId}/like")
    public ResponseEntity<ApiResponse<Void>> togglePostLike(@PathVariable Long commentId,
                                                               @RequestParam LikeType likeType,
                                                               @AuthenticationPrincipal Long userId) {
        communityCommentService.toggleCommentLike(commentId, likeType, userId);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }
}
