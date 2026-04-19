// NotificationsPage — 알림 (백엔드 API 없음, UI만 구현)
import Header from '../components/layout/Header';

export default function NotificationsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header />

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }}>
        {/* 제목 */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border)',
        }}>
          <h2 style={{
            fontSize: 18, fontWeight: 800, color: 'var(--text)',
            margin: 0, letterSpacing: -0.3,
          }}>알림</h2>
        </div>

        {/* 알림 미구현 안내 */}
        <div className="empty-state" style={{ paddingTop: 80 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🔔</div>
          <div style={{
            fontSize: 16, fontWeight: 700, color: 'var(--text)',
            marginBottom: 4,
          }}>알림 기능 준비 중</div>
          <div style={{
            fontSize: 13, color: 'var(--text-faint)', lineHeight: 1.6,
          }}>
            곧 댓글, 좋아요, 구인구직 관련<br />
            알림을 받아볼 수 있습니다
          </div>
          <div style={{
            marginTop: 24, padding: '8px 14px', borderRadius: 8,
            background: 'var(--surface)', border: '1px solid var(--border)',
            fontFamily: 'var(--font-mono)', fontSize: 10,
            letterSpacing: 1.5, color: 'var(--text-faint)', fontWeight: 600,
          }}>COMING SOON</div>
        </div>
      </div>
    </div>
  );
}
