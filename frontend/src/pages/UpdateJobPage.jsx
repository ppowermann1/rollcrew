// CreateJobPage — 구인구직 작성
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import IconBtn from '../components/common/IconBtn';
import { IconBack } from '../components/common/Icons';
import { getJobPosting, updateJobPosting } from '../api/jobApi';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = [
  { id: 'FILMING', label: '촬영' },
  { id: 'LIGHTING', label: '조명' },
  { id: 'ETC', label: '기타' },
];

export default function UpdateJobPage() {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const { isAuthenticated } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('FILMING');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isRange, setIsRange] = useState(false);
  const [status, setStatus] = useState('OPEN');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data = await getJobPosting(jobId);
        setTitle(data.title);
        setContent(data.content);
        setCategory(data.category);
        if (data.shootingDates) {
          if (data.shootingDates.includes('~')) {
            const dates = data.shootingDates.split(' ~ ');
            setStartDate(dates[0] || '');
            setEndDate(dates[1] || '');
            setIsRange(true);
          } else {
            setStartDate(data.shootingDates);
            setIsRange(false);
          }
        }
        setStatus(data.status);
      } catch (err) {
        console.error('구인구직 로딩 실패:', err);
        setError('게시글 정보를 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [jobId]);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim() || !startDate || submitting) return;
    if (!isAuthenticated) { navigate('/login'); return; }

    setSubmitting(true);
    setError(null);
    try {
      let finalDates = startDate;
      if (isRange && endDate && startDate !== endDate) {
        finalDates = `${startDate} ~ ${endDate}`;
      }

      await updateJobPosting(jobId, {
        title: title.trim(),
        content: content.trim(),
        category,
        shootingDates: finalDates,
        status, // 기존 상태 유지
      });
      navigate(`/jobs/${jobId}`, { replace: true });
    } catch (err) {
      console.error('구인구직 수정 실패:', err);
      setError('게시글 수정에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* 헤더 */}
      <div style={{
        display: 'flex', alignItems: 'center', padding: '10px 16px',
        borderBottom: '1px solid var(--border)', background: 'var(--bg)',
      }}>
        <IconBtn onClick={() => navigate(-1)}><IconBack size={20} /></IconBtn>
        <div style={{
          flex: 1, textAlign: 'center', fontSize: 14, fontWeight: 700, color: 'var(--text)',
        }}>구인구직 수정</div>
        <button
          id="btn-submit-job"
          onClick={handleSubmit}
          disabled={!title.trim() || !content.trim() || !startDate || submitting}
          style={{
            padding: '8px 16px', borderRadius: 8,
            background: title.trim() && content.trim() && startDate ? 'var(--accent)' : 'var(--surface)',
            color: title.trim() && content.trim() && startDate ? 'var(--accent-ink)' : 'var(--text-faint)',
            fontSize: 13, fontWeight: 700,
            transition: 'all var(--transition-fast)',
          }}
        >{submitting ? '수정 중...' : '수정'}</button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
        {loading && <div className="flex-center" style={{ padding: 40 }}><div className="spinner" /></div>}
        
        {error && (
          <div style={{
            padding: '12px 14px', borderRadius: 10,
            background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)',
            color: 'var(--danger)', fontSize: 13, marginBottom: 16,
          }}>{error}</div>
        )}

        {/* 카테고리 선택 */}
        <div style={{ marginBottom: 20 }}>
          <label style={{
            fontSize: 12, fontWeight: 700, color: 'var(--text-muted)',
            display: 'block', marginBottom: 8,
          }}>카테고리</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {CATEGORIES.map(c => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                style={{
                  flex: 1, padding: '10px 0', borderRadius: 10,
                  border: `1.5px solid ${category === c.id ? 'var(--accent)' : 'var(--border)'}`,
                  background: category === c.id ? 'var(--accent)' : 'transparent',
                  color: category === c.id ? 'var(--accent-ink)' : 'var(--text)',
                  fontSize: 13, fontWeight: 700,
                  transition: 'all var(--transition-fast)',
                }}
              >{c.label}</button>
            ))}
          </div>
        </div>

        {/* 제목 */}
        <div style={{ marginBottom: 20 }}>
          <label style={{
            fontSize: 12, fontWeight: 700, color: 'var(--text-muted)',
            display: 'block', marginBottom: 8,
          }}>제목</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="예: [급구] 4/25 단편 드라마 B캠 오퍼레이터"
            maxLength={100}
            style={{
              width: '100%', height: 44, borderRadius: 10, padding: '0 14px',
              background: 'var(--surface)', border: '1px solid var(--border)',
              fontSize: 14, color: 'var(--text)',
            }}
          />
        </div>

        {/* 촬영일정 (캘린더) */}
        <div style={{ marginBottom: 20 }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8
          }}>
            <label style={{
              fontSize: 12, fontWeight: 700, color: 'var(--text-muted)',
            }}>촬영 일정 (캘린더 선택)</label>
            <label style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 12, color: 'var(--text)', cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={isRange}
                onChange={e => setIsRange(e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              기간으로 선택
            </label>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              style={{
                flex: 1, height: 44, borderRadius: 10, padding: '0 14px',
                background: 'var(--surface)', border: '1px solid var(--border)',
                fontSize: 14, color: 'var(--text)', colorScheme: 'dark'
              }}
            />
            {isRange && (
              <>
                <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>~</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  style={{
                    flex: 1, height: 44, borderRadius: 10, padding: '0 14px',
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    fontSize: 14, color: 'var(--text)', colorScheme: 'dark'
                  }}
                />
              </>
            )}
          </div>
        </div>

        {/* 본문 */}
        <div>
          <label style={{
            fontSize: 12, fontWeight: 700, color: 'var(--text-muted)',
            display: 'block', marginBottom: 8,
          }}>내용</label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="촬영 정보, 조건, 급여 등을 자세히 적어주세요"
            rows={12}
            style={{
              width: '100%', borderRadius: 10, padding: '14px',
              background: 'var(--surface)', border: '1px solid var(--border)',
              fontSize: 14, color: 'var(--text)', lineHeight: 1.6,
              resize: 'vertical', minHeight: 200,
            }}
          />
        </div>
      </div>
    </div>
  );
}
