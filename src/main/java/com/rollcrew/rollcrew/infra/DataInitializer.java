package com.rollcrew.rollcrew.infra;

import com.rollcrew.rollcrew.domain.job.entity.JobCategory;
import com.rollcrew.rollcrew.domain.job.entity.JobPost;
import com.rollcrew.rollcrew.domain.job.entity.PostStatus;
import com.rollcrew.rollcrew.domain.job.repository.JobPostRepository;
import com.rollcrew.rollcrew.domain.jobApply.entity.Apply;
import com.rollcrew.rollcrew.domain.jobApply.entity.ApplyStatus;
import com.rollcrew.rollcrew.domain.jobApply.repository.ApplyRepository;
import com.rollcrew.rollcrew.domain.user.entity.Role;
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
    private final JobPostRepository jobPostRepository;
    private final ApplyRepository applyRepository;

    @Override
    public void run(ApplicationArguments args) throws Exception {

        if (jobPostRepository.count() > 0) {
            return;
        }


        User author = userRepository.save(User.builder()
                .email("author@rollcrew.com").nickname("김우석")
                .provider("kakao").providerId("4850912176")
                .role(Role.USER)
                .build());

        // 지원자 3명 (더미 유저)
        User applicant1 = userRepository.save(User.builder()
                .email("applicant1@rollcrew.com").nickname("정감독")
                .role(Role.USER)
                .provider("kakao").providerId("dummy_001").build());

        User applicant2 = userRepository.save(User.builder()
                .email("applicant2@rollcrew.com").nickname("빛과그림자")
                .role(Role.USER)
                .provider("kakao").providerId("dummy_002").build());

        User applicant3 = userRepository.save(User.builder()
                .email("applicant3@rollcrew.com").nickname("오디오가이")
                .role(Role.USER)
                .provider("kakao").providerId("dummy_003").build());

        // 테스트용 구인공고 1개 (작성자: 김우석)
        JobPost post = jobPostRepository.save(JobPost.builder()
                .user(author)
                .title("[급구] 단편영화 B캠 오퍼레이터 — 지원하기 기능 테스트용")
                .content("소니 FX3 경험자 우대. 1회차 촬영이며 페이는 20만원입니다.\n장비는 렌탈해두었으니 몸만 오시면 됩니다.")
                .category(JobCategory.FILMING)
                .shootingDates("2026-05-12")
                .status(PostStatus.OPEN)
                .build());

        // 지원 목업 — 3가지 status 케이스
        applyRepository.save(Apply.builder()
                .jobPost(post).applicant(applicant1)
                .message("안녕하세요, FX6 3년차 오퍼레이터입니다. 포트폴리오: https://vimeo.com/sample1")
                .status(ApplyStatus.PENDING)
                .build());

        applyRepository.save(Apply.builder()
                .jobPost(post).applicant(applicant2)
                .message("조명팀 출신이지만 카메라 보조도 가능합니다. 잘 부탁드립니다!")
                .status(ApplyStatus.ACCEPTED)
                .build());

        applyRepository.save(Apply.builder()
                .jobPost(post).applicant(applicant3)
                .message(null)
                .status(ApplyStatus.REJECTED)
                .build());
    }
}
