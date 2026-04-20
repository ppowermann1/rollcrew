// JobDetailPage — 구인구직 상세 화면
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import IconBtn from '../components/common/IconBtn';
import { IconBack, IconMore } from '../components/common/Icons';
import { getJobPosting, deleteJobPosting, updateJobPosting } from '../api/jobApi';
import { useAuth } from '../context/AuthContext';

const JOB_CATEGORIES = {
  FILMING:  { label: '촬영', hue: 300 },
  LIGHTING: { label: '조명', hue: 40 },
  ETC:      { label: '기타', hue: 155 },
};

export default function JobDetailPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showActionSheet, setShowActionSheet] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        const data = await getJobPosting(jobId);
        setJob(data);
      } catch (err) {
        console.error('구인구직 로딩 실패:', err);
        setError('게시글을 불러올 수 없습니다');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [jobId]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <div className="flex-center" style={{ flex: 1 }}><div className="spinner" /></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <div style={{
          display: 'flex', alignItems: 'center', padding: '10px 16px',
          borderBottom: '1px solid var(--border)',
        }}>
          <IconBtn onClick={() => navigate(-1)}><IconBack size={20} /></IconBtn>
        </div>
        <div className="empty-state">
          <div className="empty-icon">😥</div>
          <div>{error || '게시글을 찾을 수 없습니다'}</div>
        </div>
      </div>
    );
  }

  const cat = JOB_CATEGORIES[job.category] || JOB_CATEGORIES.ETC;
  const isOpen = job.status === 'OPEN';
  const isAuthor = user && user.id === job.userId;

  const handleDelete = async () => {
    if (!window.confirm('게시글을 완전히 삭제하시겠습니까?')) return;
    try {
      await deleteJobPosting(jobId);
      navigate('/', { replace: true });
    } catch (err) {
      alert('삭제에 실패했습니다.');
    }
  };

  const handleToggleStatus = async () => {
    const newStatus = isOpen ? 'CLOSED' : 'OPEN';
    try {
      await updateJobPosting(jobId, { ...job, status: newStatus });
      setJob({ ...job, status: newStatus });
      setShowActionSheet(false);
    } catch (err) {
      alert('상태 변경에 실패했습니다.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* 상단 nav */}
      <div style={{
        display: 'flex', alignItems: 'center', padding: '10px 16px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <IconBtn onClick={() => navigate(-1)}><IconBack size={20} /></IconBtn>
        <div style={{
          flex: 1, textAlign: 'center', fontSize: 14, fontWeight: 700, color: 'var(--text)',
        }}>구인구직</div>
        {isAuthor ? (
          <IconBtn onClick={() => setShowActionSheet(true)}><IconMore size={20} /></IconBtn>
        ) : <div style={{ width: 44 }} />}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 90 }}>
        {/* 헤더 정보 */}
        <div style={{ padding: '20px 20px 18px', borderBottom: '1px solid var(--border)' }}>
          {/* 상태 배지 */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
            <div style={{
              padding: '4px 10px', borderRadius: 6,
              background: isOpen ? 'rgba(91,212,166,0.13)' : 'var(--surface)',
              color: isOpen ? 'var(--success)' : 'var(--text-muted)',
              fontSize: 12, fontWeight: 700,
            }}>{isOpen ? '● 모집중' : '마감'}</div>
            <div style={{
              padding: '4px 10px', borderRadius: 6,
              background: `oklch(0.22 0.05 ${cat.hue})`,
              color: `oklch(0.75 0.12 ${cat.hue})`,
              fontSize: 12, fontWeight: 700,
            }}>{cat.label}</div>
          </div>

          <h1 style={{
            margin: '0 0 16px', fontSize: 20, fontWeight: 800,
            lineHeight: 1.35, letterSpacing: -0.5, color: 'var(--text)',
          }}>{job.title}</h1>

          {/* 촬영일 */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px',
            background: 'var(--bg-sunken)', borderRadius: 10,
          }}>
            <div style={{ fontSize: 20 }}>📅</div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>촬영 일정</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>
                {job.shootingDates}
              </div>
            </div>
          </div>
        </div>

        {/* 본문 */}
        <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)' }}>
          <p style={{
            margin: 0, fontSize: 14.5, lineHeight: 1.75,
            color: 'var(--text)', letterSpacing: -0.2, whiteSpace: 'pre-line',
          }}>{job.content}</p>
        </div>

        {/* 지원하기 안내 */}
        <div style={{ padding: '18px 20px' }}>
          <div style={{
            padding: '14px 16px', borderRadius: 12,
            background: 'var(--bg-sunken)', border: '1px solid var(--border)',
            fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6,
          }}>
            <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>지원 방법</div>
            DM 또는 댓글로 포트폴리오와 간단한 소개를 남겨주세요.
          </div>
        </div>
      </div>

      {/* 지원하기 버튼 */}
      <div style={{
        padding: '12px 16px', borderTop: '1px solid var(--border)',
        background: 'var(--bg)',
        position: 'fixed', bottom: 0,
        left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 480,
      }}>
        <button
          id="btn-apply"
          style={{
            width: '100%', height: 50, borderRadius: 12, border: 'none',
            background: isOpen ? 'var(--accent)' : 'var(--surface)',
            color: isOpen ? 'var(--accent-ink)' : 'var(--text-muted)',
            fontSize: 15, fontWeight: 800, cursor: isOpen ? 'pointer' : 'default',
            fontFamily: 'var(--font-sans)', letterSpacing: -0.3,
            transition: 'transform var(--transition-fast)',
          }}
          onMouseEnter={e => isOpen && (e.currentTarget.style.transform = 'scale(1.02)')}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >{isOpen ? '지원하기' : '마감된 공고입니다'}</button>
      </div>

      {/* 액션 시트 모달 */}
      {showActionSheet && (
        <>
          <div 
            onClick={() => setShowActionSheet(false)}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', 
              zIndex: 100, backdropFilter: 'blur(2px)'
            }} 
          />
          <div style={{
            position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
            width: '100%', maxWidth: 480, background: 'var(--surface)',
            borderTopLeftRadius: 20, borderTopRightRadius: 20,
            padding: '24px 20px 40px', zIndex: 101,
            boxShadow: '0 -4px 20px rgba(0,0,0,0.2)',
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 16 }}>게시글 관리</div>
            <button
              onClick={handleToggleStatus}
              style={{ width: '100%', padding: '16px', background: 'var(--bg)', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 8, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
            >{isOpen ? '마감하기' : '모집중으로 변경'}</button>
            <button
              onClick={() => navigate(`/jobs/${jobId}/edit`)}
              style={{ width: '100%', padding: '16px', background: 'var(--bg)', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 8, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
            >수정하기</button>
            <button
              onClick={handleDelete}
              style={{ width: '100%', padding: '16px', background: 'rgba(255,107,107,0.1)', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, color: 'var(--danger)', marginBottom: 16, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
            >삭제하기</button>
            <button
              onClick={() => setShowActionSheet(false)}
              style={{ width: '100%', padding: '16px', background: 'var(--text-faint)', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, color: 'var(--text)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
            >취소</button>
          </div>
        </>
      )}
    </div>
  );
}
