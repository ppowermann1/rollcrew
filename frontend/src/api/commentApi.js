// 댓글 API
import client from './client';

/**
 * 댓글 목록 조회
 * @param {number} postId
 * @param {number} page
 * @returns {Promise<CommentResponse[]>}
 */
export const getComments = async (postId, page = 0) => {
  const res = await client.get(`/api/community/comments/${postId}`, {
    params: { page },
  });
  // { comments, totalPages, currentPage }
  return res.data.data;
};

/**
 * 댓글 작성
 * body: { nickname, content, parentId(nullable) }
 */
export const createComment = async (postId, data) => {
  const res = await client.post(`/api/community/comments/${postId}`, data);
  return res.data.data;
};

/**
 * 댓글 수정
 */
export const updateComment = async (commentId, data) => {
  const res = await client.patch(`/api/community/comments/${commentId}`, data);
  return res.data.data;
};

/**
 * 댓글 삭제
 */
export const deleteComment = async (commentId) => {
  const res = await client.delete(`/api/community/comments/${commentId}`);
  return res.data;
};

/**
 * 댓글 좋아요/싫어요 토글
 */
export const toggleCommentLike = async (commentId, likeType) => {
  const res = await client.post(`/api/community/comments/${commentId}/like`, null, {
    params: { likeType },
  });
  return res.data;
};
