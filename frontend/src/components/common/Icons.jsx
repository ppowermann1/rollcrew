// Minimal icon set — stroke-based SVG components
// Ported from design mockup ui/project/icons.jsx

const Icon = ({ path, size = 24, stroke = 'currentColor', fill = 'none', sw = 1.75, children, className, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke={stroke}
    strokeWidth={sw}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={{ flexShrink: 0, display: 'block', ...style }}
  >
    {children || <path d={path} />}
  </svg>
);

export const IconHome = (p) => <Icon {...p}><path d="M3 11L12 4l9 7"/><path d="M5 10v10h14V10"/></Icon>;
export const IconBoard = (p) => <Icon {...p}><rect x="3.5" y="4.5" width="17" height="15" rx="1.5"/><path d="M3.5 9.5h17M8 4.5v15"/></Icon>;
export const IconBell = (p) => <Icon {...p}><path d="M6 10a6 6 0 0112 0v4l1.5 3h-15L6 14z"/><path d="M10 20a2 2 0 004 0"/></Icon>;
export const IconUser = (p) => <Icon {...p}><circle cx="12" cy="8" r="4"/><path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6"/></Icon>;
export const IconSearch = (p) => <Icon {...p}><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4 4"/></Icon>;
export const IconBack = (p) => <Icon {...p}><path d="M15 5l-7 7 7 7"/></Icon>;
export const IconMore = (p) => <Icon {...p}><circle cx="5" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none"/></Icon>;
export const IconHeart = (p) => <Icon {...p}><path d="M12 20s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 10c0 5.5-7 10-7 10z"/></Icon>;
export const IconHeartFill = (p) => <Icon {...p} fill="currentColor" sw={0}><path d="M12 20s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 10c0 5.5-7 10-7 10z"/></Icon>;
export const IconComment = (p) => <Icon {...p}><path d="M4 5h16v11h-8l-4 3v-3H4z"/></Icon>;
export const IconBookmark = (p) => <Icon {...p}><path d="M6 4h12v17l-6-4-6 4z"/></Icon>;
export const IconShare = (p) => <Icon {...p}><path d="M8 12l8-5M8 12l8 5"/><circle cx="6" cy="12" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="18" cy="18" r="2"/></Icon>;
export const IconPlus = (p) => <Icon {...p}><path d="M12 5v14M5 12h14"/></Icon>;
export const IconSun = (p) => <Icon {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/></Icon>;
export const IconMoon = (p) => <Icon {...p}><path d="M20 14A8 8 0 019 4a8 8 0 1011 10z"/></Icon>;
export const IconCamera = (p) => <Icon {...p}><path d="M4 7h3l2-2h6l2 2h3v12H4z"/><circle cx="12" cy="13" r="3.5"/></Icon>;
export const IconThumbUp = (p) => <Icon {...p}><path d="M7 22V11M2 13v7a2 2 0 002 2h11.5a2 2 0 002-1.9l1-9a2 2 0 00-2-2.1H14V5a3 3 0 00-3-3l-4 9z"/></Icon>;
export const IconThumbDown = (p) => <Icon {...p}><path d="M17 2v11M22 11V4a2 2 0 00-2-2H8.5a2 2 0 00-2 1.9l-1 9a2 2 0 002 2.1H10v3a3 3 0 003 3l4-9z"/></Icon>;
export const IconCheck = (p) => <Icon {...p}><path d="M5 12l5 5 9-11"/></Icon>;
export const IconClose = (p) => <Icon {...p}><path d="M6 6l12 12M18 6L6 18"/></Icon>;
export const IconFire = (p) => <Icon {...p}><path d="M12 3c0 4-5 5-5 10a5 5 0 0010 0c0-2-1-3-2-4 2 0 3 2 3 4a6 6 0 01-12 0C6 8 12 7 12 3z"/></Icon>;
export const IconFilter = (p) => <Icon {...p}><path d="M3 5h18l-7 8v6l-4 2v-8z"/></Icon>;
export const IconDice = (p) => <Icon {...p}><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1.5" fill="currentColor" stroke="none"/><circle cx="16" cy="8" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="8" cy="16" r="1.5" fill="currentColor" stroke="none"/><circle cx="16" cy="16" r="1.5" fill="currentColor" stroke="none"/></Icon>;
export const IconEdit = (p) => <Icon {...p}><path d="M15.232 5.232l3.536 3.536M9 13l-2 6 6-2 9.5-9.5a2.5 2.5 0 00-3.536-3.536L9 13z"/></Icon>;
export const IconLogout = (p) => <Icon {...p}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></Icon>;
export const IconGoogle = (p) => (
  <svg width={p.size || 24} height={p.size || 24} viewBox="0 0 24 24" style={{ flexShrink: 0, display: 'block' }}>
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09a6.96 6.96 0 010-4.17V7.07H2.18a11.01 11.01 0 000 9.86l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);
