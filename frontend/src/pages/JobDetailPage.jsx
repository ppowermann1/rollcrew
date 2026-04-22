// JobDetailPage — 구인구직 상세 화면
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import IconBtn from '../components/common/IconBtn';
import BackBtn from '../components/common/BackBtn';
import { IconMore } from '../components/common/Icons';
import { getJobPosting, deleteJobPosting, updateJobPosting, createApply, getApplies, updateApplyStatus, cancelApply, getMyApply } from '../api/jobApi';
import { getProfile } from '../api/userApi';
import { useAuth } from '../context/AuthContext';

const isPastShootingDate = (shootingDates) => {
  if (!shootingDates) return false;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  let lastDate;
  if (shootingDates.includes('~')) {
    lastDate = new Date(shootingDates.split('~')[1].trim());
  } else if (shootingDates.includes(',')) {
    const parts = shootingDates.split(',').map(d => new Date(d.trim()));
    lastDate = new Date(Math.max(...parts));
  } else {
    lastDate = new Date(shootingDates.trim());
  }
  return !isNaN(lastDate) && lastDate < today;
};

const fmtDate = (s) => {
  const d = new Date(s.trim());
  if (isNaN(d)) return s.trim();
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
};

const JOB_CATEGORIES = {
  FILMING:  { label: '촬영', hue: 300 },
  LIGHTING: { label: '조명', hue: 40 },
  DIRECTING: { label: '연출', hue: 200 },
  ETC:      { label: '기타', hue: 155 },
};

const STATUS_STYLE = {
  ACCEPTED: { bg: 'rgba(91,212,166,0.13)', color: 'var(--success)', label: '수락' },
  REJECTED: { bg: 'rgba(255,107,107,0.1)',  color: 'var(--danger)',  label: '거절' },
  PENDING:  { bg: 'var(--surface)',          color: 'var(--text-muted)', label: '검토중' },
};

