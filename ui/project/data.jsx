// Mock data — 실제 rollcrew 백엔드 DTO 구조 기반
// CommunityPostListResponse: title, nickname, createdAt, likeCount, dislikeCount
// CommunityPostResponse: title, nickname, content, imageURL[], createdAt, likeCount, dislikeCount
// CommentResponse: id, content, nickname, createdAt, replies[], isDeleted, likeCount, dislikeCount
// JobPostingResponse: id, userId, title, content, category(FILMING|LIGHTING|ETC), status(OPEN|CLOSED), shootingDates, createdAt

// ── 커뮤니티 카테고리 (enum CommunityCategory)
const COMMUNITY_CATEGORIES = [
  { id: 'ALL',        label: '전체',    code: 'ALL',  hue: 300 },
  { id: 'GENERAL',    label: '일반',    code: 'GEN',  hue: 210 },
  { id: 'ACCUSATION', label: '제보/고발', code: 'ACC',  hue: 15  },
];

// ── 구인구직 카테고리 (enum JobCategory)
const JOB_CATEGORIES = [
  { id: 'FILMING',  label: '촬영',  code: 'CAM', hue: 300 },
  { id: 'LIGHTING', label: '조명',  code: 'LIT', hue: 40  },
  { id: 'ETC',      label: '기타',  code: 'ETC', hue: 155 },
];

// ── 커뮤니티 게시글 목록 (CommunityPostListResponse × 피드)
const COMMUNITY_POSTS = [
  {
    id: 1,
    communityCategory: 'ACCUSATION',
    title: '○○드라마 현장, 스태프한테 소리 지르는 감독님 있음',
    nickname: '졸린 망고',
    createdAt: '2026-04-19T14:21:00',
    likeCount: 87, dislikeCount: 4,
    commentCount: 31,
    content: `어제 촬영 현장에서 있었던 일인데요. 이름은 못 밝히지만 꽤 유명한 감독 분이 스태프한테 공개적으로 소리 지르는 걸 목격했습니다.\n\n주변에 다른 스태프들도 다 보는 상황에서… 진짜 너무했다고 생각합니다. 이런 거 어디다 신고할 수 있나요?\n\n다들 이런 경험 있으신가요? 업계에서 이런 일이 아직도 흔한 건지 궁금합니다.`,
    imageURL: [],
    hot: true,
  },
  {
    id: 2,
    communityCategory: 'GENERAL',
    title: '조명 입문용 장비 추천해주세요 (예산 50만원)',
    nickname: '통통한 다람쥐',
    createdAt: '2026-04-19T12:05:00',
    likeCount: 43, dislikeCount: 1,
    commentCount: 22,
    content: '유튜브 채널 시작하려고 하는데 조명 뭐 살지 모르겠어요. 예산은 50만원이고 실내 촬영 위주입니다.',
    imageURL: [],
  },
  {
    id: 3,
    communityCategory: 'GENERAL',
    title: '촬영 현장 썰 풀어봄 — 진짜 황당했던 날',
    nickname: '날카로운 뱀장어',
    createdAt: '2026-04-19T09:33:00',
    likeCount: 156, dislikeCount: 2,
    commentCount: 44,
    content: '오늘 촬영 현장에서 진짜 황당한 일이 있었는데 들어봐요. FX6 배터리를 누가 다 써놓고 충전 안 해놔서...',
    imageURL: ['STILL · BTS'],
    hot: true,
  },
  {
    id: 4,
    communityCategory: 'ACCUSATION',
    title: '제작사 페이 미지급 경험 공유 — 법적 대응 가능한가요?',
    nickname: '배고픈 수달',
    createdAt: '2026-04-18T22:10:00',
    likeCount: 204, dislikeCount: 6,
    commentCount: 67,
    content: '3개월째 밀린 페이... 내용증명 보내고 싶은데 같이 연대하실 분 있나요?',
    imageURL: [],
  },
  {
    id: 5,
    communityCategory: 'GENERAL',
    title: '밤샘 촬영 끝나고 먹는 새벽 라면의 맛 ㅋㅋ',
    nickname: '느린 고래',
    createdAt: '2026-04-18T18:45:00',
    likeCount: 312, dislikeCount: 0,
    commentCount: 28,
    content: '오늘도 새벽 4시에 현장 끝. 다들 건강 챙기세요.',
    imageURL: ['BTS · NIGHT SHOOT'],
  },
];

