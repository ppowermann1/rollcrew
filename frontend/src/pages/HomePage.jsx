// HomePage — 홈 (커뮤니티 + 구인구직 탭)
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { isPostRead } from '../utils/readTracker';
import Header from '../components/layout/Header';
import FeedItem from '../components/community/FeedItem';
import JobRow from '../components/job/JobRow';
import Pagination from '../components/common/Pagination';
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
  { id: 'DIRECTING', label: '연출' },
  { id: 'ETC',      label: '기타' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [tab, setTab] = useState(location.state?.tab || 'community');
  const [activeCat, setActiveCat] = useState('ALL');
  const [activeJobCat, setActiveJobCat] = useState('ALL');

  const [commPage, setCommPage] = useState(0);
  const [commTotal, setCommTotal] = useState(1);
  const [jobPage, setJobPage] = useState(0);
  const [jobTotal, setJobTotal] = useState(1);
  const [jobStatusFilter, setJobStatusFilter] = useState('OPEN');

  const [posts, setPosts] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const prevRefreshAt = useRef(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (tab === 'community') {
        const category = activeCat === 'ALL' ? null : activeCat;
        const data = await getPosts(commPage, 20, category);
        setPosts(data.content || data || []);
        setCommTotal(data.totalPages || 1);
      } else {
        const data = await getJobPostings(jobPage, 20, jobStatusFilter);
        setJobs(data.content || data || []);
        setJobTotal(data.totalPages || 1);
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
  }, [tab, commPage, jobPage, activeCat, jobStatusFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 로고/홈탭 새로고침 트리거
  useEffect(() => {
    const refreshAt = location.state?.refreshAt;
    if (!refreshAt || refreshAt === prevRefreshAt.current) return;
    prevRefreshAt.current = refreshAt;
    setRefreshing(true);
    fetchData();
    setTimeout(() => setRefreshing(false), 250);
  }, [location.state?.refreshAt]);

  // 구인구직 필터링 (프론트에서)
  const filteredJobs = activeJobCat === 'ALL'
    ? jobs
    : jobs.filter(j => j.category === activeJobCat);

  const handleOpenPost = (post) => {
    navigate(`/posts/${post.id}`);
  };

  const handleOpenJob = (job) => {
    navigate(`/jobs/${job.id}`);
  };

  const [showFabMenu, setShowFabMenu] = useState(false);
  const [fabActive, setFabActive] = useState(false);
  const [commActive, setCommActive] = useState(false);
  const [jobActive, setJobActive] = useState(false);

  const handleFabClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setShowFabMenu(v => !v);
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
          { id: 'job', label: '구인구직' },
          { id: 'community', label: '커뮤니티' },
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
        {tab === 'job' && (
          <button
            onClick={() => { setJobStatusFilter(v => v === 'OPEN' ? null : 'OPEN'); setJobPage(0); }}
            style={{
              height: 34, padding: '0 12px', whiteSpace: 'nowrap', flexShrink: 0,
              border: `1.5px solid ${jobStatusFilter === 'OPEN' ? 'var(--success)' : 'var(--border)'}`,
              borderRadius: 17,
              background: jobStatusFilter === 'OPEN' ? 'rgba(91,212,166,0.13)' : 'transparent',
              color: jobStatusFilter === 'OPEN' ? 'var(--success)' : 'var(--text-muted)',
              fontSize: 12, fontWeight: 700, cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              transition: 'all var(--transition-fast)',
            }}
          >{jobStatusFilter === 'OPEN' ? '● 모집중' : '전체'}</button>
        )}
        {(tab === 'community' ? COMMUNITY_CATEGORIES : JOB_CATEGORIES).map(c => {
          const isActive = tab === 'community'
            ? activeCat === c.id
            : activeJobCat === c.id;
          return (
            <button
              key={c.id}
              onClick={() => {
                if (tab === 'community') { setActiveCat(c.id); setCommPage(0); }
                else setActiveJobCat(c.id);
              }}
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
      <div style={{
        flex: 1, overflowY: 'auto', paddingBottom: 80, position: 'relative',
        opacity: refreshing ? 0.35 : 1,
        transition: refreshing ? 'none' : 'opacity 0.2s ease',
      }}>
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

        <div style={{
          filter: !isAuthenticated && !loading ? 'blur(6px)' : 'none',
          pointerEvents: !isAuthenticated ? 'none' : 'auto',
          userSelect: !isAuthenticated ? 'none' : 'auto'
        }}>
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
            <FeedItem key={p.id || i} post={p} onClick={handleOpenPost} isRead={isPostRead('community', p.id)} />
          ))}

          {!loading && !error && tab === 'job' && filteredJobs.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">🎬</div>
              <div>구인구직 게시글이 없습니다</div>
            </div>
          )}

          {!loading && !error && tab === 'job' && filteredJobs.map(j => (
            <JobRow key={j.id} job={j} onClick={handleOpenJob} isRead={isPostRead('job', j.id)} />
          ))}
          
          {!loading && !error && tab === 'community' && posts.length > 0 && (
            <Pagination currentPage={commPage} totalPages={commTotal} onPageChange={setCommPage} />
          )}

          {!loading && !error && tab === 'job' && jobs.length > 0 && (
            <Pagination currentPage={jobPage} totalPages={jobTotal} onPageChange={setJobPage} />
          )}
        </div>

        {/* 비로그인 유저 전용 블러 오버레이 & 로그인 유도 (Paywall 레이어) */}
        {!isAuthenticated && !loading && !error && (
          <div style={{
            position: 'absolute',
            top: '15%',
            left: 20, right: 20,
            background: 'rgba(30, 30, 30, 0.75)',
            backdropFilter: 'blur(12px)',
            padding: '30px 20px',
            borderRadius: 16,
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            zIndex: 10,
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
          }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🔒</div>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 10px', color: 'var(--text)', wordBreak: 'keep-all' }}>
              로그인이 필요한 서비스입니다.
            </h2>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 24, wordBreak: 'keep-all' }}>
              롤크루의 현직 영상인들과 소통하려면<br />로그인이 필요합니다.
            </p>
            <button
              onClick={() => navigate('/login')}
              style={{
                background: 'var(--accent)', color: '#ffffff',
                border: 'none', padding: '14px 24px', borderRadius: 12,
                fontSize: 15, fontWeight: 800, width: '100%',
                cursor: 'pointer', fontFamily: 'var(--font-sans)',
              }}
            >
              로그인하기
            </button>
          </div>
        )}
      </div>

      {/* FAB + 메뉴 */}
      <div style={{
        position: 'fixed',
        bottom: 'calc(76px + env(safe-area-inset-bottom, 0px))',
        right: 'max(16px, calc(50% - 224px))',
        zIndex: 99,
        display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10,
      }}>
        {/* 메뉴 팝업 */}
        {showFabMenu && (
          <>
            <div
              style={{ position: 'fixed', inset: 0, zIndex: -1 }}
              onClick={() => setShowFabMenu(false)}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
              <button
                onClick={() => { setShowFabMenu(false); navigate('/posts/create'); }}
                onTouchStart={() => setCommActive(true)}
                onTouchEnd={() => setCommActive(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 16px', borderRadius: 12,
                  background: commActive ? 'var(--bg-sunken)' : 'var(--surface)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)', fontSize: 14, fontWeight: 700,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
                  cursor: 'pointer', whiteSpace: 'nowrap',
                  transform: commActive ? 'scale(0.96)' : 'scale(1)',
                  transition: 'transform 0.1s, background 0.1s',
                }}
              >
                <span style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: 'var(--accent)', color: 'var(--accent-ink)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 15, fontWeight: 800,
                }}>✏️</span>
                커뮤니티 글쓰기
              </button>
              <button
                onClick={() => { setShowFabMenu(false); navigate('/jobs/create'); }}
                onTouchStart={() => setJobActive(true)}
                onTouchEnd={() => setJobActive(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 16px', borderRadius: 12,
                  background: jobActive ? 'var(--bg-sunken)' : 'var(--surface)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)', fontSize: 14, fontWeight: 700,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
                  cursor: 'pointer', whiteSpace: 'nowrap',
                  transform: jobActive ? 'scale(0.96)' : 'scale(1)',
                  transition: 'transform 0.1s, background 0.1s',
                }}
              >
                <span style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: '#5BD4A6', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 15,
                }}>🎬</span>
                구인구직 글쓰기
              </button>
            </div>
          </>
        )}

        {/* FAB 버튼 */}
        <button
          id="fab-create"
          onClick={handleFabClick}
          onTouchStart={() => setFabActive(true)}
          onTouchEnd={() => setFabActive(false)}
          style={{
            width: 50, height: 50, borderRadius: 14,
            background: 'var(--accent)', color: 'var(--accent-ink)',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: fabActive
              ? '0 2px 8px rgba(255,107,107,0.25)'
              : '0 4px 16px rgba(255,107,107,0.35)',
            transition: 'transform 0.12s, box-shadow 0.12s',
            transform: showFabMenu
              ? (fabActive ? 'rotate(45deg) scale(0.92)' : 'rotate(45deg)')
              : (fabActive ? 'scale(0.92)' : 'scale(1)'),
          }}
        >
          <IconPlus size={22} sw={2.4} />
        </button>
      </div>
    </div>
  );
}
