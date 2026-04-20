// 구인구직 API
import client from './client';

/**
 * 구인구직 목록 조회 (페이지네이션)
 */
export const getJobPostings = async (page = 0, size = 20) => {
  const res = await client.get('/api/job-postings', { params: { page, size } });
  return res.data.data;
};

/**
 * 구인구직 상세 조회
 */
export const getJobPosting = async (jobPostId) => {
  const res = await client.get(`/api/job-postings/${jobPostId}`);
  return res.data.data;
};

/**
 * 구인구직 작성
 * body: { title, content, category(FILMING|LIGHTING|ETC), shootingDates }
 */
export const createJobPosting = async (data) => {
  const res = await client.post('/api/job-postings', data);
  return res.data.data;
};

/**
 * 구인구직 수정
 */
export const updateJobPosting = async (jobPostId, data) => {
  const res = await client.patch(`/api/job-postings/${jobPostId}`, data);
  return res.data.data;
};

/**
 * 구인구직 삭제
 */
export const deleteJobPosting = async (jobPostId) => {
  const res = await client.delete(`/api/job-postings/${jobPostId}`);
  return res.data;
};

/**
 * 내가 쓴 구인구직 목록 조회 (페이지네이션)
 */
export const getMyJobPostings = async (page = 0, size = 10) => {
  const res = await client.get('/api/job-postings/me', { params: { page, size } });
  return res.data.data;
};
