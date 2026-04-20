package com.rollcrew.rollcrew.infra;

import com.rollcrew.rollcrew.domain.community.entity.CommunityCategory;
import com.rollcrew.rollcrew.domain.community.entity.CommunityPost;
import com.rollcrew.rollcrew.domain.community.entity.CommunityPostNickname;
import com.rollcrew.rollcrew.domain.community.repository.CommunityPostNicknameRepository;
import com.rollcrew.rollcrew.domain.community.repository.CommunityPostRepository;
import com.rollcrew.rollcrew.domain.job.entity.JobCategory;
import com.rollcrew.rollcrew.domain.job.entity.JobPost;
import com.rollcrew.rollcrew.domain.job.entity.PostStatus;
import com.rollcrew.rollcrew.domain.job.repository.JobPostRepository;
import com.rollcrew.rollcrew.domain.user.entity.User;
import com.rollcrew.rollcrew.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Profile("local")
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final CommunityPostRepository communityPostRepository;
    private final CommunityPostNicknameRepository communityPostNicknameRepository;
    private final JobPostRepository jobPostRepository;

    @Override
    public void run(ApplicationArguments args) throws Exception {

        if (userRepository.count() > 0) {
            return;
        }

        // 유저 세팅 (다양한 작성자를 위해 4명 세팅)
        User u1 = userRepository.save(User.builder().email("kakao_4850912176@rollcrew.com").nickname("김우석").provider("kakao").providerId("4850912176").build());
        User u2 = userRepository.save(User.builder().email("director_lee@gmail.com").nickname("정감독").provider("kakao").providerId("dir123").build());
        User u3 = userRepository.save(User.builder().email("lighting_pro@gmail.com").nickname("빛과그림자").provider("kakao").providerId("ligh1").build());
        User u4 = userRepository.save(User.builder().email("boom_mic@gmail.com").nickname("오디오가이").provider("kakao").providerId("audio1").build());
        User[] users = {u1, u2, u3, u4};

        // ------------------------- 커뮤니티 하드코딩 데이터 ------------------------- //
        String[][] commData = {
            {"GENERAL", "다들 식대는 페이에 포함하시나요?", "보통 1일 촬영에 식대 별도로 청구하시나요 아니면 페이에 포함해서 부르시나요? 영수증 처리하기가 너무 귀찮네요."},
            {"ACCUSATION", "[고발] XX프로덕션 임금 체불 3개월째입니다", "페이 안 들어온 지 3개월이 다 되어갑니다. 전화도 안 받고 잠수 탔습니다. 다들 조심하세요. 현장 분위기도 최악이었습니다."},
            {"GENERAL", "소니 FX6 여름 야외촬영 발열 질문", "이번에 장비를 FX3에서 FX6으로 넘어가려 하는데, 여름 한낮 촬영 시 발열 컷오프 문제는 괜찮은지 실사용자분들 후기 궁금합니다."},
            {"GENERAL", "독립영화 페이 안 받고 뛰어보는거 어떨까요", "아직 경험이 많이 없어서 포트폴리오 목적으로 열정페이라도 참여해볼까 하는데 선배님들 생각은 어떠신가요?"},
            {"GENERAL", "막내 때 제일 힘들었던 썰 풀어봅시다", "저는 12월 칠흑같은 겨울밤 산속에서 조명 스탠드 양손에 5개 들고 3시간 등산했던 기억이 나네요.. 다들 어떠신가요?"},
            {"GENERAL", "입문용 C스탠드 브랜드 추천 부탁드립니다", "아벤져스 풀세트 맞추기엔 예산이 딸려서 가성비 좋은 브랜드 추천 좀 부탁드립니다. 쿠포 많이들 쓰시나요?"},
            {"ACCUSATION", "[제보] 프리랜서 계약서 안 쓰고 촬영 불렀던 OOO 감독", "현장 도착했더니 원래 구두로 말했던 11시간 촬영이 아니라 18시간을 찍고 밤샜습니다. 야간수당 당연히 못 받았고요."},
            {"GENERAL", "요즘은 확실히 LED 조명이 대세인가요", "HMI는 렌탈샵 아니면 사실상 보기 힘들어진 것 같네요. 색조명도 다 LED로 가니까 테이핑 할 일도 많이 줄었고요."},
            {"GENERAL", "다빈치 리졸브 vs 프리미어 프로", "색보정 말고 단순 컷편집용으로도 다빈치가 요즘 대세인가요? 갈아탈까 고민 중입니다."},
            {"GENERAL", "차량 촬영 시 흡착판 질문", "본네트에 흡착판 달아서 샷건 마이크랑 액션캠 달려고 하는데 도로 주행 중에 떨어질까봐 너무 무섭네요. 안전장치 어떤식으로 하시나요?"},
            {"ACCUSATION", "현장에서 쌍욕하는 OOO 촬영감독", "아직도 옛날 90년대 현장인 줄 알고 스태프들한테 쌍욕과 인신공격 박는 사람 아직도 있네요."},
            {"GENERAL", "오늘 촬영장 케이터링 대박이었습니다", "커피차는 기본이고 점심 뷔페에 저녁엔 소고기 구워주네요. 제작사 자본력이 최고인 것 같습니다."},
            {"GENERAL", "짐벌 오퍼레이터 페이 너무 후려치는 것 같아요", "장비값만 800만원인데 하루 20만원에 와달라는 데가 있네요. 이런 곳은 걍 걸러야겠죠?"},
            {"GENERAL", "다들 촬영 전날 꿀잠 자는 팁 있나요", "콜타임이 새벽 4시면 전날 저녁 8시부터 누워있어도 잠이 안 오네요. 밤샘의 연속입니다."},
            {"GENERAL", "포트폴리오 영상은 보통 길이 어느정도가 적당한가요?", "쇼릴 만들고 있는데 1분이 낫나요 아니면 3분 정도 길게 뽑는게 낫나요?"},
            {"GENERAL", "데이터 매니저 알바 해보신 분 계신가요?", "내일 땜빵으로 백업 오퍼레이터 가는데 카드리더기 3개 물려서 맥북에서 복사만 잘 치면 되는건가요?"},
            {"GENERAL", "프리랜서 종소세 신고 기간이 다가오네요...", "올해는 번 돈 보다 장비 산 돈이 더 많아서 걱정입니다. 세무사 끼고 하시는 분?"},
            {"ACCUSATION", "페이 지급일 지났는데 '내일 줄게'만 5번 반복", "이런 경우 내용증명 보내야 하나요? 잔금 30만원땜에 스트레스 엄청 받네요."},
            {"GENERAL", "날씨 요정은 실존합니다", "한 달 내내 비 오다가 저희가 야외 촬영하는 딱 3일만 기적처럼 날씨 맑네요 ㅋㅋㅋ 대박!"},
            {"GENERAL", "현장에서 제일 듣기 좋은 타각 소리", "슬레이트 치고 '액션!' 하기 직전의 그 정적이 가끔은 짜릿한 것 같습니다."},
            {"GENERAL", "아이폰 15 Pro 로 단편영화 찍어보신 분?", "로그 씌우고 찍으면 시네마 카메라 안 부럽다는 말이 있던데 진짜 쓸만한가요?"},
            {"GENERAL", "조명팀 막내가 실수로 조명 터트렸는데", "그냥 웃고 넘어가시는 조감독님 보고 감동받았습니다. 역시 인성이 중요해요."},
            {"ACCUSATION", "'학생영화니까 이정도 퀄리티로 가죠'라는 발언", "학생영화라고 대충 찍자는 식의 스태프를 겪었습니다. 열정이 꺾이네요."},
            {"GENERAL", "보조배터리 20000mAh 기내 반입 몇개까지 되나요?", "해외 로케 가는데 V마운트랑 보배 합쳐서 수량 제한이 있다던데 규정 아시는 분?"},
            {"GENERAL", "마이크 붐폴 들 때 팔 안아프게 드는 방법", "4시간 연속으로 들었더니 어깨가 뽑힐 것 같습니다. 꿀팁 전수 받습니다."},
            {"GENERAL", "렌탈샵 추천 부탁드려요", "논현이나 신사 쪽에서 알렉사 미니 LF 재고 많고 친절한 렌탈샵 어디가 좋을까요?"},
            {"GENERAL", "슬레이트의 중요성을 오늘 깨달았습니다", "오디오 싱크가 통째로 밀렸는데 박수 안 쳤으면 파일 다 날릴 뻔 했네요."},
            {"GENERAL", "로케이션 매니저라는 직업 어떨까요", "전국 방방곡곡 돌아다니는거 좋아해서 장소 섭외쪽으로 빠져볼까 고민중입니다."},
            {"GENERAL", "이번에 개봉한 OOO 영화 색감이 너무 예쁘네요", "어떤 카메라로 찍었는지 아시는 분 있나요? 레드 느낌이 나던데."},
            {"ACCUSATION", "광고주 갑질 레전드 썰", "A안으로 확정 지어놓고 편집 끝나니까 갑자기 B안으로 다시 찍어오라네요. 수정 비용도 안 주면서."}
        };

        for (int i = 0; i < commData.length; i++) {
            // 딱 15개는 로그인 유저(u1)에게 몰아주어 내 게시글 페이징 테스트가 가능하도록 설정
            // 나머지 15개는 다른 유저(u2, u3, u4)에게 배배분하여 메인 홈 페이징 테스트가 가능하도록 설정
            User author = (i < 15) ? u1 : users[(i % 3) + 1];
            String catStr = commData[i][0];
            String title = commData[i][1];
            String content = commData[i][2];
            
            CommunityPost post = CommunityPost.builder()
                    .user(author)
                    .title(title)
                    .content(content)
                    .communityCategory(CommunityCategory.valueOf(catStr))
                    .build();
            communityPostRepository.save(post);

            communityPostNicknameRepository.save(CommunityPostNickname.builder()
                    .user(author)
                    .communityPost(post)
                    .nickname("영상인" + (i + 192))
                    .build());
        }

        // ------------------------- 구인구직 하드코딩 데이터 ------------------------- //
        String[][] jobData = {
            {"FILMING", "[급구] 내일 상암동 단편영화 B캠 오퍼레이터(소니 FX3) 모십니다", "1회차 촬영이며 페이는 20만원입니다. 장비는 렌탈해두었으니 몸만 오시면 됩니다.", "2026-05-12"},
            {"LIGHTING", "반려견 용품 바이럴 광고 조명 스태프 1명 구합니다", "호리존 스튜디오에서 진행되며 간단한 지속광 셋업 위주라 초보도 가능합니다.", "2026-05-15, 2026-05-16"},
            {"DIRECTING", "단편영화 '여름의 끝' 연출팀/슬레이트 쳐주실 분", "학생 단편이라 페이가 없어 소정의 거마비만(교통비+식대) 지급해드립니다. 열정 배우실 분 환영해요.", "2026-06-01 ~ 2026-06-03"},
            {"ETC", "뮤직비디오 프로덕션에서 소품/미술 세팅 도와주실 분 급구", "아티스트 M/V 현장입니다. 무대 세팅 및 철거 위주의 업무라 체력이 좋으신 남성분 우대합니다.", "2026-05-20"},
            {"FILMING", "유튜브 웹예능 메인 촬영감독님 찾습니다 (고정직)", "매주 화/수 촬영입니다. 예능 스타일 짐벌 무빙 자신 있으신 분 우대합니다. (회당 40)", "2026-06-01 ~ 2026-12-31"},
            {"LIGHTING", "[야외] 홍대 버스킹 촬영 조명 어시스턴트 구인", "저녁 7시부터 밤 11시까지 간단히 스탠드만 잡아주시면 됩니다. 12만원 바로 이체해드립니다.", "2026-05-18"},
            {"DIRECTING", "독립영화 '안녕, 안녕' 조감독님을 모십니다", "15회차 장편 독립영화이며 프리프로덕션부터 함께하실 수 있는 경력자 조감독님을 찾습니다.", "2026-07-01 ~ 2026-08-15"},
            {"ETC", "동시녹음(붐오퍼레이터) 기사님 섭외합니다", "실내 인터뷰 2인 촬영입니다. 장비 포함하여 반이틀(6시간) 페이 제안 부탁드립니다.", "2026-05-22, 2026-05-23"},
            {"FILMING", "드론(매빅3 이상) 항공 촬영 가능하신 분", "제주도 로케이션 풍경 소스 및 자동차 팔로우 샷 있습니다. 항공촬영 자격증 보유자 우대합니다.", "2026-05-28 ~ 2026-05-30"},
            {"LIGHTING", "광고 현장 조명팀 막내(그립/선정리) 구합니다", "무거운 장비가 꽤 있어서 체력 좋고 현장 눈치 빠르신 분이 필요합니다! (페이 15+식대)", "2026-05-14"},
            {"DIRECTING", "웹드라마 스크립터(기록) 긴급 모십니다", "내일 모레 당장 촬영인데 기존 스크립터님이 아프셔서 펑크났습니다. 경력없어도 꼼꼼하시면 됩니다.", "2026-05-11, 2026-05-12, 2026-05-13"},
            {"ETC", "데이터 매니저(백업/클린업) 알바 하실 분", "맥북 스튜디오 렌탈해뒀습니다. ShotPut Pro 다뤄보신 분이면 좋겠습니다.", "2026-05-15"},
            {"FILMING", "[페이협의] 기업 홍보영상 촬영감독 메인", "레퍼런스가 매우 뚜렷한 영상입니다. 짐벌 포함 포트폴리오 메일로 보내주세요.", "2026-06-05 ~ 2026-06-06"},
            {"LIGHTING", "제품 지면 광고 조명감독님 모심", "누끼 컷 위주의 화장품 제품 촬영입니다. 깔끔한 라이팅 레퍼런스 있으신 분 선호합니다.", "2026-05-25"},
            {"DIRECTING", "공공기관 켐페인 콘티/연출 기획 가능하신 분", "촬영 전 기획 단계만 프리랜서로 맡아주실 분을 찾습니다. 재택 워크 가능합니다.", "2026-05-10 ~ 2026-05-20"},
            {"ETC", "분장/메이크업 실장님 하루 모십니다", "배우 2명 네츄럴 메이크업 1회차 수정 위주입니다.", "2026-05-19"},
            {"FILMING", "웨딩 DVD / 본식 스냅 촬영 메인(프리랜서)", "토/일 고정 배정 가능하신 분. 소니 바디 보유자 선호합니다.", "2026-06-06, 2026-06-07"},
            {"LIGHTING", "뮤지컬 실황 중계 핀조명 투입 스태프", "객석 2층 핀조명 위치에서 3시간 정도 오퍼레이팅 해주시면 됩니다.", "2026-05-29"},
            {"DIRECTING", "예능 편집 및 종편 연출해주실 PD님", "컷편집은 외부에서 하고 자막/이펙트/종합편집 마무리만 맡아주시면 됩니다.", "2026-06-01 ~ 2026-06-30"},
            {"ETC", "밥차(케이터링) 업체 섭외합니다!!", "150명 규모 스태프 및 보조출연자 식사 3식 제공 가능한 업체 댓글이나 연락 부탁드려요.", "2026-07-10 ~ 2026-07-15"},
            {"FILMING", "짐벌(로닌) 오퍼레이터 하루 뛰실 분 (FX6)", "차량 액션신 추격 짐벌 무빙이 좀 거칩니다. 페이는 섭섭지 않게 맞춰드립니다.", "2026-05-17"},
            {"LIGHTING", "단편영화 HMI 조명 세팅 경험자분 모십니다", "밤씬에 데이라이트 달빛 쳐주실 라이팅 디자인 구상 가능하신 감독님 찾습니다.", "2026-05-26, 2026-05-27"},
            {"DIRECTING", "학생영화 스토리보드(콘티) 작가님 구인", "졸업작품이라 예산이 적어 10만원으로 장당 단가 처 드릴 수 있는 분만 죄송합니다.", "2026-05-13 ~ 2026-05-15"},
            {"ETC", "도로 통제 및 라인 매니저(발전차 보조)", "현장 통제 위주입니다. 지나가는 시민분들께 친절하게 응대 가능하신 분!", "2026-05-21"},
            {"FILMING", "수중 촬영(하우징 보유자) 구인", "다이빙 풀에서 2시간 가량 인물 잠수 씬 찍습니다. 안전요원은 대기 중입니다.", "2026-06-08"},
            {"LIGHTING", "단순히 반사판만 하루종일 들어주실 알바 구함", "인터뷰 촬영인데 야외라 은박/금박 반사판 각도만 잘 맞춰서 잡아주시면 됩니다.", "2026-05-24"},
            {"DIRECTING", "배우 캐스팅 디렉터 단기 모집", "주/조연 말고 보조출연 30명 구인 및 당일 인원관리/출장 관리를 맡아주실 분", "2026-06-10"},
            {"ETC", "세트장 도색/벽채 작업 무대미술 어씨", "스튜디오 안에 목공 벽 세우고 페인트 칠할 보조인력 2명 구합니다. 작업복 지참 필수.", "2026-05-31"},
            {"FILMING", "스포츠 유튜브 축구캠(망원 렌즈) 촬영", "축구 경기장 풀코트 사이드에서 선수들 팔로우캠 찍어주시면 됩니다. 망원 필참", "2026-05-22"},
            {"LIGHTING", "[페이 50만] 밤샘 뮤비 조명 총괄 감독 급구", "기존 감독님 코로나 확진으로 긴급 구인합니다. 시안과 조명장비 리스트는 짜여있습니다.", "2026-05-13, 2026-05-14"}
        };

        for (int i = 0; i < jobData.length; i++) {
            // 딱 15개는 로그인 유저(u1)에게 몰아주어 내 게시글 페이징 테스트가 가능하도록 설정
            // 나머지 15개는 다른 유저(u2, u3, u4)에게 배배분하여 메인 홈 페이징 테스트가 가능하도록 설정
            User author = (i < 15) ? u1 : users[(i % 3) + 1];
            String catStr = jobData[i][0];
            String title = jobData[i][1];
            String content = jobData[i][2];
            String dates = jobData[i][3];
            
            // 앞부분 몇 개는 마감(CLOSED) 상태로 세팅
            PostStatus status = (i == 1 || i == 4 || i == 9) ? PostStatus.CLOSED : PostStatus.OPEN;

            JobPost job = JobPost.builder()
                    .user(author)
                    .title(title)
                    .content(content)
                    .category(JobCategory.valueOf(catStr))
                    .shootingDates(dates)
                    .status(status)
                    .build();
            jobPostRepository.save(job);
        }
    }
}