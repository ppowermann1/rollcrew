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
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;
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

    public Long createPost(Long userId, CommunityPostRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        CommunityPost createdPost = CommunityPost.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .communityCategory(request.getCommunityCategory())
                .user(user)
                .build();

        communityPostRepository.save(createdPost);

        CommunityPostNickname createCommunityPostNickname = CommunityPostNickname.builder()
                .communityPost(createdPost)
                .nickname(request.getNickname())
                .user(user)
                .build();

        communityPostNicknameRepository.save(createCommunityPostNickname);


        return createdPost.getId();

    }

    @Transactional(readOnly = true)
    public Page<CommunityPostListResponse> getPostList(CommunityCategory communityCategory, Pageable pageable) {
        Page<CommunityPost> posts = communityCategory != null
                ? communityPostRepository.findByCommunityCategory(communityCategory, pageable)
                : communityPostRepository.findAll(pageable);
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
                        CommunityPostNickname::getNickname,
                        (existing, replacement) -> existing
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
                .id(post.getId())
                .communityCategory(post.getCommunityCategory())
                .title(post.getTitle())
                .nickname(nickname)
                .createdAt(post.getCreatedAt())
                .likeCount(likeCount)
                .dislikeCount(dislikeCount)
                .build();
    }


    public CommunityPostResponse getCommunityPost(Long postId, Long userId) {

        CommunityPost communityPost = communityPostRepository.findById(postId)
                .orElseThrow(() -> new BusinessException(ErrorCode.POST_NOT_FOUND));

        CommunityPostNickname communityPostNickname = communityPostNicknameRepository
                .findByUserAndCommunityPost(communityPost.getUser(), communityPost)
                .orElseThrow(() -> new BusinessException(ErrorCode.NICKNAME_NOT_FOUND));

        long likeCount = communityPostLikeRepository.countByCommunityPostAndLikeType(communityPost, LikeType.LIKE);
        long dislikeCount = communityPostLikeRepository.countByCommunityPostAndLikeType(communityPost, LikeType.DISLIKE);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        boolean likedByMe = communityPostLikeRepository.existsByUserAndCommunityPostAndLikeType(user, communityPost, LikeType.LIKE);
        boolean dislikedByMe = communityPostLikeRepository.existsByUserAndCommunityPostAndLikeType(user, communityPost, LikeType.DISLIKE);

        List<String> imageUrls = communityPostImageRepository.findByCommunityPost(communityPost)
                .stream()
                .map(CommunityPostImage::getImageUrl)
                .toList();

        return CommunityPostResponse.builder()
                .id(communityPost.getId())
                .userId(communityPost.getUser().getId())
                .title(communityPost.getTitle())
                .nickname(communityPostNickname.getNickname())
                .content(communityPost.getContent())
                .imageURL(imageUrls)
                .communityCategory(communityPost.getCommunityCategory())
                .createdAt(communityPost.getCreatedAt())
                .likeCount(likeCount)
                .dislikeCount(dislikeCount)
                .likedByMe(likedByMe)
                .dislikedByMe(dislikedByMe)
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
                .findByUserAndCommunityPost(communityPost.getUser(), communityPost)
                .orElseThrow(() -> new BusinessException(ErrorCode.NICKNAME_NOT_FOUND));

        long likeCount = communityPostLikeRepository.countByCommunityPostAndLikeType(communityPost, LikeType.LIKE);
        long dislikeCount = communityPostLikeRepository.countByCommunityPostAndLikeType(communityPost, LikeType.DISLIKE);

        List<String> imageUrls = communityPostImageRepository.findByCommunityPost(communityPost)
                .stream()
                .map(CommunityPostImage::getImageUrl)
                .toList();

        return CommunityPostResponse.builder()
                .id(communityPost.getId())
                .userId(communityPost.getUser().getId())
                .title(communityPost.getTitle())
                .nickname(communityPostNickname.getNickname())
                .content(communityPost.getContent())
                .imageURL(imageUrls)
                .communityCategory(communityPost.getCommunityCategory())
                .createdAt(communityPost.getCreatedAt())
                .likeCount(likeCount)
                .dislikeCount(dislikeCount)
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

    public void togglePostLike(Long postId, LikeType likeType, Long userId) {
        User user = userRepository.findById(userId)
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

    @Transactional(readOnly = true)
    public Page<CommunityPostListResponse> getMyPosts(Long userId, Pageable pageable) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        Page<CommunityPost> posts = communityPostRepository.findByUser(user, pageable);

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
                        CommunityPostNickname::getNickname,
                        (existing, replacement) -> existing
                ));

        return posts.map(post -> toListResponse(post, likeMap, nicknameMap));
    }
}