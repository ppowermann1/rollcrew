// Shared components — 폰 프레임, 상단바, 탭바, 피드 아이템 등

// ─────────────────────────────────────────────────────────────
// Phone frame — 375×812 모바일 뷰포트
// ─────────────────────────────────────────────────────────────
function PhoneFrame({ children, theme, label }) {
  const t = theme;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
      {label && (
        <div style={{
          fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2,
          color: '#888', textTransform: 'uppercase',
        }}>{label}</div>
      )}
      <div style={{
        width: 375, height: 812, borderRadius: 44, position: 'relative',
        background: t.bg, overflow: 'hidden',
        boxShadow: '0 30px 60px rgba(0,0,0,0.35), 0 0 0 10px #0a0a0a, 0 0 0 11px #222',
        fontFamily: FONT_SANS, color: t.text,
      }}>
        {/* film grain overlay */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 100,
          backgroundImage: GRAIN_URI, opacity: t.grain, mixBlendMode: 'overlay',
        }} />
        {/* status bar */}
        <StatusBar theme={t} />
        {/* content */}
        <div style={{ position: 'absolute', inset: 0, paddingTop: 44, display: 'flex', flexDirection: 'column' }}>
          {children}
        </div>
        {/* notch */}
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: 155, height: 28, background: '#000',
          borderBottomLeftRadius: 18, borderBottomRightRadius: 18, zIndex: 110,
        }} />
        {/* home indicator */}
        <div style={{
          position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
          width: 134, height: 5, borderRadius: 100,
          background: t.name === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.35)',
          zIndex: 110,
        }} />
      </div>
    </div>
  );
}

function StatusBar({ theme: t }) {
  const c = t.text;
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: 44, zIndex: 105,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 28px 0 32px', fontFamily: FONT_SANS,
    }}>
      <span style={{ fontWeight: 600, fontSize: 15, color: c, letterSpacing: -0.2 }}>9:41</span>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <svg width="18" height="11" viewBox="0 0 18 11" fill={c}>
          <rect x="0" y="7" width="3" height="4" rx="0.5"/>
          <rect x="4.5" y="5" width="3" height="6" rx="0.5"/>
          <rect x="9" y="2.5" width="3" height="8.5" rx="0.5"/>
          <rect x="13.5" y="0" width="3" height="11" rx="0.5"/>
        </svg>
        <svg width="16" height="11" viewBox="0 0 16 11" fill={c}>
          <path d="M8 2.5c2 0 3.8.8 5.2 2l1-1A9 9 0 008 1a9 9 0 00-6.2 2.5l1 1c1.4-1.2 3.2-2 5.2-2zM8 6c1.2 0 2.2.4 3 1.2l1-1a7 7 0 00-4-1.2 7 7 0 00-4 1.2l1 1c.8-.8 1.8-1.2 3-1.2zM8 10.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12">
          <rect x="0.5" y="0.5" width="21" height="11" rx="2.5" fill="none" stroke={c} strokeOpacity="0.4"/>
          <rect x="2" y="2" width="18" height="8" rx="1.5" fill={c}/>
          <rect x="22.5" y="4" width="1.5" height="4" rx="0.5" fill={c} fillOpacity="0.4"/>
        </svg>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 공용 상단 헤더 (피드용)
// ─────────────────────────────────────────────────────────────
function AppHeader({ theme: t, onToggleTheme, onOpenTweaks }) {
  return (
    <div style={{
      padding: '10px 20px 14px', borderBottom: `1px solid ${t.border}`,
      background: t.bg, position: 'relative', zIndex: 10,
    }}>
      {/* 로고 + 모드 토글 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FilmLogo theme={t} />
          <div>
            <div style={{
              fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 2,
              color: t.textMuted, lineHeight: 1,
            }}>COMMUNITY FOR FILM CREWS</div>
            <div style={{
              fontFamily: FONT_DISPLAY, fontSize: 19, fontWeight: 800,
              letterSpacing: -0.5, color: t.text, lineHeight: 1.1, marginTop: 2,
            }}>셋장<span style={{ color: t.accent }}>.</span></div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <IconBtn theme={t}><IconSearch size={20} /></IconBtn>
          <IconBtn theme={t} onClick={onToggleTheme}>
            {t.name === 'dark' ? <IconSun size={20} /> : <IconMoon size={20} />}
          </IconBtn>
        </div>
      </div>

      {/* 카테고리 가로 칩 */}
      <div style={{
        display: 'flex', gap: 6, overflowX: 'auto', margin: '0 -20px', padding: '0 20px',
        scrollbarWidth: 'none',
      }}>
        <CatChip theme={t} active label="전체" code="ALL" />
        {CATEGORIES.map(c => (
          <CatChip key={c.id} theme={t} label={c.label} code={c.code} />
        ))}
      </div>
    </div>
  );
}