export default function JobDetailPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showActionSheet, setShowActionSheet] = useState(false);

  // 지원 관련 (일반 유저)
  const [showApplySheet, setShowApplySheet] = useState(false);
  const [applyMessage, setApplyMessage] = useState('');
  const [applying, setApplying] = useState(false);
  const [myApply, setMyApply] = useState(null);
  const [toast, setToast] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  // 지원자 목록 (작성자 — 인라인)
  const [applicants, setApplicants] = useState([]);
  const [applicantsLoading, setApplicantsLoading] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [acceptedName, setAcceptedName] = useState('');
  const [confirmApply, setConfirmApply] = useState(null); // { applyId, applicantNickname, message }
  const [confirmCancel, setConfirmCancel] = useState(false);

  const textareaRef = useRef(null);

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

  // 작성자일 때 지원자 목록 자동 로딩
  useEffect(() => {
    if (!job || !user || user.id !== job.userId) return;
    setApplicantsLoading(true);
    getApplies(jobId)
      .then(setApplicants)
      .catch(() => {/* 무시 */})
      .finally(() => setApplicantsLoading(false));
  }, [job, user, jobId]);

  // 비작성자일 때 내 기존 지원 현황 로딩
  useEffect(() => {
    if (!job || !user || user.id === job.userId) return;
    getMyApply(jobId)
      .then(data => { if (data) setMyApply(data); })
      .catch(() => {/* 무시 */});
  }, [job, user, jobId]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const handleApply = async () => {
    if (applying) return;
    setApplying(true);
    try {
      const result = await createApply(jobId, applyMessage.trim());
      setMyApply(result);
      setShowApplySheet(false);
      setApplyMessage('');
      showToast('지원이 완료되었습니다 ✓');
    } catch (err) {
      showToast(err?.response?.data?.message || '지원에 실패했습니다.');
    } finally {
      setApplying(false);
    }
  };

  const handleCancelApply = async () => {
    if (!myApply) return;
    try {
      await cancelApply(myApply.applyId);
      setMyApply(null);
      setConfirmCancel(false);
      showToast('지원이 취소되었습니다');
    } catch {
      showToast('지원 취소에 실패했습니다.');
    }
  };

  const handleApplyStatus = async (applyId, status, applicantNickname) => {
    try {
      const updated = await updateApplyStatus(applyId, status);
      setApplicants(prev => prev.map(a => a.applyId === applyId ? updated : a));
      if (status === 'ACCEPTED') {
        setAcceptedName(applicantNickname || '지원자');
        setShowCloseModal(true);
      }
    } catch {
      showToast('상태 변경에 실패했습니다.');
    }
  };

  const handleCancelAccept = async (applyId) => {
    try {
      const updated = await updateApplyStatus(applyId, 'PENDING');
      setApplicants(prev => prev.map(a => a.applyId === applyId ? updated : a));
      await updateJobPosting(jobId, { ...job, status: 'OPEN' });
      setJob(prev => ({ ...prev, status: 'OPEN' }));
      showToast('수락이 취소되고 공고가 모집중으로 변경됐습니다');
    } catch {
      showToast('수락 취소에 실패했습니다.');
    }
  };

  const handleCloseJob = async () => {
    try {
      await updateJobPosting(jobId, { ...job, status: 'CLOSED' });
      setJob(prev => ({ ...prev, status: 'CLOSED' }));
    } catch {
      showToast('마감 처리에 실패했습니다.');
    } finally {
      setShowCloseModal(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('게시글을 완전히 삭제하시겠습니까?')) return;
    try {
      await deleteJobPosting(jobId);
      navigate('/', { replace: true });
    } catch {
      alert('삭제에 실패했습니다.');
    }
  };

  const handleToggleStatus = async () => {
    const newStatus = job.status === 'OPEN' ? 'CLOSED' : 'OPEN';
    try {
      await updateJobPosting(jobId, { ...job, status: newStatus });
      setJob({ ...job, status: newStatus });
      setShowActionSheet(false);
    } catch {
      alert('상태 변경에 실패했습니다.');
    }
  };

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
        <div style={{ display: 'flex', alignItems: 'center', padding: '10px 16px', borderBottom: '1px solid var(--border)' }}>
          <BackBtn onClick={() => navigate('/', { state: { tab: 'job' } })} />
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>

      {/* 상단 nav */}
      <div style={{
        display: 'flex', alignItems: 'center', padding: '10px 16px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg)', position: 'sticky', top: 0, zIndex: 50,
      }}>
        <BackBtn onClick={() => navigate('/', { state: { tab: 'job' } })} />
        <div style={{ flex: 1, textAlign: 'center', fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>구인구직</div>
        {isAuthor && isOpen && !isPastShootingDate(job.shootingDates)
          ? <IconBtn onClick={() => setShowActionSheet(true)}><IconMore size={20} /></IconBtn>
          : <div style={{ width: 44 }} />
        }
      </div>

      {/* 스크롤 영역 */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: isAuthor ? 24 : 90 }}>

        {/* 헤더 */}
        <div style={{ padding: '20px 20px 18px', borderBottom: '1px solid var(--border)' }}>
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
            margin: '0 0 12px', fontSize: 20, fontWeight: 800,
            lineHeight: 1.35, letterSpacing: -0.5, color: 'var(--text)',
          }}>{job.title}</h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
            <div style={{
              width: 26, height: 26, borderRadius: 8,
              background: 'var(--accent)', color: 'var(--accent-ink)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 800, flexShrink: 0,
            }}>
              {job.authorName?.charAt(0) || '?'}
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>
              {job.authorName || '알 수 없음'}
            </span>
            <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>
              {job.createdAt ? new Date(job.createdAt).toLocaleDateString('ko-KR') : ''}
            </span>
          </div>

          <div style={{ padding: '12px 14px', background: 'var(--bg-sunken)', borderRadius: 10, textAlign: 'center' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 8 }}>🎬 촬영 일정</div>
            {job.shootingDates?.includes('~') ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
                {job.shootingDates.split('~').map((d, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700,
                      color: i === 0 ? 'var(--success)' : 'var(--danger)',
                      background: i === 0 ? 'rgba(91,212,166,0.13)' : 'rgba(255,107,107,0.1)',
                      padding: '2px 6px', borderRadius: 4, flexShrink: 0,
                    }}>{i === 0 ? '시작' : '종료'}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{fmtDate(d)}</span>
                  </div>
                ))}
              </div>
            ) : job.shootingDates?.includes(',') ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
                {job.shootingDates.split(',').map((d, i) => (
                  <div key={i} style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{fmtDate(d)}</div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{fmtDate(job.shootingDates)}</div>
            )}
          </div>
        </div>

        {/* 본문 */}
        <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)' }}>
          <p style={{
            margin: 0, fontSize: 14.5, lineHeight: 1.75,
            color: 'var(--text)', letterSpacing: -0.2, whiteSpace: 'pre-line',
          }}>{job.content}</p>
        </div>

        {/* 비작성자 영역 — 지원 현황 또는 지원 방법 안내 */}
        {!isAuthor && (
          <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)' }}>
            {myApply ? (
              /* 내 지원 현황 인라인 카드 */
              <div style={{
                borderRadius: 14,
                border: `1.5px solid ${STATUS_STYLE[myApply.status]?.color ?? 'var(--text-muted)'}55`,
                overflow: 'hidden',
              }}>
                {/* 카드 헤더 */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: `${STATUS_STYLE[myApply.status]?.bg ?? 'var(--surface)'}`,
                  borderBottom: `1px solid ${STATUS_STYLE[myApply.status]?.color ?? 'var(--text-muted)'}22`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <div style={{
                      width: 7, height: 7, borderRadius: 4,
                      background: STATUS_STYLE[myApply.status]?.color ?? 'var(--text-muted)',
                    }} />
                    <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text)' }}>내 지원 현황</span>
                  </div>
                  <span style={{
                    padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700,
                    background: `${STATUS_STYLE[myApply.status]?.color ?? 'var(--text-muted)'}22`,
                    color: STATUS_STYLE[myApply.status]?.color ?? 'var(--text-muted)',
                  }}>{STATUS_STYLE[myApply.status]?.label ?? '검토중'}</span>
                </div>

                {/* 지원 메시지 */}
                <div style={{ padding: '14px 16px', background: 'var(--bg-elevated)' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8 }}>지원 메시지</div>
                  <p style={{
                    margin: '0 0 14px', fontSize: 14, lineHeight: 1.7,
                    color: 'var(--text)', whiteSpace: 'pre-line',
                  }}>{myApply.message || '메시지 없음'}</p>

                  {/* 지원 취소 버튼 */}
                  <button
                    onClick={() => setConfirmCancel(true)}
                    style={{
                      width: '100%', height: 42, borderRadius: 10, border: 'none',
                      background: 'rgba(255,107,107,0.1)', color: 'var(--danger)',
                      fontSize: 13, fontWeight: 700, cursor: 'pointer',
                      fontFamily: 'var(--font-sans)',
                    }}
                  >지원 취소</button>
                </div>
              </div>
            ) : (
              /* 미지원 — 지원 방법 안내 */
              <div style={{
                padding: '14px 16px', borderRadius: 12,
                background: 'var(--bg-sunken)', border: '1px solid var(--border)',
                fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6,
              }}>
                <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>지원 방법</div>
                아래 지원하기 버튼을 눌러 메시지와 함께 지원해주세요.
              </div>
            )}
          </div>
        )}

        {/* ── 지원자 목록 인라인 (작성자 전용) ── */}
        {isAuthor && (
          <div style={{ padding: '20px 20px 8px' }}>

            {/* 섹션 헤더 */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14,
            }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)', letterSpacing: -0.3 }}>
                지원자
              </span>
              {!applicantsLoading && (
                <span style={{
                  minWidth: 20, height: 20, borderRadius: 10,
                  background: applicants.length > 0 ? 'var(--accent)' : 'var(--surface)',
                  color: applicants.length > 0 ? 'var(--accent-ink)' : 'var(--text-muted)',
                  fontSize: 11, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '0 6px',
                }}>{applicants.length}</span>
              )}
            </div>

            {/* 로딩 */}
            {applicantsLoading && (
              <div className="flex-center" style={{ height: 72 }}>
                <div className="spinner" />
              </div>
            )}

            {/* 없을 때 */}
            {!applicantsLoading && applicants.length === 0 && (
              <div style={{
                padding: '24px 0', textAlign: 'center',
                color: 'var(--text-faint)', fontSize: 13,
                background: 'var(--bg-sunken)', borderRadius: 12,
              }}>
                아직 지원자가 없습니다
              </div>
            )}

            {/* 지원자 카드 목록 */}
            {!applicantsLoading && applicants.map(a => {
              const st = STATUS_STYLE[a.status] || STATUS_STYLE.PENDING;
              return (
                <div key={a.applyId} style={{
                  padding: '14px 16px',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: 14,
                  marginBottom: 8,
                }}>
                  {/* 닉네임 + 상태 배지 */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: a.message ? 8 : (a.status === 'PENDING' ? 10 : 0) }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{a.applicantNickname}</span>
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6,
                      background: st.bg, color: st.color,
                    }}>{st.label}</span>
                  </div>

                  {/* 메시지 */}
                  {a.message && (
                    <p style={{
                      margin: `0 0 ${a.status === 'PENDING' ? 10 : a.status === 'ACCEPTED' ? 10 : 0}px`,
                      fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.55,
                    }}>{a.message}</p>
                  )}

                  {/* 수락/거절 버튼 — PENDING일 때만 */}
                  {a.status === 'PENDING' && (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => setConfirmApply({ applyId: a.applyId, applicantNickname: a.applicantNickname, message: a.message })}
                        style={{
                          flex: 1, height: 36, borderRadius: 8, border: 'none',
                          background: 'rgba(91,212,166,0.13)', color: 'var(--success)',
                          fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sans)',
                        }}
                      >수락</button>
                      <button
                        onClick={() => handleApplyStatus(a.applyId, 'REJECTED', null)}
                        style={{
                          flex: 1, height: 36, borderRadius: 8, border: 'none',
                          background: 'rgba(255,107,107,0.1)', color: 'var(--danger)',
                          fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sans)',
                        }}
                      >거절</button>
                    </div>
                  )}

                  {/* 수락 취소 버튼 — ACCEPTED일 때만 */}
                  {a.status === 'ACCEPTED' && (
                    <button
                      onClick={() => handleCancelAccept(a.applyId)}
                      style={{
                        width: '100%', height: 36, borderRadius: 8,
                        border: '1px solid var(--border)', background: 'transparent',
                        color: 'var(--text-muted)', fontSize: 13, fontWeight: 700,
                        cursor: 'pointer', fontFamily: 'var(--font-sans)',
                      }}
                    >수락 취소</button>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* 하단 지원하기 버튼 (비작성자 + 미지원 상태만) */}
      {!isAuthor && !myApply && (
        <div style={{
          padding: '12px 16px', borderTop: '1px solid var(--border)',
          background: 'var(--bg)',
          position: 'fixed', bottom: 0,
          left: '50%', transform: 'translateX(-50%)',
          width: '100%', maxWidth: 480,
        }}>
          <button
            onClick={() => isOpen && setShowApplySheet(true)}
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
      )}

      {/* 토스트 */}
      {toast && <div className="toast">{toast}</div>}

      {/* 지원 취소 확인 모달 */}
      {confirmCancel && (
        <>
          <div
            onClick={() => setConfirmCancel(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100, backdropFilter: 'blur(2px)' }}
          />
          <div style={{
            position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
            width: '100%', maxWidth: 480, background: 'var(--surface)',
            borderTopLeftRadius: 20, borderTopRightRadius: 20,
            padding: '28px 20px 40px', zIndex: 101,
            boxShadow: '0 -4px 20px rgba(0,0,0,0.2)',
          }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)', marginBottom: 8 }}>
                지원을 취소하시겠습니까?
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                취소 후 다시 지원할 수 있습니다
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setConfirmCancel(false)}
                style={{
                  flex: 1, height: 50, borderRadius: 12,
                  border: '1.5px solid var(--border)', background: 'transparent',
                  color: 'var(--text)', fontSize: 15, fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'var(--font-sans)',
                }}
              >닫기</button>
              <button
                onClick={handleCancelApply}
                style={{
                  flex: 1, height: 50, borderRadius: 12, border: 'none',
                  background: 'rgba(255,107,107,0.15)', color: 'var(--danger)',
                  fontSize: 15, fontWeight: 800, cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                }}
              >취소하기</button>
            </div>
          </div>
        </>
      )}

      {/* 지원하기 바텀시트 */}
      {showApplySheet && (
        <>
          <div
            onClick={() => { setShowApplySheet(false); setApplyMessage(''); }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100, backdropFilter: 'blur(2px)' }}
          />
          <div style={{
            position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
            width: '100%', maxWidth: 480, background: 'var(--surface)',
            borderTopLeftRadius: 20, borderTopRightRadius: 20,
            padding: '24px 20px 40px', zIndex: 101,
            boxShadow: '0 -4px 20px rgba(0,0,0,0.2)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)' }}>지원 메시지</div>
              <button
                onClick={async () => {
                  setProfileLoading(true);
                  try {
                    const profile = await getProfile();
                    if (profile?.bio) {
                      setApplyMessage(profile.bio);
                    } else {
                      setApplyMessage('__NO_BIO__');
                    }
                  } catch {
                    showToast('프로필을 불러오지 못했어요');
                  } finally {
                    setProfileLoading(false);
                  }
                }}
                disabled={profileLoading}
                style={{
                  fontSize: 12, fontWeight: 700,
                  color: 'var(--accent)', padding: '5px 12px',
                  borderRadius: 8, background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  opacity: profileLoading ? 0.5 : 1,
                }}
              >{profileLoading ? '불러오는 중...' : '내 프로필 가져오기'}</button>
            </div>
            {applyMessage === '__NO_BIO__' && (
              <div style={{
                marginBottom: 12, padding: '12px 14px', borderRadius: 10,
                background: 'rgba(255,107,107,0.07)',
                border: '1px solid rgba(255,107,107,0.18)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
              }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>
                    아직 자기소개가 없어요
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    프로필에서 작성하면 다음엔 바로 채워져요
                  </div>
                </div>
                <button
                  onClick={() => { setShowApplySheet(false); setApplyMessage(''); navigate('/profile'); }}
                  style={{
                    flexShrink: 0, fontSize: 12, fontWeight: 700,
                    color: 'var(--accent-ink)', padding: '6px 12px',
                    borderRadius: 8, background: 'var(--accent)',
                  }}
                >프로필 가기</button>
              </div>
            )}
            <div style={{
              marginBottom: 10, padding: '10px 14px', borderRadius: 10,
              background: 'rgba(255,193,7,0.08)', border: '1px solid rgba(255,193,7,0.3)',
              display: 'flex', gap: 8, alignItems: 'flex-start',
              fontSize: 12, color: '#e6ac00', lineHeight: 1.55,
            }}>
              <span style={{ flexShrink: 0 }}>📞</span>
              <span>연락 가능한 <strong>전화번호 또는 카카오톡 아이디</strong>를 반드시 함께 적어주세요. 미기재 시 연락이 어려울 수 있습니다.</span>
            </div>
            <textarea
              ref={textareaRef}
              value={applyMessage === '__NO_BIO__' ? '' : applyMessage}
              onChange={e => setApplyMessage(e.target.value)}
              placeholder="예) 안녕하세요, B캠 경력 3년차입니다. 카카오톡: rollcrew123"
              style={{
                width: '100%', minHeight: 120, padding: '14px',
                background: 'var(--bg)', border: '1px solid var(--border)',
                borderRadius: 12, fontSize: 14, color: 'var(--text)',
                lineHeight: 1.6, resize: 'none', fontFamily: 'var(--font-sans)',
                marginBottom: 12,
              }}
            />
            <button
              onClick={handleApply}
              disabled={applying}
              style={{
                width: '100%', height: 50, borderRadius: 12, border: 'none',
                background: applying ? 'var(--surface)' : 'var(--accent)',
                color: applying ? 'var(--text-muted)' : 'var(--accent-ink)',
                fontSize: 15, fontWeight: 800, cursor: applying ? 'default' : 'pointer',
                fontFamily: 'var(--font-sans)', letterSpacing: -0.3,
              }}
            >{applying ? '지원 중...' : '지원하기'}</button>
          </div>
        </>
      )}

      {/* 수락 확인 모달 */}
      {confirmApply && (
        <>
          <div
            onClick={() => setConfirmApply(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100, backdropFilter: 'blur(2px)' }}
          />
          <div style={{
            position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
            width: '100%', maxWidth: 480, background: 'var(--surface)',
            borderTopLeftRadius: 20, borderTopRightRadius: 20,
            padding: '24px 20px 40px', zIndex: 101,
            boxShadow: '0 -4px 20px rgba(0,0,0,0.2)',
          }}>
            {/* 헤더 */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>
                {confirmApply.applicantNickname}님을 수락할까요?
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                지원 메시지를 다시 한번 확인해주세요
              </div>
            </div>

            {/* 지원 메시지 */}
            <div style={{
              padding: '14px 16px', borderRadius: 12,
              background: 'var(--bg)', border: '1px solid var(--border)',
              marginBottom: 20,
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8 }}>지원 메시지</div>
              <p style={{
                margin: 0, fontSize: 14, lineHeight: 1.7,
                color: 'var(--text)', whiteSpace: 'pre-line',
              }}>{confirmApply.message || '메시지 없음'}</p>
            </div>

            {/* 버튼 */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setConfirmApply(null)}
                style={{
                  flex: 1, height: 50, borderRadius: 12,
                  border: '1.5px solid var(--border)', background: 'transparent',
                  color: 'var(--text)', fontSize: 15, fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'var(--font-sans)',
                }}
              >취소</button>
              <button
                onClick={() => {
                  handleApplyStatus(confirmApply.applyId, 'ACCEPTED', confirmApply.applicantNickname);
                  setConfirmApply(null);
                }}
                style={{
                  flex: 1, height: 50, borderRadius: 12, border: 'none',
                  background: 'rgba(91,212,166,0.2)', color: 'var(--success)',
                  fontSize: 15, fontWeight: 800, cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                }}
              >수락하기</button>
            </div>
          </div>
        </>
      )}

      {/* 수락 후 마감 여부 모달 */}
      {showCloseModal && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100, backdropFilter: 'blur(2px)' }}
          />
          <div style={{
            position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
            width: '100%', maxWidth: 480, background: 'var(--surface)',
            borderTopLeftRadius: 20, borderTopRightRadius: 20,
            padding: '28px 20px 40px', zIndex: 101,
            boxShadow: '0 -4px 20px rgba(0,0,0,0.2)',
          }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>✅</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)', marginBottom: 6 }}>
                {acceptedName}님을 수락했어요!
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                추가 인원이 필요하신가요?
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setShowCloseModal(false)}
                style={{
                  flex: 1, height: 50, borderRadius: 12, border: '1.5px solid var(--border)',
                  background: 'transparent', color: 'var(--text)',
                  fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sans)',
                }}
              >계속 모집</button>
              <button
                onClick={handleCloseJob}
                style={{
                  flex: 1, height: 50, borderRadius: 12, border: 'none',
                  background: 'var(--accent)', color: 'var(--accent-ink)',
                  fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sans)',
                }}
              >마감하기</button>
            </div>
          </div>
        </>
      )}

      {/* 액션시트 (작성자 전용 — 마감/수정/삭제) */}
      {showActionSheet && (
        <>
          <div
            onClick={() => setShowActionSheet(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100, backdropFilter: 'blur(2px)' }}
          />
          <div style={{
            position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
            width: '100%', maxWidth: 480, background: 'var(--surface)',
            borderTopLeftRadius: 20, borderTopRightRadius: 20,
            padding: '24px 20px 40px', zIndex: 101,
            boxShadow: '0 -4px 20px rgba(0,0,0,0.2)',
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 16 }}>게시글 관리</div>
            {isOpen && !isPastShootingDate(job.shootingDates) && (
              <>
                <button
                  onClick={handleToggleStatus}
                  style={{ width: '100%', padding: '16px', background: 'var(--bg)', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 8, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
                >마감하기</button>
                <button
                  onClick={() => navigate(`/jobs/${jobId}/edit`)}
                  style={{ width: '100%', padding: '16px', background: 'var(--bg)', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 8, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
                >수정하기</button>
              </>
            )}
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
