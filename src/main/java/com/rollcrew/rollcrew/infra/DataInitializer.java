package com.rollcrew.rollcrew.infra;

import com.rollcrew.rollcrew.domain.community.entity.CommunityCategory;
import com.rollcrew.rollcrew.domain.community.entity.CommunityPost;
import com.rollcrew.rollcrew.domain.community.entity.CommunityPostNickname;
import com.rollcrew.rollcrew.domain.community.repository.CommunityPostNicknameRepository;
import com.rollcrew.rollcrew.domain.community.repository.CommunityPostRepository;
import com.rollcrew.rollcrew.domain.user.entity.User;
import com.rollcrew.rollcrew.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile("local")
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final CommunityPostRepository communityPostRepository;
    private final CommunityPostNicknameRepository communityPostNicknameRepository;

    @Override
    public void run(ApplicationArguments args) throws Exception {

        User user = User.builder()
                .email("test@test.com")
                .nickname("테스트유저")
                .provider("kakao")
                .providerId("test123")
                .build();
        userRepository.save(user);

        CommunityPost post1 = CommunityPost.builder()
                .user(user)
                .title("촬영 현장 썰 풀어봄")
                .content("오늘 촬영 현장에서 진짜 황당한 일이 있었는데 들어봐요")
                .communityCategory(CommunityCategory.GENERAL)
                .build();
        communityPostRepository.save(post1);

        CommunityPost post2 = CommunityPost.builder()
                .user(user)
                .title("조명 장비 추천해주세요")
                .content("입문용 조명 장비 뭐가 좋을까요? 예산은 50만원입니다")
                .communityCategory(CommunityCategory.GENERAL)
                .build();
        communityPostRepository.save(post2);

        communityPostNicknameRepository.save(CommunityPostNickname.builder()
                .user(user)
                .communityPost(post1)
                .nickname("졸린 망고")
                .build());

        communityPostNicknameRepository.save(CommunityPostNickname.builder()
                .user(user)
                .communityPost(post2)
                .nickname("통통한 다람쥐")
                .build());
    }
}