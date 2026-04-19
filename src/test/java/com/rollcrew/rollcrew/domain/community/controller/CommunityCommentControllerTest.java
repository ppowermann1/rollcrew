package com.rollcrew.rollcrew.domain.community.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rollcrew.rollcrew.domain.community.dto.CommentCreateRequest;
import com.rollcrew.rollcrew.domain.community.dto.CommentResponse;
import com.rollcrew.rollcrew.domain.community.dto.CommentUpdateRequest;
import com.rollcrew.rollcrew.domain.community.entity.LikeType;
import com.rollcrew.rollcrew.domain.community.service.CommunityCommentService;
import com.rollcrew.rollcrew.domain.user.entity.Role;
import com.rollcrew.rollcrew.domain.user.entity.User;
import com.rollcrew.rollcrew.global.exception.BusinessException;
import com.rollcrew.rollcrew.global.exception.ErrorCode;
import com.rollcrew.rollcrew.global.security.CustomOAuth2User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CommunityCommentController.class)
@Import(CommunityCommentControllerTest.TestSecurityConfig.class)
class CommunityCommentControllerTest {

    @TestConfiguration
    @EnableWebSecurity
    static class TestSecurityConfig {
        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
            http.csrf(csrf -> csrf.disable())
                    .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
            return http.build();
        }
    }

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private CommunityCommentService communityCommentService;

    private Authentication auth;
    private CustomOAuth2User principal;
    private CommentResponse mockCommentResponse;

    @BeforeEach
    void setUp() {
        User mockUser = User.builder()
                .id(1L).email("test@test.com").nickname("테스트유저")
                .provider("kakao").providerId("kakao-123").role(Role.USER).build();

        principal = new CustomOAuth2User(mockUser, Map.of());
        auth = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());

        mockCommentResponse = CommentResponse.builder()
                .id(1L)
                .content("테스트 댓글")
                .nickname("졸린 망고")
                .createdAt(LocalDateTime.now())
                .replies(List.of())
                .isDeleted(false)
                .likeCount(0)
                .dislikeCount(0)
                .build();
    }

    @Test
    @DisplayName("댓글 생성 성공 - 200")
    void createComment_success() throws Exception {
        CommentCreateRequest request = CommentCreateRequest.builder()
                .content("테스트 댓글").nickname("졸린 망고").build();

        given(communityCommentService.createComments(eq(1L), any(CommentCreateRequest.class), any(CustomOAuth2User.class)))
                .willReturn(mockCommentResponse);

        mockMvc.perform(post("/api/community/comments/1")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content").value("테스트 댓글"))
                .andExpect(jsonPath("$.data.nickname").value("졸린 망고"));
    }

    @Test
    @DisplayName("댓글 생성 실패 - 게시글 없음 404")
    void createComment_postNotFound() throws Exception {
        CommentCreateRequest request = CommentCreateRequest.builder()
                .content("댓글").nickname("닉").build();

        given(communityCommentService.createComments(eq(99L), any(CommentCreateRequest.class), any(CustomOAuth2User.class)))
                .willThrow(new BusinessException(ErrorCode.POST_NOT_FOUND));

        mockMvc.perform(post("/api/community/comments/99")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("대댓글 깊이 초과 실패 - 400")
    void createComment_depthExceeded() throws Exception {
        CommentCreateRequest request = CommentCreateRequest.builder()
                .content("손자 댓글").nickname("닉").parentId(1L).build();

        given(communityCommentService.createComments(eq(1L), any(CommentCreateRequest.class), any(CustomOAuth2User.class)))
                .willThrow(new BusinessException(ErrorCode.COMMENT_DEPTH_EXCEEDED));

        mockMvc.perform(post("/api/community/comments/1")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value(ErrorCode.COMMENT_DEPTH_EXCEEDED.getMessage()));
    }

    @Test
    @DisplayName("댓글 목록 조회 성공 - 200")
    void getComments_success() throws Exception {
        given(communityCommentService.getComments(eq(1L), eq(0)))
                .willReturn(List.of(mockCommentResponse));

        mockMvc.perform(get("/api/community/comments/1").param("page", "0"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].content").value("테스트 댓글"))
                .andExpect(jsonPath("$.data[0].nickname").value("졸린 망고"));
    }

    @Test
    @DisplayName("댓글 목록 조회 - 기본 페이지(0)")
    void getComments_defaultPage() throws Exception {
        given(communityCommentService.getComments(eq(1L), eq(0)))
                .willReturn(List.of(mockCommentResponse));

        mockMvc.perform(get("/api/community/comments/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray());
    }

    @Test
    @DisplayName("댓글 수정 성공 - 200")
    void updateComment_success() throws Exception {
        CommentUpdateRequest request = new CommentUpdateRequest("수정된 댓글");

        given(communityCommentService.updateComment(eq(1L), any(CommentUpdateRequest.class), any(CustomOAuth2User.class)))
                .willReturn(mockCommentResponse);

        mockMvc.perform(patch("/api/community/comments/1")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("댓글 수정 실패 - 내용 공백 400")
    void updateComment_blankContent() throws Exception {
        CommentUpdateRequest request = new CommentUpdateRequest("");

        mockMvc.perform(patch("/api/community/comments/1")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("댓글 수정 실패 - 권한 없음 403")
    void updateComment_forbidden() throws Exception {
        CommentUpdateRequest request = new CommentUpdateRequest("수정 시도");

        given(communityCommentService.updateComment(eq(1L), any(CommentUpdateRequest.class), any(CustomOAuth2User.class)))
                .willThrow(new BusinessException(ErrorCode.FORBIDDEN_COMMENT));

        mockMvc.perform(patch("/api/community/comments/1")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value(ErrorCode.FORBIDDEN_COMMENT.getMessage()));
    }

    @Test
    @DisplayName("댓글 삭제 성공 - 200")
    void deleteComment_success() throws Exception {
        doNothing().when(communityCommentService).deleteComment(eq(1L), any(CustomOAuth2User.class));

        mockMvc.perform(delete("/api/community/comments/1").with(authentication(auth)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("댓글 삭제 실패 - 권한 없음 403")
    void deleteComment_forbidden() throws Exception {
        doThrow(new BusinessException(ErrorCode.FORBIDDEN_COMMENT))
                .when(communityCommentService).deleteComment(eq(1L), any(CustomOAuth2User.class));

        mockMvc.perform(delete("/api/community/comments/1").with(authentication(auth)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("댓글 좋아요 토글 성공 - 200")
    void toggleCommentLike_success() throws Exception {
        doNothing().when(communityCommentService)
                .toggleCommentLike(eq(1L), eq(LikeType.LIKE), any(CustomOAuth2User.class));

        mockMvc.perform(post("/api/community/comments/1/like")
                        .with(authentication(auth))
                        .param("likeType", "LIKE"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("댓글 싫어요 토글 성공 - 200")
    void toggleCommentDislike_success() throws Exception {
        doNothing().when(communityCommentService)
                .toggleCommentLike(eq(1L), eq(LikeType.DISLIKE), any(CustomOAuth2User.class));

        mockMvc.perform(post("/api/community/comments/1/like")
                        .with(authentication(auth))
                        .param("likeType", "DISLIKE"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("댓글 좋아요 실패 - 댓글 없음 404")
    void toggleCommentLike_commentNotFound() throws Exception {
        doThrow(new BusinessException(ErrorCode.COMMENT_NOT_FOUND))
                .when(communityCommentService)
                .toggleCommentLike(eq(99L), eq(LikeType.LIKE), any(CustomOAuth2User.class));

        mockMvc.perform(post("/api/community/comments/99/like")
                        .with(authentication(auth))
                        .param("likeType", "LIKE"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));
    }
}
