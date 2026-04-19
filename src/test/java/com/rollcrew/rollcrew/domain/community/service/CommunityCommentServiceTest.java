package com.rollcrew.rollcrew.domain.community.service;

import com.rollcrew.rollcrew.domain.community.dto.CommentCreateRequest;
import com.rollcrew.rollcrew.domain.community.dto.CommentResponse;
import com.rollcrew.rollcrew.domain.community.dto.CommentUpdateRequest;
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
import org.springframework.data.domain.Pageable;

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
class CommunityCommentServiceTest {

    @Mock
    private CommunityPostRepository communityPostRepository;
    @Mock
    private CommunityPostNicknameRepository communityPostNicknameRepository;
    @Mock
    private CommunityCommentRepository communityCommentRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private CommunityCommentLikeRepository communityCommentLikeRepository;

    @InjectMocks
    private CommunityCommentService communityCommentService;

    private User mockUser;
    private User otherUser;
    private CommunityPost mockPost;
    private CommunityComment mockComment;
    private CommunityPostNickname mockNickname;
    private CustomOAuth2User mockPrincipal;
    private CustomOAuth2User otherPrincipal;

    @BeforeEach
    void setUp() {
        mockUser = User.builder()
                .id(1L).email("test@test.com").nickname("테스트유저")
                .provider("kakao").providerId("kakao-123").role(Role.USER).build();

        otherUser = User.builder()
                .id(2L).email("other@test.com").nickname("다른유저")
                .provider("naver").providerId("naver-456").role(Role.USER).build();

        mockPost = CommunityPost.builder()
                .id(1L).user(mockUser).title("테스트 게시글")
                .content("게시글 내용").communityCategory(CommunityCategory.GENERAL).build();

        mockComment = CommunityComment.builder()
                .id(1L).user(mockUser).communityPost(mockPost)
                .content("테스트 댓글").build();

        mockNickname = CommunityPostNickname.builder()
                .id(1L).user(mockUser).communityPost(mockPost).nickname("졸린 망고").build();

        mockPrincipal = new CustomOAuth2User(mockUser, Map.of());
        otherPrincipal = new CustomOAuth2User(otherUser, Map.of());
    }

    // ── createComments ──────────────────────────────────────────────────────────

    @Test
    @DisplayName("댓글 생성 성공 - 기존 닉네임 재사용")
    void createComments_success_existingNickname() {
        CommentCreateRequest request = CommentCreateRequest.builder()
                .content("댓글 내용").nickname("졸린 망고").build();

        given(userRepository.findById(1L)).willReturn(Optional.of(mockUser));
        given(communityPostRepository.findById(1L)).willReturn(Optional.of(mockPost));
        given(communityPostNicknameRepository.findByUserAndCommunityPost(mockUser, mockPost))
                .willReturn(Optional.of(mockNickname));
        given(communityCommentRepository.save(any(CommunityComment.class))).willReturn(mockComment);

        CommentResponse response = communityCommentService.createComments(1L, request, mockPrincipal);

        assertThat(response.getContent()).isEqualTo("댓글 내용");
        assertThat(response.getNickname()).isEqualTo("졸린 망고");
        assertThat(response.getIsDeleted()).isFalse();
    }

    @Test
    @DisplayName("댓글 생성 성공 - 닉네임 신규 생성")
    void createComments_success_newNickname() {
        CommentCreateRequest request = CommentCreateRequest.builder()
                .content("댓글 내용").nickname("새 닉네임").build();

        given(userRepository.findById(1L)).willReturn(Optional.of(mockUser));
        given(communityPostRepository.findById(1L)).willReturn(Optional.of(mockPost));
        given(communityPostNicknameRepository.findByUserAndCommunityPost(mockUser, mockPost))
                .willReturn(Optional.empty());
        given(communityPostNicknameRepository.save(any(CommunityPostNickname.class))).willReturn(mockNickname);
        given(communityCommentRepository.save(any(CommunityComment.class))).willReturn(mockComment);

        CommentResponse response = communityCommentService.createComments(1L, request, mockPrincipal);

        verify(communityPostNicknameRepository).save(any(CommunityPostNickname.class));
        assertThat(response).isNotNull();
    }

