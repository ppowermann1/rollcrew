package com.rollcrew.rollcrew.infra;

import com.rollcrew.rollcrew.domain.community.entity.*;
import com.rollcrew.rollcrew.domain.community.repository.CommunityCommentRepository;
import com.rollcrew.rollcrew.domain.community.repository.CommunityPostNicknameRepository;
import com.rollcrew.rollcrew.domain.community.repository.CommunityPostRepository;
import com.rollcrew.rollcrew.domain.job.entity.JobCategory;
import com.rollcrew.rollcrew.domain.job.entity.JobPost;
import com.rollcrew.rollcrew.domain.job.entity.PostStatus;
import com.rollcrew.rollcrew.domain.job.repository.JobPostRepository;
import com.rollcrew.rollcrew.domain.jobApply.entity.Apply;
import com.rollcrew.rollcrew.domain.jobApply.entity.ApplyStatus;
import com.rollcrew.rollcrew.domain.jobApply.repository.ApplyRepository;
import com.rollcrew.rollcrew.domain.notification.entity.Notification;
import com.rollcrew.rollcrew.domain.notification.entity.NotificationType;
import com.rollcrew.rollcrew.domain.notification.repository.NotificationRepository;
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
    private final CommunityPostRepository communityPostRepository;
    private final CommunityCommentRepository communityCommentRepository;
    private final CommunityPostNicknameRepository communityPostNicknameRepository;
    private final NotificationRepository notificationRepository;

    @Override
    public void run(ApplicationArguments args) {

        if (jobPostRepository.count() > 0) return;

        // ── 유저 ──────────────────────────────────────────────────
        User wooseok = userRepository.save(User.builder()
                .email("wooseok@rollcrew.com").nickname("김우석")
                .provider("kakao").providerId("4850912176").role(Role.USER).build());

        User tlt = userRepository.save(User.builder()
                .email("tlt@rollcrew.com").nickname("tlt****")
                .provider("naver").providerId("EwXuXNt_71i4_D27ij9P8a_UBTr3RL8GtLKQLN2m2TQ").role(Role.USER).build());

        User jeong = userRepository.save(User.builder()
                .email("jeong@rollcrew.com").nickname("정감독")
                .provider("kakao").providerId("dummy_001").role(Role.USER).build());

        User bit = userRepository.save(User.builder()
                .email("bit@rollcrew.com").nickname("빛과그림자")
                .provider("kakao").providerId("dummy_002").role(Role.USER).build());

        User audio = userRepository.save(User.builder()
                .email("audio@rollcrew.com").nickname("오디오가이")
                .provider("kakao").providerId("dummy_003").role(Role.USER).build());

        User choi = userRepository.save(User.builder()
                .email("choi@rollcrew.com").nickname("제작사최")
                .provider("kakao").providerId("dummy_004").role(Role.USER).build());

        // ── 구인공고 ──────────────────────────────────────────────
        // 1. 김우석 작성 — tlt 검토중, 정감독 검토중
        JobPost job1 = jobPostRepository.save(JobPost.builder()
                .user(wooseok).category(JobCategory.FILMING)
                .title("[급구] 단편영화 B캠 오퍼레이터 모집")
                .content("소니 FX3 혹은 FX6 경험자 우대합니다.\n1회차 촬영이며 페이는 20만원입니다.\n장비는 렌탈 완료, 몸만 오시면 됩니다.\n\n일시: 2026년 5월 12일\n장소: 서울 마포구")
                .shootingDates("2026-05-12").status(PostStatus.OPEN).build());

        applyRepository.save(Apply.builder().jobPost(job1).applicant(tlt)
                .message("안녕하세요! FX6 4년차 오퍼레이터입니다.\n상업광고, 단편영화 등 다양한 현장 경험이 있습니다.\n포트폴리오 공유 원하시면 말씀해 주세요.")
                .status(ApplyStatus.PENDING).build());

        applyRepository.save(Apply.builder().jobPost(job1).applicant(jeong)
                .message("연출팀 출신이지만 B캠 경험 있습니다. 잘 부탁드립니다.")
                .status(ApplyStatus.PENDING).build());

        // 2. 김우석 작성 — tlt 수락, 빛과그림자 거절
        JobPost job2 = jobPostRepository.save(JobPost.builder()
                .user(wooseok).category(JobCategory.LIGHTING)
                .title("뮤직비디오 조명팀 모집 (1일)")
                .content("아이돌 뮤직비디오 촬영입니다.\n조명 경험 2년 이상 필수.\n페이 협의 가능합니다.")
                .shootingDates("2026-06-03").status(PostStatus.OPEN).build());

        applyRepository.save(Apply.builder().jobPost(job2).applicant(tlt)
                .message("조명팀 3년차입니다. 뮤직비디오 현장 경험 다수 보유하고 있습니다.")
                .status(ApplyStatus.ACCEPTED).build());

        applyRepository.save(Apply.builder().jobPost(job2).applicant(bit)
                .message("촬영팀인데 조명 보조 가능합니다.")
                .status(ApplyStatus.REJECTED).build());

        // 3. 김우석 작성 — 마감 처리된 공고
        JobPost job3 = jobPostRepository.save(JobPost.builder()
                .user(wooseok).category(JobCategory.DIRECTING)
                .title("단편 연출부 모집 — 마감")
                .content("이미 팀 구성이 완료된 공고입니다.\n지원은 불가합니다.")
                .shootingDates("2026-05-20").status(PostStatus.CLOSED).build());

        applyRepository.save(Apply.builder().jobPost(job3).applicant(audio)
                .message(null).status(ApplyStatus.ACCEPTED).build());

        // 4. tlt 작성 — 김우석이 지원 (검토중)
        JobPost job4 = jobPostRepository.save(JobPost.builder()
                .user(tlt).category(JobCategory.FILMING)
                .title("독립영화 메인 카메라 오퍼레이터 구합니다")
                .content("저예산 독립영화입니다.\n3일 촬영 예정이며 페이는 일 15만원입니다.\n포트폴리오 필수 첨부 부탁드립니다.\n\n촬영지: 경기 고양시")
                .shootingDates("2026-05-28 ~ 2026-05-30").status(PostStatus.OPEN).build());

        applyRepository.save(Apply.builder().jobPost(job4).applicant(wooseok)
                .message("안녕하세요. 독립영화 현장 경험 다수 있습니다.\n포트폴리오는 따로 공유 드리겠습니다.")
                .status(ApplyStatus.PENDING).build());

        // 5. tlt 작성 — 지원자 없음
        JobPost job5 = jobPostRepository.save(JobPost.builder()
                .user(tlt).category(JobCategory.ETC)
                .title("다큐멘터리 프로젝트 편집자 구합니다")
                .content("6개월 프리랜서 편집 작업입니다.\nPremiere Pro 숙련자 우대.\n재택 가능합니다.")
                .shootingDates("2026-07-01 ~ 2026-12-31").status(PostStatus.OPEN).build());

        // 6. 정감독 작성 — 지원자 없음 (둘 다 지원 가능)
        JobPost job6 = jobPostRepository.save(JobPost.builder()
                .user(jeong).category(JobCategory.DIRECTING)
                .title("단편영화 조연출 모집합니다")
                .content("신인 감독 졸업작품입니다.\n조연출 경험 없어도 열정 있으신 분 환영합니다.\n페이 없음, 크레딧 제공.")
                .shootingDates("2026-06-15 ~ 2026-06-16").status(PostStatus.OPEN).build());

        // 7. 빛과그림자 작성 — 촬영일 지난 공고 (OPEN 상태)
        JobPost job7 = jobPostRepository.save(JobPost.builder()
                .user(bit).category(JobCategory.FILMING)
                .title("웹드라마 촬영팀 — 지난 공고")
                .content("이미 촬영이 완료된 공고입니다.\n참고용으로 남겨둡니다.")
                .shootingDates("2026-03-10").status(PostStatus.OPEN).build());

        applyRepository.save(Apply.builder().jobPost(job7).applicant(wooseok)
                .message("지원합니다.").status(ApplyStatus.PENDING).build());

        // 8. 제작사최 작성 — 지원자 많은 케이스
        JobPost job8 = jobPostRepository.save(JobPost.builder()
                .user(choi).category(JobCategory.FILMING)
                .title("[페이 협의] 장편영화 촬영팀 전체 모집")
                .content("상업 장편영화 촬영팀 전원 모집합니다.\n경력자 우대, 페이 업계 기준 상회.\n\n포지션: 촬영감독, 포커스풀러, 로더, B캠 오퍼레이터\n촬영 기간: 약 3개월")
                .shootingDates("2026-08-01 ~ 2026-10-31").status(PostStatus.OPEN).build());

        applyRepository.save(Apply.builder().jobPost(job8).applicant(wooseok)
                .message("촬영감독 포지션 지원합니다. 장편 3편 경력 있습니다.")
                .status(ApplyStatus.PENDING).build());
        applyRepository.save(Apply.builder().jobPost(job8).applicant(tlt)
                .message("포커스풀러로 지원합니다.")
                .status(ApplyStatus.ACCEPTED).build());
        applyRepository.save(Apply.builder().jobPost(job8).applicant(jeong)
                .message("B캠 오퍼레이터 지원합니다. 잘 부탁드립니다.")
                .status(ApplyStatus.PENDING).build());
        applyRepository.save(Apply.builder().jobPost(job8).applicant(bit)
                .message("로더 포지션 지원합니다.")
                .status(ApplyStatus.REJECTED).build());
        applyRepository.save(Apply.builder().jobPost(job8).applicant(audio)
                .message(null).status(ApplyStatus.REJECTED).build());

        // ── 커뮤니티 ──────────────────────────────────────────────
        // 1. 김우석 글 — tlt 댓글 → 김우석 대댓글
        CommunityPost cp1 = communityPostRepository.save(CommunityPost.builder()
                .user(wooseok).communityCategory(CommunityCategory.GENERAL)
                .title("단편영화 현장 페이 기준이 어떻게 되나요?")
                .content("요즘 단편영화 현장에서 받을 수 있는 페이 기준이 궁금합니다.\n촬영팀 기준으로 일당 얼마가 적정선인지 경험자분들 의견 부탁드립니다.")
                .build());
        communityPostNicknameRepository.save(CommunityPostNickname.builder()
                .user(wooseok).communityPost(cp1).nickname("김우석").build());

        CommunityComment c1 = communityCommentRepository.save(CommunityComment.builder()
                .user(tlt).communityPost(cp1).parent(null)
                .content("저는 단편 기준 일당 10~15만원 선에서 받았어요. 규모에 따라 많이 다르더라고요.")
                .build());
        communityCommentRepository.save(CommunityComment.builder()
                .user(wooseok).communityPost(cp1).parent(c1)
                .content("감사합니다! 규모 기준으로 어느 정도면 그 이상을 기대해볼 수 있을까요?")
                .build());

        // 2. tlt 글 — 고발 카테고리 — 김우석, 정감독 댓글
        CommunityPost cp2 = communityPostRepository.save(CommunityPost.builder()
                .user(tlt).communityCategory(CommunityCategory.ACCUSATION)
                .title("페이 미지급 제작사 공유합니다 (경고)")
                .content("○○프로덕션에서 촬영 후 3개월째 페이를 받지 못하고 있습니다.\n같은 피해 보신 분 계시면 댓글 달아주세요. 법적 대응 준비 중입니다.")
                .build());
        communityPostNicknameRepository.save(CommunityPostNickname.builder()
                .user(tlt).communityPost(cp2).nickname("tlt****").build());

        communityCommentRepository.save(CommunityComment.builder()
                .user(wooseok).communityPost(cp2).parent(null)
                .content("저도 비슷한 경험 있습니다. 꼭 해결되길 바랍니다. 용기 있게 올려주셔서 감사해요.")
                .build());
        communityCommentRepository.save(CommunityComment.builder()
                .user(jeong).communityPost(cp2).parent(null)
                .content("저도 이 업체 들어본 적 있어요. 업계에서 소문난 곳입니다.")
                .build());

        // 3. 정감독 글 — 댓글 없음
        CommunityPost cp3 = communityPostRepository.save(CommunityPost.builder()
                .user(jeong).communityCategory(CommunityCategory.GENERAL)
                .title("Sony FX3 vs FX6, 단편 촬영 추천 기종은?")
                .content("이번 프로젝트에서 어떤 카메라를 렌탈할지 고민 중입니다.\nFX3가 가볍고 가격도 저렴한데, FX6의 AF가 더 낫다는 얘기도 있더라고요.\n사용해보신 분들 의견 부탁드립니다.")
                .build());
        communityPostNicknameRepository.save(CommunityPostNickname.builder()
                .user(jeong).communityPost(cp3).nickname("정감독").build());

        // 4. 빛과그림자 글 — 댓글 3개
        CommunityPost cp4 = communityPostRepository.save(CommunityPost.builder()
                .user(bit).communityCategory(CommunityCategory.GENERAL)
                .title("첫 장편 현장 후기 — 3개월이 이렇게 빠를 줄은")
                .content("드디어 장편 현장이 끝났습니다.\n체력적으로 너무 힘들었지만 그만큼 배운 것도 많았어요.\n아직도 컷 소리가 귀에 맴도는 느낌입니다 ㅋㅋ\n다들 현장에서 체력 관리 어떻게 하세요?")
                .build());
        communityPostNicknameRepository.save(CommunityPostNickname.builder()
                .user(bit).communityPost(cp4).nickname("빛과그림자").build());

        communityCommentRepository.save(CommunityComment.builder()
                .user(wooseok).communityPost(cp4).parent(null)
                .content("고생 많으셨어요! 장편은 정말 체력전이죠. 저는 현장 끝나고 일주일은 그냥 쉬었어요.")
                .build());
        communityCommentRepository.save(CommunityComment.builder()
                .user(tlt).communityPost(cp4).parent(null)
                .content("크레딧 올라가는 거 보면 그 피로가 다 날아가죠 ㅎㅎ 축하드려요!")
                .build());
        communityCommentRepository.save(CommunityComment.builder()
                .user(audio).communityPost(cp4).parent(null)
                .content("사운드팀도 비슷합니다... 귀에 화이트 노이즈가 달라붙어요 ㅋㅋ")
                .build());

        // 5. 오디오가이 글 — 소프트딜리트 댓글 포함
        CommunityPost cp5 = communityPostRepository.save(CommunityPost.builder()
                .user(audio).communityCategory(CommunityCategory.GENERAL)
                .title("붐 오퍼레이터 구인 좋은 방법 있을까요?")
                .content("이번 프로젝트에서 붐 오퍼레이터를 못 구하고 있습니다.\n롤크루 말고 다른 채널도 써보신 분 있나요?")
                .build());
        communityPostNicknameRepository.save(CommunityPostNickname.builder()
                .user(audio).communityPost(cp5).nickname("오디오가이").build());

        CommunityComment deletedComment = communityCommentRepository.save(CommunityComment.builder()
                .user(jeong).communityPost(cp5).parent(null)
                .content("삭제된 댓글입니다.")
                .build());
        deletedComment.softDelete();
        communityCommentRepository.save(deletedComment);

        communityCommentRepository.save(CommunityComment.builder()
                .user(bit).communityPost(cp5).parent(null)
                .content("페이스북 영화인 그룹에도 올려보세요. 거기서 구한 적 있어요.")
                .build());

        // 6. 김우석 글 — 댓글 많은 케이스
        CommunityPost cp6 = communityPostRepository.save(CommunityPost.builder()
                .user(wooseok).communityCategory(CommunityCategory.GENERAL)
                .title("요즘 신인 감독들 단편 페이 어떻게 생각하세요?")
                .content("무페이 단편이 너무 많아진 것 같아서요.\n경험 쌓는 것도 중요하지만 적정 페이는 있어야 하지 않나 싶은데, 다들 어떻게 생각하세요?")
                .build());
        communityPostNicknameRepository.save(CommunityPostNickname.builder()
                .user(wooseok).communityPost(cp6).nickname("김우석").build());

        communityCommentRepository.save(CommunityComment.builder()
                .user(tlt).communityPost(cp6).parent(null)
                .content("완전 공감이요. 최소 교통비 + 식비라도 줘야 한다고 봐요.")
                .build());
        communityCommentRepository.save(CommunityComment.builder()
                .user(jeong).communityPost(cp6).parent(null)
                .content("근데 학생 졸업작품은 현실적으로 어렵기도 하죠... 애매한 것 같아요.")
                .build());
        communityCommentRepository.save(CommunityComment.builder()
                .user(bit).communityPost(cp6).parent(null)
                .content("무페이면 크레딧이라도 제대로 챙겨줘야 한다고 생각해요.")
                .build());
        communityCommentRepository.save(CommunityComment.builder()
                .user(audio).communityPost(cp6).parent(null)
                .content("저는 무페이 단편은 안 갑니다. 업계 전체적으로 기준이 생겨야 해요.")
                .build());
        communityCommentRepository.save(CommunityComment.builder()
                .user(choi).communityPost(cp6).parent(null)
                .content("제작사 입장에서는 저예산의 한계가 있긴 한데, 그 말이 면죄부는 아니죠.")
                .build());

        // ── 알림 ──────────────────────────────────────────────────
        // 김우석 수신 — 미읽음 2개, 읽음 1개
        notificationRepository.save(Notification.builder()
                .receiver(wooseok).type(NotificationType.JOB_APPLY)
                .message("tlt****님이 지원했습니다")
                .referenceId(job1.getId()).isRead(false).build());

        notificationRepository.save(Notification.builder()
                .receiver(wooseok).type(NotificationType.JOB_APPLY)
                .message("정감독님이 지원했습니다")
                .referenceId(job1.getId()).isRead(false).build());

        notificationRepository.save(Notification.builder()
                .receiver(wooseok).type(NotificationType.COMMUNITY_COMMENT)
                .message("페이 기준 게시글에 새 댓글이 달렸습니다")
                .referenceId(cp1.getId()).isRead(true).build());

        // tlt 수신 — 미읽음 2개
        notificationRepository.save(Notification.builder()
                .receiver(tlt).type(NotificationType.JOB_ACCEPTED)
                .message("뮤직비디오 조명팀 모집 (1일) 지원이 수락됐습니다")
                .referenceId(job2.getId()).isRead(false).build());

        notificationRepository.save(Notification.builder()
                .receiver(tlt).type(NotificationType.COMMUNITY_COMMENT)
                .message("페이 미지급 게시글에 새 댓글이 달렸습니다")
                .referenceId(cp2.getId()).isRead(false).build());
    }
}
