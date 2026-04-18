package com.rollcrew.rollcrew.domain.community.service;


import com.rollcrew.rollcrew.domain.community.dto.CommunityPostListResponse;
import com.rollcrew.rollcrew.domain.community.dto.CommunityPostRequest;
import com.rollcrew.rollcrew.domain.community.dto.CommunityPostResponse;
import com.rollcrew.rollcrew.domain.community.entity.CommunityPost;
import com.rollcrew.rollcrew.domain.community.entity.CommunityPostImage;
import com.rollcrew.rollcrew.domain.community.entity.CommunityPostNickname;
import com.rollcrew.rollcrew.domain.community.entity.LikeType;
import com.rollcrew.rollcrew.domain.community.repository.CommunityPostImageRepository;
import com.rollcrew.rollcrew.domain.community.repository.CommunityPostLikeRepository;
import com.rollcrew.rollcrew.domain.community.repository.CommunityPostNicknameRepository;
import com.rollcrew.rollcrew.domain.community.repository.CommunityPostRepository;
import com.rollcrew.rollcrew.domain.user.entity.User;
import com.rollcrew.rollcrew.domain.user.repository.UserRepository;
import com.rollcrew.rollcrew.global.exception.BusinessException;
import com.rollcrew.rollcrew.global.exception.ErrorCode;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;


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

    public Page<CommunityPostListResponse> getPostList(Pageable pageable) {
        Page<CommunityPost> posts = communityPostRepository.findAll(pageable);
        return posts.map(post -> toListResponse(post));
    }

    private CommunityPostListResponse toListResponse(CommunityPost post) {
        String nickname = communityPostNicknameRepository.findByCommunityPost(post)
                .map(CommunityPostNickname::getNickname)
                .orElse("알 수 없음");
        long likeCount = communityPostLikeRepository.countByCommunityPostAndLikeType(post, LikeType.LIKE);
        long dislikeCount = communityPostLikeRepository.countByCommunityPostAndLikeType(post, LikeType.DISLIKE);

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


}