// ── 구인구직 게시글 (JobPostingResponse)
const JOB_POSTS = [
  {
    id: 101,
    userId: 3,
    category: 'FILMING',
    title: '[급구] 4/25 단편 드라마 B캠 오퍼레이터',
    content: '강원도 평창 1박 2일, 페이 35/day. FX6 경험자 우대. 숙식 제공 · 교통비 별도.',
    status: 'OPEN',
    shootingDates: '2026-04-25',
    createdAt: '2026-04-19T14:30:00',
  },
  {
    id: 102,
    userId: 5,
    category: 'LIGHTING',
    title: '[장기] OTT 시리즈 조명팀 세컨드~퍼스트 모집',
    content: '6월 크랭크인 12부작. 조명 세컨드~퍼스트 급 3명. 포폴 DM 주세요.',
    status: 'OPEN',
    shootingDates: '2026-06-01 ~ 2026-10-31',
    createdAt: '2026-04-19T10:00:00',
  },
  {
    id: 103,
    userId: 7,
    category: 'ETC',
    title: 'CF 촬영 헤어/메이크업 아티스트 구합니다',
    content: '4/28 서울 스튜디오 1일 촬영. 페이 협의.',
    status: 'OPEN',
    shootingDates: '2026-04-28',
    createdAt: '2026-04-18T16:20:00',
  },
  {
    id: 104,
    userId: 2,
    category: 'FILMING',
    title: '단편 영화 촬영감독 모집 (저예산 · 작품성)',
    content: '5월 크랭크인. 저예산이지만 시나리오 자신 있습니다. 포폴 위주 검토.',
    status: 'CLOSED',
    shootingDates: '2026-05-10 ~ 2026-05-15',
    createdAt: '2026-04-17T09:00:00',
  },
];

// ── 댓글 (CommentResponse, 대댓글 포함)
const POST_COMMENTS = {
  1: [
    {
      id: 1, nickname: '빠른 코끼리', createdAt: '2026-04-19T14:40:00',
      content: '저도 비슷한 경험 있어요. 업계 특성상 참는 분위기가 너무 강한 것 같아요.',
      isDeleted: false, likeCount: 18, dislikeCount: 0,
      replies: [
        { id: 5, nickname: '졸린 망고', createdAt: '2026-04-19T14:43:00',
          content: '맞아요, 그게 제일 힘든 부분이에요. 같이 목소리 내야 할 것 같아요.',
          isDeleted: false, likeCount: 9, dislikeCount: 0, replies: [] },
      ],
    },
    {
      id: 2, nickname: '조용한 여우', createdAt: '2026-04-19T14:55:00',
      content: '근로기준법 위반 소지 있습니다. 고용노동부 앱으로 신고 가능해요.',
      isDeleted: false, likeCount: 32, dislikeCount: 1, replies: [],
    },
    {
      id: 3, nickname: '삭제된 유저', createdAt: '2026-04-19T15:01:00',
      content: null, isDeleted: true, likeCount: 0, dislikeCount: 0, replies: [],
    },
    {
      id: 4, nickname: '굵은 소나무', createdAt: '2026-04-19T15:10:00',
      content: '솔직히 많이 나아지긴 했는데 아직도 이런 분들 있죠… 근데 제발 실명 공개해줘요.',
      isDeleted: false, likeCount: 7, dislikeCount: 3, replies: [],
    },
  ],
};

Object.assign(window, {
  COMMUNITY_CATEGORIES, JOB_CATEGORIES, COMMUNITY_POSTS, JOB_POSTS, POST_COMMENTS,
  // 하위호환 alias
  CATEGORIES: COMMUNITY_CATEGORIES,
  POSTS: COMMUNITY_POSTS,
  COMMENTS: (POST_COMMENTS[1] || []),
});