    @Test
    @DisplayName("대댓글 생성 성공")
    void createComments_reply_success() {
        CommentCreateRequest request = CommentCreateRequest.builder()
                .content("대댓글").nickname("졸린 망고").parentId(1L).build();

        CommunityComment reply = CommunityComment.builder()
                .id(2L).user(mockUser).communityPost(mockPost)
                .parent(mockComment).content("대댓글").build();

        given(userRepository.findById(1L)).willReturn(Optional.of(mockUser));
        given(communityPostRepository.findById(1L)).willReturn(Optional.of(mockPost));
        given(communityCommentRepository.findById(1L)).willReturn(Optional.of(mockComment));
        given(communityPostNicknameRepository.findByUserAndCommunityPost(mockUser, mockPost))
                .willReturn(Optional.of(mockNickname));
        given(communityCommentRepository.save(any(CommunityComment.class))).willReturn(reply);

        CommentResponse response = communityCommentService.createComments(1L, request, mockPrincipal);

        assertThat(response.getContent()).isEqualTo("대댓글");
    }

    @Test
    @DisplayName("댓글 생성 실패 - 대댓글의 대댓글 시도")
    void createComments_depthExceeded() {
        CommunityComment parentComment = CommunityComment.builder()
                .id(10L).user(mockUser).communityPost(mockPost).content("부모").build();
        CommunityComment childComment = CommunityComment.builder()
                .id(11L).user(mockUser).communityPost(mockPost).parent(parentComment).content("자식").build();

        CommentCreateRequest request = CommentCreateRequest.builder()
                .content("손자 댓글").nickname("닉").parentId(11L).build();

        given(userRepository.findById(1L)).willReturn(Optional.of(mockUser));
        given(communityPostRepository.findById(1L)).willReturn(Optional.of(mockPost));
        given(communityCommentRepository.findById(11L)).willReturn(Optional.of(childComment));

        assertThatThrownBy(() -> communityCommentService.createComments(1L, request, mockPrincipal))
                .isInstanceOf(BusinessException.class)
                .hasMessage(ErrorCode.COMMENT_DEPTH_EXCEEDED.getMessage());
    }

    @Test
    @DisplayName("댓글 생성 실패 - 게시글 없음")
    void createComments_postNotFound() {
        CommentCreateRequest request = CommentCreateRequest.builder()
                .content("댓글").nickname("닉").build();

        given(userRepository.findById(1L)).willReturn(Optional.of(mockUser));
        given(communityPostRepository.findById(99L)).willReturn(Optional.empty());

        assertThatThrownBy(() -> communityCommentService.createComments(99L, request, mockPrincipal))
                .isInstanceOf(BusinessException.class)
                .hasMessage(ErrorCode.POST_NOT_FOUND.getMessage());
    }

    @Test
    @DisplayName("댓글 생성 실패 - 부모 댓글 없음")
    void createComments_parentNotFound() {
        CommentCreateRequest request = CommentCreateRequest.builder()
                .content("댓글").nickname("닉").parentId(999L).build();

        given(userRepository.findById(1L)).willReturn(Optional.of(mockUser));
        given(communityPostRepository.findById(1L)).willReturn(Optional.of(mockPost));
        given(communityCommentRepository.findById(999L)).willReturn(Optional.empty());

        assertThatThrownBy(() -> communityCommentService.createComments(1L, request, mockPrincipal))
                .isInstanceOf(BusinessException.class)
                .hasMessage(ErrorCode.COMMENT_NOT_FOUND.getMessage());
    }

    // ── getComments ─────────────────────────────────────────────────────────────

    @Test
    @DisplayName("댓글 목록 조회 성공")
    void getComments_success() {
        Page<CommunityComment> commentPage = new PageImpl<>(List.of(mockComment));

        given(communityPostRepository.findById(1L)).willReturn(Optional.of(mockPost));
        given(communityCommentRepository.findByCommunityPostWithParent(any(CommunityPost.class), any(Pageable.class)))
                .willReturn(commentPage);
        // findByCommunityPost returns Optional in CommunityCommentService (stream on Optional)
        given(communityPostNicknameRepository.findAuthorNicknameByCommunityPost(mockPost)).willReturn(Optional.of(mockNickname));
        given(communityCommentLikeRepository.findByCommunityCommentIn(any())).willReturn(List.of());

        List<CommentResponse> responses = communityCommentService.getComments(1L, 0);

        assertThat(responses).hasSize(1);
        assertThat(responses.get(0).getContent()).isEqualTo("테스트 댓글");
        assertThat(responses.get(0).getNickname()).isEqualTo("졸린 망고");
    }

