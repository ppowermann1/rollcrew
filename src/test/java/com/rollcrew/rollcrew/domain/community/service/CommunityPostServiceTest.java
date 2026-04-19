package com.rollcrew.rollcrew.domain.community.service;

import com.rollcrew.rollcrew.domain.community.dto.CommunityPostListResponse;
import com.rollcrew.rollcrew.domain.community.dto.CommunityPostRequest;
import com.rollcrew.rollcrew.domain.community.dto.CommunityPostResponse;
import com.rollcrew.rollcrew.domain.community.entity.*;
import com.rollcrew.rollcrew.domain.community.repository.*;
import com.rollcrew.rollcrew.domain.user.entity.Role;
import com.rollcrew.rollcrew.domain.user.entity.User;
import com.rollcrew.rollcrew.domain.user.repository.UserRepository;
import com.rollcrew.rollcrew.global.exception.BusinessException;
import com.rollcrew.rollcrew.global.exception.ErrorCode;
import com.rollcrew.rollcrew.global.security.CustomOAuth2User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class CommunityPostServiceTest {

    @Mock
    private CommunityPostRepository communityPostRepository;
    @Mock
    private CommunityPostNicknameRepository communityPostNicknameRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private CommunityPostLikeRepository communityPostLikeRepository;
    @Mock
    private CommunityPostImageRepository communityPostImageRepository;

    @InjectMocks
    private CommunityPostService communityPostService;

    private User mockUser;
    private CommunityPost mockPost;
    private CommunityPostNickname mockNickname;
    private CustomOAuth2User mockPrincipal;

    @BeforeEach
    void setUp() {
        mockUser = User.builder()
                .id(1L)
                .email("test@test.com")
                .nickname("테스트유저")
                .provider("kakao")
                .providerId("kakao-123")
                .role(Role.USER)
                .build();

        mockPost = CommunityPost.builder()
                .id(1L)
                .user(mockUser)
                .title("테스트 제목")
                .content("테스트 내용")
                .communityCategory(CommunityCategory.GENERAL)
                .build();

        mockNickname = CommunityPostNickname.builder()
                .id(1L)
                .user(mockUser)
                .communityPost(mockPost)
                .nickname("졸린 망고")
                .build();

        mockPrincipal = new CustomOAuth2User(mockUser, Map.of());
    }

    // ── createPost ──────────────────────────────────────────────────────────────

    @Test
    @DisplayName("게시글 생성 성공")
    void createPost_success() {
        CommunityPostRequest request = CommunityPostRequest.builder()
                .title("테스트 제목")
                .content("테스트 내용")
                .communityCategory(CommunityCategory.GENERAL)
                .nickname("졸린 망고")
                .build();

        given(userRepository.findById(1L)).willReturn(Optional.of(mockUser));
        given(communityPostRepository.save(any(CommunityPost.class))).willReturn(mockPost);
        given(communityPostNicknameRepository.save(any(CommunityPostNickname.class))).willReturn(mockNickname);

        communityPostService.createPost(1L, request);

        verify(communityPostRepository).save(any(CommunityPost.class));
        verify(communityPostNicknameRepository).save(any(CommunityPostNickname.class));
    }

    @Test
    @DisplayName("게시글 생성 실패 - 유저 없음")
    void createPost_userNotFound() {
        CommunityPostRequest request = CommunityPostRequest.builder()
                .title("제목")
                .content("내용")
                .communityCategory(CommunityCategory.GENERAL)
                .nickname("닉네임")
                .build();

        given(userRepository.findById(1L)).willReturn(Optional.empty());

        assertThatThrownBy(() -> communityPostService.createPost(1L, request))
                .isInstanceOf(BusinessException.class)
                .hasMessage(ErrorCode.USER_NOT_FOUND.getMessage());
    }

    // ── getPostList ──────────────────────────────────────────────────────────────

    @Test
    @DisplayName("게시글 목록 조회 성공")
    void getPostList_success() {
        Page<CommunityPost> page = new PageImpl<>(List.of(mockPost));

        given(communityPostRepository.findAll(any(PageRequest.class))).willReturn(page);
        given(communityPostLikeRepository.findByCommunityPostIn(any())).willReturn(List.of());
        given(communityPostNicknameRepository.findByCommunityPostIn(any())).willReturn(List.of(mockNickname));

        Page<CommunityPostListResponse> result = communityPostService.getPostList(PageRequest.of(0, 20));

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getTitle()).isEqualTo("테스트 제목");
        assertThat(result.getContent().get(0).getNickname()).isEqualTo("졸린 망고");
    }

    @Test
    @DisplayName("게시글 목록 조회 - 닉네임 없으면 Unknown 반환")
    void getPostList_noNickname_returnsUnknown() {
        Page<CommunityPost> page = new PageImpl<>(List.of(mockPost));

        given(communityPostRepository.findAll(any(PageRequest.class))).willReturn(page);
        given(communityPostLikeRepository.findByCommunityPostIn(any())).willReturn(List.of());
        given(communityPostNicknameRepository.findByCommunityPostIn(any())).willReturn(List.of());

        Page<CommunityPostListResponse> result = communityPostService.getPostList(PageRequest.of(0, 20));

        assertThat(result.getContent().get(0).getNickname()).isEqualTo("Unknown");
    }

    @Test
    @DisplayName("게시글 목록 조회 - 좋아요/싫어요 카운트 정확")
    void getPostList_likeCount() {
        CommunityPostLike like = CommunityPostLike.builder()
                .user(mockUser).communityPost(mockPost).likeType(LikeType.LIKE).build();
        CommunityPostLike dislike = CommunityPostLike.builder()
                .user(mockUser).communityPost(mockPost).likeType(LikeType.DISLIKE).build();

        Page<CommunityPost> page = new PageImpl<>(List.of(mockPost));
        given(communityPostRepository.findAll(any(PageRequest.class))).willReturn(page);
        given(communityPostLikeRepository.findByCommunityPostIn(any())).willReturn(List.of(like, dislike));
        given(communityPostNicknameRepository.findByCommunityPostIn(any())).willReturn(List.of(mockNickname));

        Page<CommunityPostListResponse> result = communityPostService.getPostList(PageRequest.of(0, 20));

        assertThat(result.getContent().get(0).getLikeCount()).isEqualTo(1);
        assertThat(result.getContent().get(0).getDislikeCount()).isEqualTo(1);
    }

    // ── getCommunityPost ────────────────────────────────────────────────────────

    @Test
    @DisplayName("게시글 단건 조회 성공")
    void getCommunityPost_success() {
        given(communityPostRepository.findById(1L)).willReturn(Optional.of(mockPost));
        given(communityPostNicknameRepository.findAuthorNicknameByCommunityPost(mockPost)).willReturn(Optional.of(mockNickname));
        given(communityPostLikeRepository.countByCommunityPostAndLikeType(mockPost, LikeType.LIKE)).willReturn(3L);
        given(communityPostLikeRepository.countByCommunityPostAndLikeType(mockPost, LikeType.DISLIKE)).willReturn(1L);
        given(communityPostImageRepository.findByCommunityPost(mockPost)).willReturn(List.of());

        CommunityPostResponse response = communityPostService.getCommunityPost(1L);

        assertThat(response.getTitle()).isEqualTo("테스트 제목");
        assertThat(response.getNickname()).isEqualTo("졸린 망고");
        assertThat(response.getLikeCount()).isEqualTo(3L);
        assertThat(response.getDislikeCount()).isEqualTo(1L);
    }

    @Test
    @DisplayName("게시글 단건 조회 실패 - 게시글 없음")
    void getCommunityPost_postNotFound() {
        given(communityPostRepository.findById(99L)).willReturn(Optional.empty());

        assertThatThrownBy(() -> communityPostService.getCommunityPost(99L))
                .isInstanceOf(BusinessException.class)
                .hasMessage(ErrorCode.POST_NOT_FOUND.getMessage());
    }

    @Test
    @DisplayName("게시글 단건 조회 실패 - 닉네임 없음")
    void getCommunityPost_nicknameNotFound() {
        given(communityPostRepository.findById(1L)).willReturn(Optional.of(mockPost));
        given(communityPostNicknameRepository.findAuthorNicknameByCommunityPost(mockPost)).willReturn(Optional.empty());

        assertThatThrownBy(() -> communityPostService.getCommunityPost(1L))
                .isInstanceOf(BusinessException.class)
                .hasMessage(ErrorCode.NICKNAME_NOT_FOUND.getMessage());
    }

    // ── updatePost ──────────────────────────────────────────────────────────────

    @Test
    @DisplayName("게시글 수정 성공")
    void updatePost_success() {
        CommunityPostRequest request = CommunityPostRequest.builder()
                .title("수정된 제목")
                .content("수정된 내용")
                .communityCategory(CommunityCategory.GENERAL)
                .nickname("졸린 망고")
                .build();

        given(communityPostRepository.findById(1L)).willReturn(Optional.of(mockPost));
        given(communityPostNicknameRepository.findAuthorNicknameByCommunityPost(mockPost)).willReturn(Optional.of(mockNickname));

        CommunityPostResponse response = communityPostService.updatePost(1L, request, 1L);

        assertThat(response.getTitle()).isEqualTo("수정된 제목");
        assertThat(response.getContent()).isEqualTo("수정된 내용");
    }

    @Test
    @DisplayName("게시글 수정 실패 - 권한 없음")
    void updatePost_forbidden() {
        CommunityPostRequest request = CommunityPostRequest.builder()
                .title("수정된 제목").content("수정된 내용")
                .communityCategory(CommunityCategory.GENERAL).nickname("닉").build();

        given(communityPostRepository.findById(1L)).willReturn(Optional.of(mockPost));

        assertThatThrownBy(() -> communityPostService.updatePost(1L, request, 2L))
                .isInstanceOf(BusinessException.class)
                .hasMessage(ErrorCode.FORBIDDEN.getMessage());
    }

    @Test
    @DisplayName("게시글 수정 실패 - 게시글 없음")
    void updatePost_postNotFound() {
        CommunityPostRequest request = CommunityPostRequest.builder()
                .title("제목").content("내용")
                .communityCategory(CommunityCategory.GENERAL).nickname("닉").build();

        given(communityPostRepository.findById(99L)).willReturn(Optional.empty());

        assertThatThrownBy(() -> communityPostService.updatePost(99L, request, 1L))
                .isInstanceOf(BusinessException.class)
                .hasMessage(ErrorCode.POST_NOT_FOUND.getMessage());
    }

    // ── deletePost ──────────────────────────────────────────────────────────────

    @Test
    @DisplayName("게시글 삭제 성공")
    void deletePost_success() {
        given(communityPostRepository.findById(1L)).willReturn(Optional.of(mockPost));

        communityPostService.deletePost(1L, 1L);

        verify(communityPostRepository).delete(mockPost);
    }

    @Test
    @DisplayName("게시글 삭제 실패 - 권한 없음")
    void deletePost_forbidden() {
        given(communityPostRepository.findById(1L)).willReturn(Optional.of(mockPost));

        assertThatThrownBy(() -> communityPostService.deletePost(1L, 2L))
                .isInstanceOf(BusinessException.class)
                .hasMessage(ErrorCode.FORBIDDEN.getMessage());
    }

    @Test
    @DisplayName("게시글 삭제 실패 - 게시글 없음")
    void deletePost_postNotFound() {
        given(communityPostRepository.findById(99L)).willReturn(Optional.empty());

        assertThatThrownBy(() -> communityPostService.deletePost(99L, 1L))
                .isInstanceOf(BusinessException.class)
                .hasMessage(ErrorCode.POST_NOT_FOUND.getMessage());
    }

    // ── togglePostLike ──────────────────────────────────────────────────────────

    @Test
    @DisplayName("게시글 좋아요 최초 등록")
    void togglePostLike_newLike() {
        given(userRepository.findById(1L)).willReturn(Optional.of(mockUser));
        given(communityPostRepository.findById(1L)).willReturn(Optional.of(mockPost));
        given(communityPostLikeRepository.findByUserAndCommunityPost(mockUser, mockPost)).willReturn(Optional.empty());

        communityPostService.togglePostLike(1L, LikeType.LIKE, 1L);

        verify(communityPostLikeRepository).save(any(CommunityPostLike.class));
    }

    @Test
    @DisplayName("동일 타입 좋아요 재클릭 - 취소")
    void togglePostLike_cancelSameType() {
        CommunityPostLike existing = CommunityPostLike.builder()
                .user(mockUser).communityPost(mockPost).likeType(LikeType.LIKE).build();

        given(userRepository.findById(1L)).willReturn(Optional.of(mockUser));
        given(communityPostRepository.findById(1L)).willReturn(Optional.of(mockPost));
        given(communityPostLikeRepository.findByUserAndCommunityPost(mockUser, mockPost)).willReturn(Optional.of(existing));

        communityPostService.togglePostLike(1L, LikeType.LIKE, 1L);

        verify(communityPostLikeRepository).delete(existing);
    }

    @Test
    @DisplayName("좋아요에서 싫어요로 변경")
    void togglePostLike_switchType() {
        CommunityPostLike existing = CommunityPostLike.builder()
                .user(mockUser).communityPost(mockPost).likeType(LikeType.LIKE).build();

        given(userRepository.findById(1L)).willReturn(Optional.of(mockUser));
        given(communityPostRepository.findById(1L)).willReturn(Optional.of(mockPost));
        given(communityPostLikeRepository.findByUserAndCommunityPost(mockUser, mockPost)).willReturn(Optional.of(existing));

        communityPostService.togglePostLike(1L, LikeType.DISLIKE, 1L);

        verify(communityPostLikeRepository).delete(existing);
        verify(communityPostLikeRepository).save(any(CommunityPostLike.class));
    }

    @Test
    @DisplayName("게시글 좋아요 - 유저 없음")
    void togglePostLike_userNotFound() {
        given(userRepository.findById(1L)).willReturn(Optional.empty());

        assertThatThrownBy(() -> communityPostService.togglePostLike(1L, LikeType.LIKE, 1L))
                .isInstanceOf(BusinessException.class)
                .hasMessage(ErrorCode.USER_NOT_FOUND.getMessage());
    }

    @Test
    @DisplayName("게시글 좋아요 - 게시글 없음")
    void togglePostLike_postNotFound() {
        given(userRepository.findById(1L)).willReturn(Optional.of(mockUser));
        given(communityPostRepository.findById(99L)).willReturn(Optional.empty());

        assertThatThrownBy(() -> communityPostService.togglePostLike(99L, LikeType.LIKE, 1L))
                .isInstanceOf(BusinessException.class)
                .hasMessage(ErrorCode.POST_NOT_FOUND.getMessage());
    }
}
