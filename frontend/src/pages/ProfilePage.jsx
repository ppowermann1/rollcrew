// ProfilePage — 프로필 페이지
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/common/Avatar';
import Header from '../components/layout/Header';
import { IconLogout, IconBack } from '../components/common/Icons';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Header />
        <div className="empty-state" style={{ flex: 1 }}>
          <div className="empty-icon">👤</div>
          <div>로그인이 필요합니다</div>
          <button
            onClick={() => navigate('/login')}
            style={{
              marginTop: 12, padding: '10px 28px',
              borderRadius: 10, background: 'var(--accent)',
              color: 'var(--accent-ink)', fontWeight: 700, fontSize: 14,
            }}
          >로그인하기</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header />

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }}>
        {/* 프로필 카드 */}
        <div style={{
          margin: '20px 20px 0', padding: 24,
          background: 'var(--bg-elevated)', borderRadius: 16,
          border: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
          <Avatar name={user.nickname || user.email} size={64} />
          <div style={{
            fontSize: 18, fontWeight: 800, color: 'var(--text)',
            marginTop: 16, letterSpacing: -0.3,
          }}>{user.nickname || '닉네임 없음'}</div>
          <div style={{
            fontSize: 13, color: 'var(--text-muted)', marginTop: 4,
          }}>{user.email}</div>
          <div style={{
            marginTop: 10, padding: '4px 12px', borderRadius: 8,
            background: 'var(--surface)', fontSize: 11,
            fontWeight: 700, color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)', letterSpacing: 1,
          }}>{user.role}</div>
        </div>

        {/* 메뉴 */}
        <div style={{ margin: '16px 20px 0' }}>
          <div style={{
            background: 'var(--bg-elevated)', borderRadius: 12,
            border: '1px solid var(--border)', overflow: 'hidden',
          }}>
            <div
              onClick={() => navigate('/profile/posts')}
              style={{
                padding: '14px 16px',
                display: 'flex', alignItems: 'center', gap: 10,
                cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: 18 }}>📝</span>
              <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
                내 게시글
              </span>
              <IconBack size={16} color="var(--text-faint)" style={{ transform: 'rotate(180deg)' }} />
            </div>
          </div>
        </div>

        {/* 로그아웃 */}
        <div style={{ margin: '16px 20px 0' }}>
          <button
            id="btn-logout"
            onClick={handleLogout}
            style={{
              width: '100%', padding: '14px', borderRadius: 12,
              background: 'var(--bg-elevated)', border: '1px solid var(--border)',
              color: 'var(--danger)', fontSize: 14, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              cursor: 'pointer',
              transition: 'background var(--transition-fast)',
            }}
          >
            <IconLogout size={18} />
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}
