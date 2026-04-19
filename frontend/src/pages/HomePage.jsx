// HomePage — 홈 (커뮤니티 + 구인구직 탭)
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import FeedItem from '../components/community/FeedItem';
import JobRow from '../components/job/JobRow';
import { IconPlus } from '../components/common/Icons';
import { getPosts } from '../api/communityApi';
import { getJobPostings } from '../api/jobApi';
import { useAuth } from '../context/AuthContext';

const COMMUNITY_CATEGORIES = [
  { id: 'ALL',        label: '전체' },
  { id: 'GENERAL',    label: '일반' },
  { id: 'ACCUSATION', label: '제보/고발' },
];

const JOB_CATEGORIES = [
  { id: 'ALL',      label: '전체' },
  { id: 'FILMING',  label: '촬영' },
  { id: 'LIGHTING', label: '조명' },
  { id: 'ETC',      label: '기타' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [tab, setTab] = useState('community');
  const [activeCat, setActiveCat] = useState('ALL');
  const [activeJobCat, setActiveJobCat] = useState('ALL');

  const [posts, setPosts] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (tab === 'community') {
        const data = await getPosts(0, 20);
        // data는 Page 객체 또는 배열
        setPosts(data.content || data || []);
      } else {
        const data = await getJobPostings();
        setJobs(data || []);
      }
    } catch (err) {
      console.error('데이터 로딩 실패:', err);
      setError(err.response?.status === 401
        ? '로그인이 필요합니다'
        : '데이터를 불러오는데 실패했습니다'
      );
      // 백엔드 미연결 시 빈 상태로 표시
      if (tab === 'community') setPosts([]);
      else setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 구인구직 필터링 (프론트에서)
  const filteredJobs = activeJobCat === 'ALL'
    ? jobs
    : jobs.filter(j => j.category === activeJobCat);

  const handleOpenPost = (post) => {
    // ⚠️ CommunityPostListResponse에 id가 없으므로 상세 이동 불가
    // 향후 백엔드에서 id 추가 시 연동 가능
    if (post.id) {
      navigate(`/posts/${post.id}`);
    }
  };

  const handleOpenJob = (job) => {
    navigate(`/jobs/${job.id}`);
  };

  const handleFabClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (tab === 'community') {
      navigate('/posts/create');
    } else {
      navigate('/jobs/create');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* 상단 헤더 */}
      <Header />

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
          { id: 'community', label: '커뮤니티' },
          { id: 'job', label: '구인구직' },
        ].map(tb => (
          <button
            key={tb.id}
            id={`tab-${tb.id}`}
            onClick={() => setTab(tb.id)}
            style={{
              flex: 1, padding: '10px 0',
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

      {/* 카테고리 칩 */}
      <div style={{
        display: 'flex', gap: 6, padding: '10px 20px 12px',
        overflowX: 'auto', scrollbarWidth: 'none',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg)',
      }}>
        {(tab === 'community' ? COMMUNITY_CATEGORIES : JOB_CATEGORIES).map(c => {
          const isActive = tab === 'community'
            ? activeCat === c.id
            : activeJobCat === c.id;
          return (
            <button
              key={c.id}
              onClick={() => tab === 'community' ? setActiveCat(c.id) : setActiveJobCat(c.id)}
              style={{
                height: 34, padding: '0 4px', whiteSpace: 'nowrap',
                border: 'none', background: 'transparent',
                borderBottom: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                color: isActive ? 'var(--text)' : 'var(--text-muted)',
                fontSize: 13, fontWeight: isActive ? 700 : 500,
                flexShrink: 0, cursor: 'pointer',
                fontFamily: 'var(--font-sans)', marginRight: 16,
                transition: 'color var(--transition-fast)',
              }}
            >{c.label}</button>
          );
        })}
      </div>

      {/* 피드 콘텐츠 */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }}>
        {loading && (
          <div className="flex-center" style={{ padding: 40 }}>
            <div className="spinner" />
          </div>
        )}

        {error && (
          <div className="empty-state">
            <div className="empty-icon">⚠️</div>
            <div>{error}</div>
            {error.includes('로그인') && (
              <button
                onClick={() => navigate('/login')}
                style={{
                  marginTop: 12, padding: '10px 28px',
                  borderRadius: 10, background: 'var(--accent)',
                  color: 'var(--accent-ink)', fontWeight: 700, fontSize: 14,
                }}
              >로그인하기</button>
            )}
          </div>
        )}

        {!loading && !error && tab === 'community' && posts.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <div>아직 게시글이 없습니다</div>
            <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>
              첫 번째 글을 작성해보세요!
            </div>
          </div>
        )}

        {!loading && !error && tab === 'community' && posts.map((p, i) => (
          <FeedItem key={p.id || i} post={p} onClick={p.id ? handleOpenPost : undefined} />
        ))}

        {!loading && !error && tab === 'job' && filteredJobs.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🎬</div>
            <div>구인구직 게시글이 없습니다</div>
          </div>
        )}

        {!loading && !error && tab === 'job' && filteredJobs.map(j => (
          <JobRow key={j.id} job={j} onClick={handleOpenJob} />
        ))}
      </div>

      {/* FAB 버튼 */}
      <button
        id="fab-create"
        onClick={handleFabClick}
        style={{
          position: 'fixed', bottom: 80, right: 'calc(50% - 220px)',
          width: 50, height: 50, borderRadius: 25,
          background: 'var(--accent)', color: 'var(--accent-ink)',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(255,107,107,0.35)',
          zIndex: 50,
          transition: 'transform var(--transition-fast)',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <IconPlus size={22} sw={2.4} />
      </button>
    </div>
  );
}
