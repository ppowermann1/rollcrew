package com.rollcrew.rollcrew.domain.community.service;

import com.rollcrew.rollcrew.domain.community.dto.CommentCreateRequest;
import com.rollcrew.rollcrew.domain.community.dto.CommentResponse;
import com.rollcrew.rollcrew.domain.community.dto.CommentUpdateRequest;
import com.rollcrew.rollcrew.domain.community.entity.CommunityComment;
import com.rollcrew.rollcrew.domain.community.entity.CommunityPost;
import com.rollcrew.rollcrew.domain.community.entity.CommunityPostNickname;
import com.rollcrew.rollcrew.domain.community.repository.CommunityCommentRepository;
import com.rollcrew.rollcrew.domain.community.repository.CommunityPostNicknameRepository;
import com.rollcrew.rollcrew.domain.community.repository.CommunityPostRepository;
import com.rollcrew.rollcrew.domain.user.entity.User;
import com.rollcrew.rollcrew.domain.user.repository.UserRepository;
import com.rollcrew.rollcrew.global.exception.BusinessException;
import com.rollcrew.rollcrew.global.exception.ErrorCode;
import com.rollcrew.rollcrew.global.security.CustomOAuth2User;
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

    public CommentResponse createComments(Long postId, CommentCreateRequest request, CustomOAuth2User principal) {

        Long id = principal.getUser().getId();
        User user = userRepository.findById(id)
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

// 1. Page에서 List 꺼내기
        List<CommunityComment> allComments = byCommunityPostWithParent.getContent();

// 2. 닉네임 한 방에 조회 → Map<userId, nickname>
        Map<Long, String> nicknameMap = communityPostNicknameRepository
                .findByCommunityPost(communityPost)
                .stream()
                .collect(Collectors.toMap(
                        n -> n.getUser().getId(),
                        CommunityPostNickname::getNickname
                ));

// 3. 대댓글 Map으로 분류 → Map<parentId, List<대댓글>>
        Map<Long, List<CommunityComment>> replyMap = allComments.stream()
                .filter(c -> c.getParent() != null)
                .collect(Collectors.groupingBy(c -> c.getParent().getId()));

// 4. 최상위 댓글만 필터 → CommentResponse 변환
        return allComments.stream()
                .filter(c -> c.getParent() == null)
                .map(c -> CommentResponse.builder()
                        .id(c.getId())
                        .isDeleted(c.isDeleted())
                        .content(c.getContent())
                        .nickname(nicknameMap.get(c.getUser().getId()))
                        .createdAt(c.getCreatedAt())
                        .replies(replyMap.getOrDefault(c.getId(), List.of()).stream()
                                .map(reply -> CommentResponse.builder()
                                        .id(reply.getId())
                                        .content(reply.getContent())
                                        .nickname(nicknameMap.get(reply.getUser().getId()))
                                        .createdAt(reply.getCreatedAt())
                                        .replies(List.of())
                                        .isDeleted(reply.isDeleted())
                                        .build())
                                .toList())
                        .build())
                .toList();
    }


    public CommentResponse updateComment(Long commentId, @Valid CommentUpdateRequest request, CustomOAuth2User principal) {

        CommunityComment communityComment = communityCommentRepository.findById(commentId)
                .orElseThrow(() -> new BusinessException(ErrorCode.COMMENT_NOT_FOUND));

        User user = userRepository.findById(principal.getUser().getId())
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
    public void deleteComment(Long commentId, CustomOAuth2User principal) {
        User user = userRepository.findById(principal.getUser().getId()).orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        CommunityComment comment = communityCommentRepository.findById(commentId)
                .orElseThrow(() -> new BusinessException(ErrorCode.COMMENT_NOT_FOUND));

        if (!comment.getUser().getId().equals(user.getId())) {
            throw new BusinessException(ErrorCode.FORBIDDEN_COMMENT);
        }

        comment.softDelete();
    }
}
