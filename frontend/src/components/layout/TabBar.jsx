// TabBar — 하단 네비게이션 (시안 기반)
import { useLocation, useNavigate } from 'react-router-dom';
import { IconHome, IconBoard, IconEdit, IconUser } from '../common/Icons';

const tabs = [
  { id: 'home',  path: '/',              label: '홈',       icon: IconHome },
  { id: 'board', path: '/features',      label: '기능',     icon: IconBoard },
  { id: 'myposts', path: '/profile/posts', label: '내 게시글', icon: IconEdit },
  { id: 'me',    path: '/profile',       label: '프로필',   icon: IconUser },
];

export default function TabBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const getActiveTab = () => {
    if (location.pathname.startsWith('/profile/posts')) return 'myposts';
    if (location.pathname.startsWith('/profile')) return 'me';
    if (location.pathname === '/features') return 'board';
    return 'home';
  };

  const active = getActiveTab();

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: 480,
      borderTop: '1px solid var(--border)',
      background: 'var(--bg)',
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      paddingTop: 8,
      display: 'flex',
      justifyContent: 'space-around',
      zIndex: 100,
    }}>
      {/* 촬영 슬레이트 느낌 상단 스트립 */}
      <div style={{
        position: 'absolute', top: -1, left: 20, right: 20, height: 2, display: 'flex',
      }}>
        {[0,1,2,3,4,5,6,7].map(i => (
          <div key={i} style={{
            flex: 1,
            background: i % 2 ? 'var(--text)' : 'transparent',
            opacity: 0.15,
          }} />
        ))}
      </div>

      {tabs.map(tab => {
        const Ic = tab.icon;
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            onClick={() => navigate(tab.path)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              color: isActive ? 'var(--accent)' : 'var(--text-muted)',
              padding: '6px 0 8px',
              position: 'relative',
            }}
          >
            <div style={{ position: 'relative' }}>
              <Ic size={22} sw={isActive ? 2 : 1.6} />
              {tab.badge && (
                <div style={{
                  position: 'absolute', top: -3, right: -6,
                  minWidth: 14, height: 14, borderRadius: 7,
                  background: 'var(--danger)', color: '#fff',
                  fontSize: 9, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '0 4px',
                  border: '1.5px solid var(--bg)',
                }}>{tab.badge}</div>
              )}
            </div>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: -0.2 }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
