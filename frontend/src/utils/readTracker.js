// 읽은 게시글 localStorage 추적
const KEYS = {
  community: 'read_community',
  job: 'read_job',
};

const getSet = (type) => {
  try {
    return new Set(JSON.parse(localStorage.getItem(KEYS[type]) || '[]'));
  } catch {
    return new Set();
  }
};

const saveSet = (type, set) => {
  // 최대 500개까지만 보관 (오래된 것 자동 제거)
  const arr = [...set];
  if (arr.length > 500) arr.splice(0, arr.length - 500);
  localStorage.setItem(KEYS[type], JSON.stringify(arr));
};

export const markPostRead = (type, id) => {
  const set = getSet(type);
  set.add(String(id));
  saveSet(type, set);
};

export const isPostRead = (type, id) => {
  return getSet(type).has(String(id));
};