    @Test
    @DisplayName("댓글 목록 조회 - 닉네임 없으면 Unknown")
    void getComments_noNickname_returnsUnknown() {
        Page<CommunityComment> commentPage = new PageImpl<>(List.of(mockComment));

        given(communityPostRepository.findById(1L)).willReturn(Optional.of(mockPost));
        given(communityCommentRepository.findByCommunityPostWithParent(any(CommunityPost.class), any(Pageable.class)))
                .willReturn(commentPage);
        given(communityPostNicknameRepository.findAuthorNicknameByCommunityPost(mockPost)).willReturn(Optional.empty());
        given(communityCommentLikeRepository.findByCommunityCommentIn(any())).willReturn(List.of());

        List<CommentResponse> responses = communityCommentService.getComments(1L, 0);

        assertThat(responses.get(0).getNickname()).isEqualTo("Unknown");
    }

    @Test
    @DisplayName("댓글 목록 조회 - 좋아요/싫어요 카운트")
    void getComments_likeCount() {
        CommunityCommentLike like = CommunityCommentLike.builder()
                .user(mockUser).communityComment(mockComment).likeType(LikeType.LIKE).build();

        Page<CommunityComment> commentPage = new PageImpl<>(List.of(mockComment));

        given(communityPostRepository.findById(1L)).willReturn(Optional.of(mockPost));
        given(communityCommentRepository.findByCommunityPostWithParent(any(CommunityPost.class), any(Pageable.class)))
                .willReturn(commentPage);
        given(communityPostNicknameRepository.findAuthorNicknameByCommunityPost(mockPost)).willReturn(Optional.of(mockNickname));
        given(communityCommentLikeRepository.findByCommunityCommentIn(any())).willReturn(List.of(like));

        List<CommentResponse> responses = communityCommentService.getComments(1L, 0);

        assertThat(responses.get(0).getLikeCount()).isEqualTo(1);
        assertThat(responses.get(0).getDislikeCount()).isEqualTo(0);
    }

    @Test
    @DisplayName("댓글 목록 조회 실패 - 게시글 없음")
    void getComments_postNotFound() {
        given(communityPostRepository.findById(99L)).willReturn(Optional.empty());

        assertThatThrownBy(() -> communityCommentService.getComments(99L, 0))
                .isInstanceOf(BusinessException.class)
                .hasMessage(ErrorCode.POST_NOT_FOUND.getMessage());
    }

    // ── updateComment ───────────────────────────────────────────────────────────

    @Test
    @DisplayName("댓글 수정 성공")
    void updateComment_success() {
        CommentUpdateRequest request = new CommentUpdateRequest("수정된 댓글");

        given(communityCommentRepository.findById(1L)).willReturn(Optional.of(mockComment));
        given(userRepository.findById(1L)).willReturn(Optional.of(mockUser));
        given(communityPostNicknameRepository.findByUserAndCommunityPost(mockUser, mockPost))
                .willReturn(Optional.of(mockNickname));

        CommentResponse response = communityCommentService.updateComment(1L, request, mockPrincipal);

        assertThat(response.getContent()).isEqualTo("수정된 댓글");
        assertThat(response.getNickname()).isEqualTo("졸린 망고");
    }

    @Test
    @DisplayName("댓글 수정 실패 - 권한 없음")
    void updateComment_forbidden() {
        CommentUpdateRequest request = new CommentUpdateRequest("수정 시도");

        given(communityCommentRepository.findById(1L)).willReturn(Optional.of(mockComment));
        given(userRepository.findById(2L)).willReturn(Optional.of(otherUser));

        assertThatThrownBy(() -> communityCommentService.updateComment(1L, request, otherPrincipal))
                .isInstanceOf(BusinessException.class)
                .hasMessage(ErrorCode.FORBIDDEN_COMMENT.getMessage());
    }

    @Test
    @DisplayName("댓글 수정 실패 - 댓글 없음")
    void updateComment_commentNotFound() {
        CommentUpdateRequest request = new CommentUpdateRequest("수정");

        given(communityCommentRepository.findById(99L)).willReturn(Optional.empty());

        assertThatThrownBy(() -> communityCommentService.updateComment(99L, request, mockPrincipal))
                .isInstanceOf(BusinessException.class)
                .hasMessage(ErrorCode.COMMENT_NOT_FOUND.getMessage());
    }

    // ── deleteComment ───────────────────────────────────────────────────────────

