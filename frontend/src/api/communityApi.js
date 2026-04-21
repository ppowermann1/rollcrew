// 커뮤니티 게시글 API
import client from './client';

/**
 * 게시글 목록 조회 (페이지네이션)
 * @param {number} page
 * @param {number} size
 * @param {'GENERAL'|'ACCUSATION'|null} communityCategory - null이면 전체
 */
export const getPosts = async (page = 0, size = 20, communityCategory = null) => {
  const params = { page, size };
  if (communityCategory) params.communityCategory = communityCategory;
  const res = await client.get('/api/community/posts', { params });
  return res.data.data;
};

/**
 * 게시글 상세 조회
 * 백엔드 응답: CommunityPostResponse { id, communityCategory, title, nickname, content, imageURL[], createdAt, likeCount, dislikeCount }
 */
export const getPost = async (postId) => {
  const res = await client.get(`/api/community/posts/${postId}`);
  return res.data.data;
};

/**
 * 게시글 작성
 * body: { title, content, communityCategory(GENERAL|ACCUSATION), nickname }
 */
export const createPost = async (data) => {
  const res = await client.post('/api/community/posts', data);
  return res.data.data;
};

/**
 * 게시글 좋아요/싫어요 토글
 * @param {number} postId
 * @param {'LIKE'|'DISLIKE'} likeType
 */
export const togglePostLike = async (postId, likeType) => {
  const res = await client.post(`/api/community/posts/${postId}/like`, null, {
    params: { likeType },
  });
  return res.data;
};

/**
 * 게시글 수정
 */
export const updatePost = async (postId, data) => {
  const res = await client.patch(`/api/community/posts/${postId}`, data);
  return res.data.data;
};

/**
 * 게시글 삭제
 */
export const deletePost = async (postId) => {
  const res = await client.delete(`/api/community/posts/${postId}`);
  return res.data;
};

/**
 * 내가 쓴 게시글 목록 조회 (페이지네이션)
 */
export const getMyPosts = async (page = 0, size = 20) => {
  const res = await client.get('/api/community/posts/me', { params: { page, size } });
  return res.data.data;
};