function FilmLogo({ theme: t }) {
  return (
    <div style={{
      width: 36, height: 36, borderRadius: 8,
      background: t.accent, display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* film perforations */}
      <div style={{ position: 'absolute', top: 3, left: 3, right: 3, display: 'flex', justifyContent: 'space-between' }}>
        {[0,1,2,3].map(i => <div key={i} style={{ width: 4, height: 3, borderRadius: 1, background: t.accentInk, opacity: 0.4 }} />)}
      </div>
      <div style={{ position: 'absolute', bottom: 3, left: 3, right: 3, display: 'flex', justifyContent: 'space-between' }}>
        {[0,1,2,3].map(i => <div key={i} style={{ width: 4, height: 3, borderRadius: 1, background: t.accentInk, opacity: 0.4 }} />)}
      </div>
      <div style={{ fontFamily: FONT_MONO, fontSize: 12, fontWeight: 800, color: t.accentInk, letterSpacing: -0.5 }}>SJ</div>
    </div>
  );
}

function IconBtn({ theme: t, children, onClick, active }) {
  return (
    <button onClick={onClick} style={{
      width: 36, height: 36, borderRadius: 10, border: 'none', cursor: 'pointer',
      background: active ? t.accent : t.surface, color: active ? t.accentInk : t.text,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'background 0.15s',
    }}>{children}</button>
  );
}

function CatChip({ theme: t, label, code, active }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      height: 30, padding: '0 12px', borderRadius: 8, whiteSpace: 'nowrap',
      background: active ? t.accent : 'transparent',
      border: active ? 'none' : `1px solid ${t.border}`,
      color: active ? t.accentInk : t.text,
      fontSize: 13, fontWeight: 600,
      flexShrink: 0, cursor: 'pointer',
    }}>
      <span style={{
        fontFamily: FONT_MONO, fontSize: 9, fontWeight: 700, letterSpacing: 1,
        opacity: active ? 0.7 : 0.45,
      }}>{code}</span>
      <span>{label}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 하단 탭바
