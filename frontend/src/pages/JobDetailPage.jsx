// JobDetailPage — 구인구직 상세 화면
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import IconBtn from '../components/common/IconBtn';
import { IconBack, IconMore } from '../components/common/Icons';
import { getJobPosting, deleteJobPosting, updateJobPosting, createApply, getApplies, updateApplyStatus, cancelApply } from '../api/jobApi';
import { getProfile } from '../api/userApi';
import { useAuth } from '../context/AuthContext';

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
    if (!myApply || !window.confirm('지원을 취소하시겠습니까?')) return;
    try {
      await cancelApply(myApply.applyId);
      setMyApply(null);
      showToast('지원이 취소되었습니다');
    } catch {
      showToast('지원 취소에 실패했습니다.');
    }
  };

  const handleApplyStatus = async (applyId, status) => {
    try {
      const updated = await updateApplyStatus(applyId, status);
      setApplicants(prev => prev.map(a => a.applyId === applyId ? updated : a));
    } catch {
      showToast('상태 변경에 실패했습니다.');
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
          <IconBtn onClick={() => navigate('/', { state: { tab: 'job' } })}><IconBack size={20} /></IconBtn>
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
        <IconBtn onClick={() => navigate('/', { state: { tab: 'job' } })}><IconBack size={20} /></IconBtn>
        <div style={{ flex: 1, textAlign: 'center', fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>구인구직</div>
        {isAuthor
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

          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px',
            background: 'var(--bg-sunken)', borderRadius: 10,
          }}>
            <div style={{ fontSize: 20 }}>📅</div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>촬영 일정</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{job.shootingDates}</div>
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

        {/* 지원 방법 안내 (비작성자만) */}
        {!isAuthor && (
          <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)' }}>
            <div style={{
              padding: '14px 16px', borderRadius: 12,
              background: 'var(--bg-sunken)', border: '1px solid var(--border)',
              fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6,
            }}>
              <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>지원 방법</div>
              아래 지원하기 버튼을 눌러 메시지와 함께 지원해주세요.
            </div>
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
                      margin: `0 0 ${a.status === 'PENDING' ? 10 : 0}px`,
                      fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.55,
                    }}>{a.message}</p>
                  )}

                  {/* 수락/거절 버튼 — PENDING일 때만 */}
                  {a.status === 'PENDING' && (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => handleApplyStatus(a.applyId, 'ACCEPTED')}
                        style={{
                          flex: 1, height: 36, borderRadius: 8, border: 'none',
                          background: 'rgba(91,212,166,0.13)', color: 'var(--success)',
                          fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sans)',
                        }}
                      >수락</button>
                      <button
                        onClick={() => handleApplyStatus(a.applyId, 'REJECTED')}
                        style={{
                          flex: 1, height: 36, borderRadius: 8, border: 'none',
                          background: 'rgba(255,107,107,0.1)', color: 'var(--danger)',
                          fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sans)',
                        }}
                      >거절</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* 하단 지원하기 버튼 (비작성자) */}
      {!isAuthor && (
        <div style={{
          padding: '12px 16px', borderTop: '1px solid var(--border)',
          background: 'var(--bg)',
          position: 'fixed', bottom: 0,
          left: '50%', transform: 'translateX(-50%)',
          width: '100%', maxWidth: 480,
        }}>
          {myApply ? (
            <button
              onClick={handleCancelApply}
              style={{
                width: '100%', height: 50, borderRadius: 12,
                border: '1.5px solid var(--border)', background: 'transparent',
                color: 'var(--text-muted)', fontSize: 15, fontWeight: 800,
                cursor: 'pointer', fontFamily: 'var(--font-sans)', letterSpacing: -0.3,
              }}
            >지원 취소</button>
          ) : (
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
          )}
        </div>
      )}

      {/* 토스트 */}
      {toast && <div className="toast">{toast}</div>}

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
            <textarea
              ref={textareaRef}
              value={applyMessage === '__NO_BIO__' ? '' : applyMessage}
              onChange={e => setApplyMessage(e.target.value)}
              placeholder="포트폴리오 링크나 간단한 소개를 입력해주세요 (선택)"
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
