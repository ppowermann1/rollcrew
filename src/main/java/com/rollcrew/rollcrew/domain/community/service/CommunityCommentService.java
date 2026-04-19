package com.rollcrew.rollcrew.domain.community.service;

import com.rollcrew.rollcrew.domain.community.dto.CommentCreateRequest;
import com.rollcrew.rollcrew.domain.community.dto.CommentResponse;
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
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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
                .replies(List.of())
                .build();
    }
}
