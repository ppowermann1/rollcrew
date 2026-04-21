package com.rollcrew.rollcrew.domain.community.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rollcrew.rollcrew.domain.community.dto.CommunityPostListResponse;
import com.rollcrew.rollcrew.domain.community.dto.CommunityPostRequest;
import com.rollcrew.rollcrew.domain.community.dto.CommunityPostResponse;
import com.rollcrew.rollcrew.domain.community.entity.CommunityCategory;
import com.rollcrew.rollcrew.domain.community.entity.LikeType;
import com.rollcrew.rollcrew.domain.community.service.CommunityPostService;
import com.rollcrew.rollcrew.domain.user.entity.Role;
import com.rollcrew.rollcrew.domain.user.entity.User;
import com.rollcrew.rollcrew.global.exception.BusinessException;
import com.rollcrew.rollcrew.global.exception.ErrorCode;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CommunityPostController.class)
@Import(CommunityPostControllerTest.TestSecurityConfig.class)
class CommunityPostControllerTest {

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
    private CommunityPostService communityPostService;

    private Authentication auth;
    private CommunityPostResponse mockPostResponse;
    private CommunityPostListResponse mockListResponse;

    @BeforeEach
    void setUp() {
        User mockUser = User.builder()
                .id(1L)
                .email("test@test.com")
                .nickname("테스트유저")
                .provider("kakao")
                .providerId("kakao-123")
                .role(Role.USER)
                .build();

        auth = new UsernamePasswordAuthenticationToken(1L, null, List.of());

        mockPostResponse = CommunityPostResponse.builder()
                .title("테스트 제목")
                .nickname("졸린 망고")
                .content("테스트 내용")
                .imageURL(List.of())
                .createdAt(LocalDateTime.now())
                .likeCount(0L)
                .dislikeCount(0L)
                .build();

        mockListResponse = CommunityPostListResponse.builder()
                .title("테스트 제목")
                .nickname("졸린 망고")
                .createdAt(LocalDateTime.now())
                .likeCount(0L)
                .dislikeCount(0L)
                .build();
    }

    @Test
    @DisplayName("게시글 생성 성공 - 200")
    void createPost_success() throws Exception {
        CommunityPostRequest request = CommunityPostRequest.builder()
                .title("테스트 제목")
                .content("테스트 내용")
                .communityCategory(CommunityCategory.GENERAL)
                .nickname("졸린 망고")
                .build();

        given(communityPostService.createPost(any(Long.class), any(CommunityPostRequest.class)))
                .willReturn(1L);

        mockMvc.perform(post("/api/community/posts")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").value(1));
    }

    @Test
    @DisplayName("게시글 목록 조회 성공 - 200")
    void getPostList_success() throws Exception {
        given(communityPostService.getPostList(any(Pageable.class)))
                .willReturn(new PageImpl<>(List.of(mockListResponse)));

        mockMvc.perform(get("/api/community/posts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content[0].title").value("테스트 제목"))
                .andExpect(jsonPath("$.data.content[0].nickname").value("졸린 망고"));
    }

    @Test
    @DisplayName("게시글 단건 조회 성공 - 200")
    void getCommunityPost_success() throws Exception {
        given(communityPostService.getCommunityPost(1L)).willReturn(mockPostResponse);

        mockMvc.perform(get("/api/community/posts/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.title").value("테스트 제목"))
                .andExpect(jsonPath("$.data.nickname").value("졸린 망고"));
    }

    @Test
    @DisplayName("게시글 단건 조회 실패 - 게시글 없음 404")
    void getCommunityPost_notFound() throws Exception {
        given(communityPostService.getCommunityPost(99L))
                .willThrow(new BusinessException(ErrorCode.POST_NOT_FOUND));

        mockMvc.perform(get("/api/community/posts/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value(ErrorCode.POST_NOT_FOUND.getMessage()));
    }

    @Test
    @DisplayName("게시글 수정 성공 - 200")
    void updatePost_success() throws Exception {
        CommunityPostRequest request = CommunityPostRequest.builder()
                .title("수정된 제목")
                .content("수정된 내용")
                .communityCategory(CommunityCategory.GENERAL)
                .nickname("졸린 망고")
                .build();

        given(communityPostService.updatePost(eq(1L), any(CommunityPostRequest.class), eq(1L)))
                .willReturn(mockPostResponse);

        mockMvc.perform(patch("/api/community/posts/1")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("게시글 수정 실패 - 권한 없음 403")
    void updatePost_forbidden() throws Exception {
        CommunityPostRequest request = CommunityPostRequest.builder()
                .title("수정된 제목").content("수정된 내용")
                .communityCategory(CommunityCategory.GENERAL).nickname("닉").build();

        given(communityPostService.updatePost(eq(1L), any(CommunityPostRequest.class), eq(1L)))
                .willThrow(new BusinessException(ErrorCode.FORBIDDEN));

        mockMvc.perform(patch("/api/community/posts/1")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("게시글 삭제 성공 - 200")
    void deletePost_success() throws Exception {
        doNothing().when(communityPostService).deletePost(1L, 1L);

        mockMvc.perform(delete("/api/community/posts/1").with(authentication(auth)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("게시글 삭제 실패 - 권한 없음 403")
    void deletePost_forbidden() throws Exception {
        doThrow(new BusinessException(ErrorCode.FORBIDDEN))
                .when(communityPostService).deletePost(1L, 1L);

        mockMvc.perform(delete("/api/community/posts/1").with(authentication(auth)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("게시글 좋아요 토글 성공 - 200")
    void togglePostLike_success() throws Exception {

        mockMvc.perform(post("/api/community/posts/1/like")
                        .with(authentication(auth))
                        .param("likeType", "LIKE"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("게시글 싫어요 토글 성공 - 200")
    void togglePostDislike_success() throws Exception {

        mockMvc.perform(post("/api/community/posts/1/like")
                        .with(authentication(auth))
                        .param("likeType", "DISLIKE"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }
}