    @Test
    @DisplayName("댓글 삭제(소프트 딜리트) 성공")
    void deleteComment_success() {
        given(userRepository.findById(1L)).willReturn(Optional.of(mockUser));
        given(communityCommentRepository.findById(1L)).willReturn(Optional.of(mockComment));

        communityCommentService.deleteComment(1L, mockPrincipal);

        assertThat(mockComment.isDeleted()).isTrue();
    }

    @Test
    @DisplayName("댓글 삭제 실패 - 권한 없음")
    void deleteComment_forbidden() {
        given(userRepository.findById(2L)).willReturn(Optional.of(otherUser));
        given(communityCommentRepository.findById(1L)).willReturn(Optional.of(mockComment));

        assertThatThrownBy(() -> communityCommentService.deleteComment(1L, otherPrincipal))
                .isInstanceOf(BusinessException.class)
                .hasMessage(ErrorCode.FORBIDDEN_COMMENT.getMessage());
    }

    @Test
    @DisplayName("댓글 삭제 실패 - 댓글 없음")
    void deleteComment_commentNotFound() {
        given(userRepository.findById(1L)).willReturn(Optional.of(mockUser));
        given(communityCommentRepository.findById(99L)).willReturn(Optional.empty());

        assertThatThrownBy(() -> communityCommentService.deleteComment(99L, mockPrincipal))
                .isInstanceOf(BusinessException.class)
                .hasMessage(ErrorCode.COMMENT_NOT_FOUND.getMessage());
    }

    // ── toggleCommentLike ───────────────────────────────────────────────────────

    @Test
    @DisplayName("댓글 좋아요 최초 등록")
    void toggleCommentLike_newLike() {
        given(userRepository.findById(1L)).willReturn(Optional.of(mockUser));
        given(communityCommentRepository.findById(1L)).willReturn(Optional.of(mockComment));
        given(communityCommentLikeRepository.findByUserAndCommunityComment(mockUser, mockComment))
                .willReturn(Optional.empty());

        communityCommentService.toggleCommentLike(1L, LikeType.LIKE, mockPrincipal);

        verify(communityCommentLikeRepository).save(any(CommunityCommentLike.class));
    }

    @Test
    @DisplayName("동일 타입 좋아요 재클릭 - 취소")
    void toggleCommentLike_cancelSameType() {
        CommunityCommentLike existing = CommunityCommentLike.builder()
                .user(mockUser).communityComment(mockComment).likeType(LikeType.LIKE).build();

        given(userRepository.findById(1L)).willReturn(Optional.of(mockUser));
        given(communityCommentRepository.findById(1L)).willReturn(Optional.of(mockComment));
        given(communityCommentLikeRepository.findByUserAndCommunityComment(mockUser, mockComment))
                .willReturn(Optional.of(existing));

        communityCommentService.toggleCommentLike(1L, LikeType.LIKE, mockPrincipal);

        verify(communityCommentLikeRepository).delete(existing);
    }

    @Test
    @DisplayName("좋아요에서 싫어요로 전환")
    void toggleCommentLike_switchType() {
        CommunityCommentLike existing = CommunityCommentLike.builder()
                .user(mockUser).communityComment(mockComment).likeType(LikeType.LIKE).build();

        given(userRepository.findById(1L)).willReturn(Optional.of(mockUser));
        given(communityCommentRepository.findById(1L)).willReturn(Optional.of(mockComment));
        given(communityCommentLikeRepository.findByUserAndCommunityComment(mockUser, mockComment))
                .willReturn(Optional.of(existing));

        communityCommentService.toggleCommentLike(1L, LikeType.DISLIKE, mockPrincipal);

        verify(communityCommentLikeRepository).delete(existing);
        verify(communityCommentLikeRepository).save(any(CommunityCommentLike.class));
    }

    @Test
    @DisplayName("댓글 좋아요 실패 - 댓글 없음")
    void toggleCommentLike_commentNotFound() {
        given(userRepository.findById(1L)).willReturn(Optional.of(mockUser));
        given(communityCommentRepository.findById(99L)).willReturn(Optional.empty());

        assertThatThrownBy(() -> communityCommentService.toggleCommentLike(99L, LikeType.LIKE, mockPrincipal))
                .isInstanceOf(BusinessException.class)
                .hasMessage(ErrorCode.COMMENT_NOT_FOUND.getMessage());
    }
}
