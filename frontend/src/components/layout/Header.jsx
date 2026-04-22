// Header — 상단 헤더

import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import FilmLogo from '../common/FilmLogo';
import IconBtn from '../common/IconBtn';
import { IconBell, IconSun, IconMoon } from '../common/Icons';

export default function Header() {
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();

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
        <div
          onClick={() => navigate('/')}
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
        <div style={{ display: 'flex', gap: 6 }}>
          <IconBtn onClick={() => navigate('/notifications')}><IconBell size={20} /></IconBtn>

          <IconBtn onClick={toggle}>
            {theme === 'dark' ? <IconSun size={20} /> : <IconMoon size={20} />}
          </IconBtn>
        </div>
      </div>
    </div>
  );
}
