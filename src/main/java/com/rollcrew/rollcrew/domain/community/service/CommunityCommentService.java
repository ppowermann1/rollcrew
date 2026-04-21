package com.rollcrew.rollcrew.domain.community.service;

import com.rollcrew.rollcrew.domain.community.dto.CommentCreateRequest;
import com.rollcrew.rollcrew.domain.community.dto.CommentResponse;
import com.rollcrew.rollcrew.domain.community.dto.CommentUpdateRequest;
import com.rollcrew.rollcrew.domain.community.entity.*;
import com.rollcrew.rollcrew.domain.community.repository.CommunityCommentLikeRepository;
import com.rollcrew.rollcrew.domain.community.repository.CommunityCommentRepository;
import com.rollcrew.rollcrew.domain.community.repository.CommunityPostNicknameRepository;
import com.rollcrew.rollcrew.domain.community.repository.CommunityPostRepository;
import com.rollcrew.rollcrew.domain.user.entity.User;
import com.rollcrew.rollcrew.domain.user.repository.UserRepository;
import com.rollcrew.rollcrew.global.exception.BusinessException;
import com.rollcrew.rollcrew.global.exception.ErrorCode;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CommunityCommentService {
    private final CommunityPostRepository communityPostRepository;
    private final CommunityPostNicknameRepository communityPostNicknameRepository;
    private final CommunityCommentRepository communityCommentRepository;
    private final UserRepository userRepository;
    private final CommunityCommentLikeRepository communityCommentLikeRepository;

    public CommentResponse createComments(Long postId, CommentCreateRequest request, Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        CommunityPost communityPost = communityPostRepository.findById(postId)
                .orElseThrow(() -> new BusinessException(ErrorCode.POST_NOT_FOUND));

        CommunityComment parent = null;
        if (request.getParentId() != null) {
            parent = communityCommentRepository.findById(request.getParentId())
                    .orElseThrow(() -> new BusinessException(ErrorCode.COMMENT_NOT_FOUND));

            if (parent.getParent() != null) {
                throw new BusinessException(ErrorCode.COMMENT_DEPTH_EXCEEDED);
            }
        }


        CommunityPostNickname postNickname = communityPostNicknameRepository
                .findByUserAndCommunityPost(user, communityPost)
                .orElseGet(() -> communityPostNicknameRepository.save(
                        CommunityPostNickname.builder()
                                .user(user)
                                .communityPost(communityPost)
                                .nickname(request.getNickname())
                                .build()
                ));

        CommunityComment communityComment = CommunityComment.builder().
                user(user).
                communityPost(communityPost).
                parent(parent).
                content(request.getContent())
                .build();

        communityCommentRepository.save(communityComment);

        return CommentResponse.builder().
                id(communityComment.getId())
                .content(communityComment.getContent())
                .nickname(postNickname.getNickname())
                .createdAt(communityComment.getCreatedAt())
                .isDeleted(communityComment.isDeleted())
                .replies(List.of())
                .build();
    }

    @Transactional(readOnly = true)
    public List<CommentResponse> getComments(Long postId, int page) {

        Pageable pageable = PageRequest.of(page, 20, Sort.by("createdAt").ascending());

        CommunityPost communityPost = communityPostRepository.findById(postId)
                .orElseThrow(() -> new BusinessException(ErrorCode.POST_NOT_FOUND));

        Page<CommunityComment> byCommunityPostWithParent = communityCommentRepository.findByCommunityPostWithParent(communityPost, pageable);

        // 1. 페이징된 결과에서 전체 댓글 리스트 추출
        List<CommunityComment> allComments = byCommunityPostWithParent.getContent();

        // 2. 해당 게시글의 작성자별 익명 닉네임 일괄 조회 (Map 변환)
        Map<Long, String> nicknameMap = communityPostNicknameRepository
                .findByCommunityPost(communityPost)
                .stream()
                .collect(Collectors.toMap(
                        n -> n.getUser().getId(),
                        CommunityPostNickname::getNickname,
                        (existing, replacement) -> existing
                ));

        // 3. 대댓글 그룹화 (부모 ID 기준 Map 변환)
        Map<Long, List<CommunityComment>> replyMap = allComments.stream()
                .filter(c -> c.getParent() != null)
                .collect(Collectors.groupingBy(c -> c.getParent().getId()));

        // 4. 댓글별 좋아요/싫어요 데이터 일괄 조회 및 그룹화
        Map<Long, List<CommunityCommentLike>> likeMap = communityCommentLikeRepository
                .findByCommunityCommentIn(allComments)
                .stream()
                .collect(Collectors.groupingBy(cl -> cl.getCommunityComment().getId()));

        // 5. 게시글 작성자 userId
        Long postAuthorId = communityPost.getUser().getId();

        // 6. 최상위 댓글 필터링 및 대댓글 매핑을 포함한 DTO 변환
        return allComments.stream()
                .filter(c -> c.getParent() == null)
                .map(c -> CommentResponse.builder()
                        .id(c.getId())
                        .isDeleted(c.isDeleted())
                        .likeCount(likeMap.getOrDefault(c.getId(), List.of()).stream()
                                .filter(cl -> cl.getLikeType() == LikeType.LIKE).count())
                        .dislikeCount(likeMap.getOrDefault(c.getId(), List.of()).stream()
                                .filter(cl -> cl.getLikeType() == LikeType.DISLIKE).count())
                        .content(c.getContent())
                        .nickname(nicknameMap.getOrDefault(c.getUser().getId(), "Unknown"))
                        .createdAt(c.getCreatedAt())
                        .isAuthor(postAuthorId.equals(c.getUser().getId()))
                        .replies(replyMap.getOrDefault(c.getId(), List.of()).stream()
                                .map(reply -> CommentResponse.builder()
                                        .id(reply.getId())
                                        .content(reply.getContent())
                                        .nickname(nicknameMap.getOrDefault(reply.getUser().getId(), "Unknown"))
                                        .createdAt(reply.getCreatedAt())
                                        .likeCount(likeMap.getOrDefault(reply.getId(), List.of()).stream()
                                                .filter(cl -> cl.getLikeType() == LikeType.LIKE).count())
                                        .dislikeCount(likeMap.getOrDefault(reply.getId(), List.of()).stream()
                                                .filter(cl -> cl.getLikeType() == LikeType.DISLIKE).count())
                                        .replies(List.of())
                                        .isDeleted(reply.isDeleted())
                                        .isAuthor(postAuthorId.equals(reply.getUser().getId()))
                                        .build())
                                .toList())
                        .build())
                .toList();
    }


    public CommentResponse updateComment(Long commentId, @Valid CommentUpdateRequest request, Long userId) {

        CommunityComment communityComment = communityCommentRepository.findById(commentId)
                .orElseThrow(() -> new BusinessException(ErrorCode.COMMENT_NOT_FOUND));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));


        if (!communityComment.getUser().getId().equals(user.getId())) {
            throw new BusinessException(ErrorCode.FORBIDDEN_COMMENT);
        }


        CommunityPostNickname communityPostNickname = communityPostNicknameRepository
                .findByUserAndCommunityPost(user, communityComment.getCommunityPost())
                .orElseThrow(() -> new BusinessException(ErrorCode.NICKNAME_NOT_FOUND));

        communityComment.updateContent(request.getContent());

        return
                CommentResponse.builder()
                        .id(communityComment.getId())
                        .content(request.getContent())
                        .nickname(communityPostNickname.getNickname())
                        .createdAt(communityComment.getCreatedAt())
                        .isDeleted(communityComment.isDeleted())
                        .replies(List.of())
                        .build();

    }

    @Transactional
    public void deleteComment(Long commentId, Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        CommunityComment comment = communityCommentRepository.findById(commentId)
                .orElseThrow(() -> new BusinessException(ErrorCode.COMMENT_NOT_FOUND));

        if (!comment.getUser().getId().equals(user.getId())) {
            throw new BusinessException(ErrorCode.FORBIDDEN_COMMENT);
        }

        comment.softDelete();
    }

    @Transactional
    public void toggleCommentLike(Long commentId, LikeType likeType, Long userId) {

        User user = userRepository.findById(userId).orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        CommunityComment communityComment = communityCommentRepository.findById(commentId).orElseThrow(() -> new BusinessException(ErrorCode.COMMENT_NOT_FOUND));


        Optional<CommunityCommentLike> existing = communityCommentLikeRepository.findByUserAndCommunityComment(user, communityComment);

        if (existing.isPresent()) {
            if (existing.get().getLikeType() == likeType) {
                communityCommentLikeRepository.delete(existing.get());
            } else {
                communityCommentLikeRepository.delete(existing.get());
                communityCommentLikeRepository.save(
                        CommunityCommentLike.builder()
                                .user(user)
                                .communityComment(communityComment)
                                .likeType(likeType)
                                .build()
                );
            }
        } else {

            communityCommentLikeRepository.save(
                    CommunityCommentLike.builder()
                            .user(user)
                            .communityComment(communityComment)
                            .likeType(likeType)
                            .build());
        }
    }
}