// ─────────────────────────────────────────────────────────────
function TabBar({ theme: t, active, onNav }) {
  const tabs = [
    { id: 'home', label: '홈',     icon: IconHome,  code: '01' },
    { id: 'board', label: '기능', icon: IconBoard, code: '02' },
    { id: 'noti', label: '알림',    icon: IconBell,  code: '03', badge: 3 },
    { id: 'me',   label: '프로필', icon: IconUser,  code: '04' },
  ];
  return (
    <div style={{
      position: 'relative', borderTop: `1px solid ${t.border}`,
      background: t.bg, paddingBottom: 24, paddingTop: 8,
      display: 'flex', justifyContent: 'space-around',
    }}>
      {/* 촬영 슬레이트 느낌 상단 스트립 */}
      <div style={{
        position: 'absolute', top: -1, left: 20, right: 20, height: 2, display: 'flex',
      }}>
        {[0,1,2,3,4,5,6,7].map(i => (
          <div key={i} style={{ flex: 1, background: i % 2 ? t.text : 'transparent', opacity: 0.15 }} />
        ))}
      </div>
      {tabs.map(tab => {
        const Ic = tab.icon;
        const isActive = active === tab.id;
        return (
          <button key={tab.id} onClick={() => onNav && onNav(tab.id)} style={{
            flex: 1, background: 'transparent', border: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            color: isActive ? t.accent : t.textMuted, padding: '6px 0',
            position: 'relative',
          }}>
            <div style={{ position: 'relative' }}>
              <Ic size={22} sw={isActive ? 2 : 1.6} />
              {tab.badge && (
                <div style={{
                  position: 'absolute', top: -3, right: -6, minWidth: 14, height: 14,
                  borderRadius: 7, background: t.danger, color: '#fff',
                  fontSize: 9, fontWeight: 700, display: 'flex',
                  alignItems: 'center', justifyContent: 'center', padding: '0 4px',
                  border: `1.5px solid ${t.bg}`,
                }}>{tab.badge}</div>
              )}
            </div>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: -0.2 }}>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Image placeholder — 촬영 현장 사진 자리 (줄무늬 + 모노 라벨)
// ─────────────────────────────────────────────────────────────
function ShotPlaceholder({ theme: t, tag, h = 180, hue }) {
  const accentHue = hue ?? 300;
  return (
    <div style={{
      width: '100%', height: h, borderRadius: 6, position: 'relative', overflow: 'hidden',
      background: t.name === 'dark' ? '#18181B' : '#E8E6E0',
    }}>
      {/* diagonal stripes */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `repeating-linear-gradient(135deg, transparent 0 11px, ${t.name === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.035)'} 11px 22px)`,
      }} />
      {/* frame markers — 필름 프레임 모서리 */}
      <Corner pos="tl" color={t.textMuted} />
      <Corner pos="tr" color={t.textMuted} />
      <Corner pos="bl" color={t.textMuted} />
      <Corner pos="br" color={t.textMuted} />
      {/* 중앙 캡션 */}
      <div style={{
        position: 'absolute', inset: 0, display: 'flex',
        alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 6,
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: 14,
          border: `1.5px solid ${t.textMuted}`, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ width: 8, height: 8, borderRadius: 4, background: t.textMuted }} />
        </div>
        <div style={{
          fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1.5,
          color: t.textMuted, fontWeight: 600,
        }}>{tag || 'STILL IMAGE'}</div>
      </div>
      {/* 좌상단 프레임 정보 */}
      <div style={{
        position: 'absolute', top: 8, left: 8, display: 'flex', gap: 4,
        fontFamily: FONT_MONO, fontSize: 9, color: t.textMuted, fontWeight: 600, letterSpacing: 1,
      }}>
        <span>●REC</span>
        <span>16:9</span>
      </div>
      <div style={{
        position: 'absolute', top: 8, right: 8,
        fontFamily: FONT_MONO, fontSize: 9, color: t.textMuted, fontWeight: 600, letterSpacing: 1,
      }}>24fps</div>
    </div>
  );
}

function Corner({ pos, color }) {
  const s = { position: 'absolute', width: 14, height: 14, border: `1.5px solid ${color}` };
  const v = {
    tl: { top: 8, left: 8, borderRight: 'none', borderBottom: 'none' },
    tr: { top: 8, right: 8, borderLeft: 'none', borderBottom: 'none' },
    bl: { bottom: 8, left: 8, borderRight: 'none', borderTop: 'none' },
    br: { bottom: 8, right: 8, borderLeft: 'none', borderTop: 'none' },
  };
  return <div style={{ ...s, ...v[pos] }} />;
}

// ─────────────────────────────────────────────────────────────
// Avatar — 이니셜 + 필름 스트립 프레임
// ─────────────────────────────────────────────────────────────
function Avatar({ theme: t, name, size = 36, verified }) {
  const initial = (name || '?').replace(/[^가-힣A-Za-z]/g, '').slice(0, 2) || '?';
  const hue = (name || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <div style={{
        width: size, height: size, borderRadius: size / 2,
        background: `oklch(0.55 0.08 ${hue})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontWeight: 700, fontSize: size * 0.38, letterSpacing: -0.5,
        fontFamily: FONT_DISPLAY,
      }}>{initial}</div>
      {verified && (
        <div style={{
          position: 'absolute', bottom: -2, right: -2, width: size * 0.42, height: size * 0.42,
          borderRadius: '50%', background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ width: '100%', height: '100%', color: t.accent, display: 'flex' }}>
            <IconVerified size={size * 0.42} stroke={t.accent} fill="none" sw={2.2} />
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, {
  PhoneFrame, StatusBar, AppHeader, IconBtn, CatChip, TabBar, ShotPlaceholder, Avatar, FilmLogo,
});
