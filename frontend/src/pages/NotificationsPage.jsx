// NotificationsPage — 알림 목록
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import { getNotifications, markAsReadByReference } from '../api/notificationApi';
import { timeAgo } from '../utils/time';

const TYPE_META = {
  JOB_APPLY:         { icon: '📋', label: '새 지원', path: (id) => `/jobs/${id}` },
  JOB_ACCEPTED:      { icon: '✅', label: '지원 수락', path: (id) => `/jobs/${id}` },
  JOB_REJECTED:      { icon: '❌', label: '지원 거절', path: (id) => `/jobs/${id}` },
  COMMUNITY_COMMENT: { icon: '💬', label: '새 댓글', path: (id) => `/posts/${id}` },
};

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [unread, setUnread] = useState([]);
  const [read, setRead] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRead, setShowRead] = useState(false);
  const [readLoading, setReadLoading] = useState(false);
  const [readLoaded, setReadLoaded] = useState(false);

  useEffect(() => {
    getNotifications(true)
      .then(setUnread)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleShowRead = async () => {
    const next = !showRead;
    setShowRead(next);
    if (next && !readLoaded) {
      setReadLoading(true);
      try {
        const all = await getNotifications(false);
        setRead(all.filter(n => n.isRead));
        setReadLoaded(true);
      } catch {/* 무시 */} finally {
        setReadLoading(false);
      }
    }
  };

  const handleClick = async (noti) => {
    if (!noti.isRead) {
      try {
        await markAsReadByReference(noti.referenceId);
        // 같은 referenceId를 가진 미읽음 알림 전부 제거
        const moved = unread.filter(n => n.referenceId === noti.referenceId);
        setUnread(prev => prev.filter(n => n.referenceId !== noti.referenceId));
        if (readLoaded) {
          setRead(prev => [...moved.map(n => ({ ...n, isRead: true })), ...prev]);
        }
      } catch {/* 무시 */}
    }
    const meta = TYPE_META[noti.type];
    if (meta) navigate(meta.path(noti.referenceId));
  };

  const NotiCard = ({ noti }) => {
    const meta = TYPE_META[noti.type] || { icon: '🔔', label: '' };
    return (
      <div
        onClick={() => handleClick(noti)}
        style={{
          padding: '14px 20px',
          borderBottom: '1px solid var(--border)',
          background: noti.isRead ? 'transparent' : 'rgba(255,107,107,0.05)',
          cursor: 'pointer',
          display: 'flex', alignItems: 'flex-start', gap: 12,
        }}
      >
        <div style={{
          width: 40, height: 40, borderRadius: 12, flexShrink: 0,
          background: 'var(--surface)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18,
        }}>{meta.icon}</div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)' }}>
              {meta.label}
            </span>
            {!noti.isRead && (
              <span style={{
                width: 6, height: 6, borderRadius: 3,
                background: 'var(--danger)', flexShrink: 0,
              }} />
            )}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5, marginBottom: 4 }}>
            {noti.message}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>
            {timeAgo(noti.createdAt)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header />

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }}>
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', margin: 0, letterSpacing: -0.3 }}>
            알림
          </h2>
          {unread.length > 0 && (
            <span style={{
              minWidth: 20, height: 20, borderRadius: 10,
              background: 'var(--danger)', color: '#fff',
              fontSize: 11, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '0 6px',
            }}>{unread.length}</span>
          )}
        </div>

        {loading && (
          <div className="flex-center" style={{ padding: 40 }}>
            <div className="spinner" />
          </div>
        )}

        {/* 새 알림 없을 때 */}
        {!loading && unread.length === 0 && (
          <div className="empty-state" style={{ paddingTop: 60 }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>🔔</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
              새 알림이 없습니다
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-faint)' }}>
              지원, 수락, 댓글 알림이 여기에 표시됩니다
            </div>
          </div>
        )}

        {/* 새 알림 목록 */}
        {!loading && unread.map(noti => <NotiCard key={noti.id} noti={noti} />)}

        {/* 확인한 알림 토글 */}
        {!loading && (
          <div>
            <button
              onClick={handleShowRead}
              style={{
                width: '100%', padding: '12px 20px',
                background: 'transparent',
                border: 'none',
                borderBottom: showRead ? 'none' : '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                cursor: 'pointer', fontFamily: 'var(--font-sans)',
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-faint)' }}>
                확인한 알림 보기
              </span>
              <span style={{
                fontSize: 11, color: 'var(--text-faint)',
                display: 'inline-block',
                transition: 'transform 0.2s',
                transform: showRead ? 'rotate(180deg)' : 'rotate(0deg)',
              }}>▼</span>
            </button>

            {showRead && readLoading && (
              <div className="flex-center" style={{ padding: 24 }}>
                <div className="spinner" />
              </div>
            )}
            {showRead && !readLoading && read.map(noti => <NotiCard key={noti.id} noti={noti} />)}
          </div>
        )}
      </div>
    </div>
  );
}
