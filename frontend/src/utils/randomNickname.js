// 랜덤 닉네임 생성기 — 영상 업계 도메인 컨셉
const ADJECTIVES = [
  '날카로운', '예리한', '섬세한', '감각있는', '빠른',
  '조용한', '차분한', '날렵한', '정확한', '냉철한',
  '대담한', '신중한', '열정적인', '꼼꼼한', '노련한',
  '창의적인', '독창적인', '기민한', '능숙한', '집중하는',
  '과감한', '묵직한', '서늘한', '깔끔한', '단단한',
];

const NOUNS = [
  // 현장 전문 용어
  'B캠', '포커스풀러', '슬레이트', '붐맨', 'DIT',
  '가퍼', '그리퍼', '스크립터', '스테디캠', '클래퍼',
  // 일반 영상 단어
  '감독', '렌즈', '필름', '프레임', '앵글',
  '컷', '씬', '샷', '조명', '카메라',
  '모니터', '뷰파인더', '삼각대', '짐벌', '돌리',
];

const EMOJIS = ['🎬', '🎥', '🎞', '📽', '🎦', '💡', '🎙', '📷', '🔦', '🎚'];

const HISTORY_KEY = 'rc_nickname_history';
const MAX_HISTORY = 15;

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch {
    return [];
  }
}

function addToHistory(nickname) {
  const history = getHistory();
  const updated = [nickname, ...history].slice(0, MAX_HISTORY);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

export function generateRandomNickname() {
  const history = getHistory();
  const maxAttempts = ADJECTIVES.length * NOUNS.length * EMOJIS.length;

  let nickname;
  let attempts = 0;

  do {
    const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    nickname = `${adj} ${noun} ${emoji}`;
    attempts++;
  } while (history.includes(nickname) && attempts < maxAttempts);

  addToHistory(nickname);
  return nickname;
}
