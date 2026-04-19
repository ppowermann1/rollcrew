package com.rollcrew.rollcrew.domain.community.service;


import com.rollcrew.rollcrew.domain.community.dto.CommunityPostListResponse;
import com.rollcrew.rollcrew.domain.community.dto.CommunityPostRequest;
import com.rollcrew.rollcrew.domain.community.dto.CommunityPostResponse;
import com.rollcrew.rollcrew.domain.community.entity.*;
import com.rollcrew.rollcrew.domain.community.repository.CommunityPostImageRepository;
import com.rollcrew.rollcrew.domain.community.repository.CommunityPostLikeRepository;
import com.rollcrew.rollcrew.domain.community.repository.CommunityPostNicknameRepository;
import com.rollcrew.rollcrew.domain.community.repository.CommunityPostRepository;
import com.rollcrew.rollcrew.domain.user.entity.User;
import com.rollcrew.rollcrew.domain.user.repository.UserRepository;
import com.rollcrew.rollcrew.global.exception.BusinessException;
import com.rollcrew.rollcrew.global.exception.ErrorCode;
import com.rollcrew.rollcrew.global.security.CustomOAuth2User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
@Transactional
public class CommunityPostService {


    private final CommunityPostRepository communityPostRepository;
    private final CommunityPostNicknameRepository communityPostNicknameRepository;
    private final UserRepository userRepository;
    private final CommunityPostLikeRepository communityPostLikeRepository;
    private final CommunityPostImageRepository communityPostImageRepository;

    public Long createPost(CustomOAuth2User principal, CommunityPostRequest request) {

        User user = userRepository.findById(principal.getUser().getId())
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        CommunityPost cratedPost = CommunityPost.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .communityCategory(request.getCommunityCategory())
                .user(user)
                .build();

        communityPostRepository.save(cratedPost);

        CommunityPostNickname createCommunityPostNickname = CommunityPostNickname.builder()
                .communityPost(cratedPost)
                .nickname(request.getNickname())
                .user(user)
                .build();

        communityPostNicknameRepository.save(createCommunityPostNickname);


        return cratedPost.getId();

    }

    @Transactional(readOnly = true)
    public Page<CommunityPostListResponse> getPostList(Pageable pageable) {
        Page<CommunityPost> posts = communityPostRepository.findAll(pageable);
        List<CommunityPost> postList = posts.getContent();

        Map<Long, List<CommunityPostLike>> likeMap = communityPostLikeRepository
                .findByCommunityPostIn(postList)
                .stream()
                .collect(Collectors.groupingBy(pl -> pl.getCommunityPost().getId()));

        Map<Long, String> nicknameMap = communityPostNicknameRepository
                .findByCommunityPostIn(postList)
                .stream()
                .collect(Collectors.toMap(
                        n -> n.getCommunityPost().getId(),
                        CommunityPostNickname::getNickname
                ));

        return posts.map(post -> toListResponse(post, likeMap, nicknameMap));
    }

    private CommunityPostListResponse toListResponse(CommunityPost post, Map<Long, List<CommunityPostLike>> likeMap, Map<Long, String> nicknameMap) {
        String nickname = nicknameMap.getOrDefault(post.getId(), "Unknown");

        long likeCount = likeMap.getOrDefault(post.getId(), List.of()).stream()
                .filter(pl -> pl.getLikeType() == LikeType.LIKE).count();
        long dislikeCount = likeMap.getOrDefault(post.getId(), List.of()).stream()
                .filter(pl -> pl.getLikeType() == LikeType.DISLIKE).count();

        return CommunityPostListResponse.builder()
                .title(post.getTitle())
                .nickname(nickname)
                .createdAt(post.getCreatedAt())
                .likeCount(likeCount)
                .dislikeCount(dislikeCount)
                .build();
    }


    public CommunityPostResponse getCommunityPost(Long postId) {

        CommunityPost communityPost = communityPostRepository.findById(postId)
                .orElseThrow(() -> new BusinessException(ErrorCode.POST_NOT_FOUND));

        CommunityPostNickname communityPostNickname = communityPostNicknameRepository.findByCommunityPost(communityPost)
                .orElseThrow(() -> new BusinessException(ErrorCode.NICKNAME_NOT_FOUND));

        long likeCount = communityPostLikeRepository.countByCommunityPostAndLikeType(communityPost, LikeType.LIKE);
        long dislikeCount = communityPostLikeRepository.countByCommunityPostAndLikeType(communityPost, LikeType.DISLIKE);

        List<String> imageUrls = communityPostImageRepository.findByCommunityPost(communityPost)
                .stream()
                .map(CommunityPostImage::getImageUrl)
                .toList();

        return CommunityPostResponse.builder()
                .title(communityPost.getTitle())
                .nickname(communityPostNickname.getNickname())
                .content(communityPost.getContent())
                .imageURL(imageUrls)
                .createdAt(communityPost.getCreatedAt())
                .likeCount(likeCount)
                .dislikeCount(dislikeCount)
                .build();
    }


    public CommunityPostResponse updatePost(Long postId, CommunityPostRequest request, Long userId) {

        CommunityPost communityPost = communityPostRepository.findById(postId)
                .orElseThrow(() -> new BusinessException(ErrorCode.POST_NOT_FOUND));

        if (!communityPost.getUser().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }

        communityPost.updatePost(request.getTitle(), request.getContent());

        CommunityPostNickname communityPostNickname = communityPostNicknameRepository
                .findByCommunityPost(communityPost)
                .orElseThrow(() -> new BusinessException(ErrorCode.NICKNAME_NOT_FOUND));

        return CommunityPostResponse.builder()
                .title(communityPost.getTitle())
                .nickname(communityPostNickname.getNickname())
                .content(communityPost.getContent())
                .createdAt(communityPost.getCreatedAt())
                .build();
    }

    public void deletePost(Long postId, Long userId) {

        CommunityPost communityPost = communityPostRepository.findById(postId)
                .orElseThrow(() -> new BusinessException(ErrorCode.POST_NOT_FOUND));

        if (!communityPost.getUser().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }

        communityPostRepository.delete(communityPost);
    }

    public void togglePostLike(Long postId, LikeType likeType, CustomOAuth2User principal) {
        User user = userRepository.findById(principal.getUser().getId())
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        CommunityPost communityPost = communityPostRepository.findById(postId)
                .orElseThrow(() -> new BusinessException(ErrorCode.POST_NOT_FOUND));

        Optional<CommunityPostLike> existing = communityPostLikeRepository.findByUserAndCommunityPost(user, communityPost);

        if (existing.isPresent()) {
            if (existing.get().getLikeType() == likeType) {
                communityPostLikeRepository.delete(existing.get());
            } else {
                communityPostLikeRepository.delete(existing.get());
                communityPostLikeRepository.save(
                        CommunityPostLike.builder()
                                .user(user)
                                .communityPost(communityPost)
                                .likeType(likeType)
                                .build()
                );
            }
        } else {
            communityPostLikeRepository.save(
                    CommunityPostLike.builder()
                            .user(user)
                            .communityPost(communityPost)
                            .likeType(likeType)
                            .build());
        }
    }
}