package com.rollcrew.rollcrew.domain.community.service;


import com.rollcrew.rollcrew.domain.community.dto.CommunityPostRequest;
import com.rollcrew.rollcrew.domain.community.entity.CommunityPost;
import com.rollcrew.rollcrew.domain.community.entity.CommunityPostNickname;
import com.rollcrew.rollcrew.domain.community.repository.CommunityPostNicknameRepository;
import com.rollcrew.rollcrew.domain.community.repository.CommunityPostRepository;
import com.rollcrew.rollcrew.domain.user.entity.User;
import com.rollcrew.rollcrew.domain.user.repository.UserRepository;
import com.rollcrew.rollcrew.global.exception.BusinessException;
import com.rollcrew.rollcrew.global.exception.ErrorCode;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
@Transactional
public class CommunityPostService {


    private final CommunityPostRepository communityPostRepository;
    private final CommunityPostNicknameRepository communityPostNicknameRepository;
    private final UserRepository userRepository;

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
}
