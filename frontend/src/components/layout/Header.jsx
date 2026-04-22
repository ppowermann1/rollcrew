// Header — 상단 헤더

import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import FilmLogo from '../common/FilmLogo';
import IconBtn from '../common/IconBtn';
import { IconBell, IconSun, IconMoon, IconRefresh } from '../common/Icons';
import { getNotifications } from '../../api/notificationApi';

export default function Header() {
  const { theme, toggle } = useTheme();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [spinning, setSpinning] = useState(false);

  const handleRefresh = () => {
    if (spinning) return;
    setSpinning(true);
    setTimeout(() => setSpinning(false), 500);
    if (isAuthenticated) {
      getNotifications(true)
        .then(data => setUnreadCount((data || []).length))
        .catch(() => {});
    }
    if (location.pathname === '/') {
      navigate('/', { state: { refreshAt: Date.now() } });
    } else {
      navigate('/');
    }
  };
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) return;
    getNotifications(true)
      .then(data => setUnreadCount((data || []).length))
      .catch(() => {});
  }, [isAuthenticated]);

  return (
    <div style={{
      padding: '12px 20px 0',
      background: 'var(--bg)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            onClick={() => location.pathname === '/'
              ? navigate('/', { state: { refreshAt: Date.now() } })
              : navigate('/')
            }
            style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer' }}
          >
            <FilmLogo />
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 20,
              fontWeight: 800,
              letterSpacing: -0.6,
              color: 'var(--text)',
            }}>
              롤크루<span style={{ color: 'var(--accent)' }}>.</span>
            </div>
          </div>
          <div
            onClick={handleRefresh}
            style={{
              cursor: 'pointer',
              color: 'var(--text-faint)',
              display: 'flex', alignItems: 'center',
              transform: spinning ? 'rotate(360deg)' : 'rotate(0deg)',
              transition: spinning ? 'transform 0.5s ease' : 'none',
            }}
          >
            <IconRefresh size={20} sw={2} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ position: 'relative' }}>
            <IconBtn onClick={() => navigate('/notifications')}><IconBell size={20} /></IconBtn>
            {unreadCount > 0 && (
              <div style={{
                position: 'absolute', top: -3, right: -3,
                minWidth: 14, height: 14, borderRadius: 7,
                background: 'var(--danger)', color: '#fff',
                fontSize: 9, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '0 4px', border: '1.5px solid var(--bg)',
                pointerEvents: 'none',
              }}>{unreadCount}</div>
            )}
          </div>

          <IconBtn onClick={toggle}>
            {theme === 'dark' ? <IconSun size={20} /> : <IconMoon size={20} />}
          </IconBtn>
        </div>
      </div>
    </div>
  );
}
