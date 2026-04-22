// MyPostsPage — 내 게시글 (커뮤니티 + 구인구직 탭)
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import BackBtn from '../components/common/BackBtn';
import FeedItem from '../components/community/FeedItem';
import JobRow from '../components/job/JobRow';
import { isPostRead } from '../utils/readTracker';
import Pagination from '../components/common/Pagination';
import { getMyPosts } from '../api/communityApi';
import { getMyJobPostings } from '../api/jobApi';
import { useAuth } from '../context/AuthContext';

export default function MyPostsPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    if (!isAuthenticated) navigate('/login', { replace: true });
  }, [isAuthenticated, navigate]);

  const [tab, setTab] = useState('job');
  const [commPage, setCommPage] = useState(0);
  const [commTotal, setCommTotal] = useState(1);
  const [jobPage, setJobPage] = useState(0);
  const [jobTotal, setJobTotal] = useState(1);

  const [posts, setPosts] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (tab === 'community') {
        const data = await getMyPosts(commPage, 10); // get latest 10 via pagination
        setPosts(data.content || data || []);
        setCommTotal(data.totalPages || 1);
      } else {
        const data = await getMyJobPostings(jobPage, 10);
        setJobs(data.content || data || []);
        setJobTotal(data.totalPages || 1);
      }
    } catch (err) {
      console.error('내 게시글 로딩 실패:', err);
      setError('데이터를 불러오는데 실패했습니다');
      if (tab === 'community') setPosts([]);
      else setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [tab, commPage, jobPage]);

  useEffect(() => {
    if (isAuthenticated) fetchData();
  }, [fetchData, isAuthenticated]);

  const handleOpenPost = (post) => {
    if (post.id) {
      navigate(`/posts/${post.id}`);
    }
  };

  const handleOpenJob = (job) => {
    navigate(`/jobs/${job.id}`);
  };

  if (!isAuthenticated) return null; // Wait for redirect

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* 상단 헤더 */}
      <div style={{
        display: 'flex', alignItems: 'center', padding: '10px 16px',
        borderBottom: '1px solid var(--border)', background: 'var(--bg)',
      }}>
        <BackBtn onClick={() => navigate(-1)} />
        <div style={{
          flex: 1, textAlign: 'center', fontSize: 16, fontWeight: 700, color: 'var(--text)',
        }}>내 게시글</div>
        <div style={{ width: 44 }} /> {/* 우측 여백 맞춤 */}
      </div>

      {/* 탭: 커뮤니티 / 구인구직 */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg)',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}>
        {[
          { id: 'job', label: '구인구직' },
          { id: 'community', label: '커뮤니티' },
        ].map(tb => (
          <button
            key={tb.id}
            onClick={() => setTab(tb.id)}
            style={{
              flex: 1, padding: '14px 0',
              background: 'transparent', border: 'none',
              borderBottom: tab === tb.id ? '2px solid var(--accent)' : '2px solid transparent',
              color: tab === tb.id ? 'var(--accent)' : 'var(--text-muted)',
              fontSize: 14, fontWeight: 700, cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              transition: 'color var(--transition-fast)',
            }}
          >{tb.label}</button>
        ))}
      </div>

      {/* 피드 콘텐츠 */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80, position: 'relative' }}>
        {loading && (
          <div className="flex-center" style={{ padding: 40 }}>
            <div className="spinner" />
          </div>
        )}

        {error && (
          <div className="empty-state">
            <div className="empty-icon">⚠️</div>
            <div>{error}</div>
          </div>
        )}

        <div>
          {!loading && !error && tab === 'community' && posts.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <div>작성한 커뮤니티 게시글이 없습니다.</div>
            </div>
          )}

          {!loading && !error && tab === 'community' && posts.map((p, i) => (
            <FeedItem key={p.id || i} post={p} onClick={p.id ? handleOpenPost : undefined} isRead={isPostRead('community', p.id)} />
          ))}

          {!loading && !error && tab === 'job' && jobs.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">🎬</div>
              <div>작성한 구인구직 게시글이 없습니다.</div>
            </div>
          )}

          {!loading && !error && tab === 'job' && jobs.map(j => (
            <JobRow key={j.id} job={j} onClick={handleOpenJob} isRead={isPostRead('job', j.id)} />
          ))}

          {!loading && !error && tab === 'community' && posts.length > 0 && (
            <Pagination currentPage={commPage} totalPages={commTotal} onPageChange={setCommPage} />
          )}

          {!loading && !error && tab === 'job' && jobs.length > 0 && (
            <Pagination currentPage={jobPage} totalPages={jobTotal} onPageChange={setJobPage} />
          )}
        </div>
      </div>
    </div>
  );
}
