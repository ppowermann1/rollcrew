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
