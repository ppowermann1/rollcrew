// 유저 API
import client from './client';

/**
 * 내 정보 조회
 * @returns {Promise<{email, nickname, role}>}
 */
export const getMyInfo = async () => {
  const res = await client.get('/api/users/me');
  return res.data.data;
};

/**
 * 프로필 조회
 * @returns {Promise<{nickname, profileImageUrl, bio, portfolioUrl}>}
 */
export const getProfile = async () => {
  const res = await client.get('/api/users/profile');
  return res.data.data;
};

/**
 * 프로필 수정
 * @param {{ bio: string }} data
 */
export const updateProfile = async (data) => {
  const res = await client.patch('/api/users/profile', data);
  return res.data.data;
};
