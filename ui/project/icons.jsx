// Minimal icon set — stroke 1.5, size 24 unless overridden
const Icon = ({ path, size = 24, stroke = 'currentColor', fill = 'none', sw = 1.75, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
       strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
       style={{ flexShrink: 0, display: 'block' }}>
    {children || <path d={path} />}
  </svg>
);

const IconHome = (p) => <Icon {...p}><path d="M3 11L12 4l9 7"/><path d="M5 10v10h14V10"/></Icon>;
const IconBoard = (p) => <Icon {...p}><rect x="3.5" y="4.5" width="17" height="15" rx="1.5"/><path d="M3.5 9.5h17M8 4.5v15"/></Icon>;
const IconBell = (p) => <Icon {...p}><path d="M6 10a6 6 0 0112 0v4l1.5 3h-15L6 14z"/><path d="M10 20a2 2 0 004 0"/></Icon>;
const IconUser = (p) => <Icon {...p}><circle cx="12" cy="8" r="4"/><path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6"/></Icon>;
const IconSearch = (p) => <Icon {...p}><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4 4"/></Icon>;
const IconBack = (p) => <Icon {...p}><path d="M15 5l-7 7 7 7"/></Icon>;
const IconMore = (p) => <Icon {...p}><circle cx="5" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none"/></Icon>;
const IconHeart = (p) => <Icon {...p}><path d="M12 20s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 10c0 5.5-7 10-7 10z"/></Icon>;
const IconHeartFill = (p) => <Icon {...p} fill="currentColor" sw={0}><path d="M12 20s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 10c0 5.5-7 10-7 10z"/></Icon>;
const IconComment = (p) => <Icon {...p}><path d="M4 5h16v11h-8l-4 3v-3H4z"/></Icon>;
const IconBookmark = (p) => <Icon {...p}><path d="M6 4h12v17l-6-4-6 4z"/></Icon>;
const IconShare = (p) => <Icon {...p}><path d="M8 12l8-5M8 12l8 5"/><circle cx="6" cy="12" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="18" cy="18" r="2"/></Icon>;
const IconPlus = (p) => <Icon {...p}><path d="M12 5v14M5 12h14"/></Icon>;
const IconSun = (p) => <Icon {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/></Icon>;
const IconMoon = (p) => <Icon {...p}><path d="M20 14A8 8 0 019 4a8 8 0 1011 10z"/></Icon>;
const IconCamera = (p) => <Icon {...p}><path d="M4 7h3l2-2h6l2 2h3v12H4z"/><circle cx="12" cy="13" r="3.5"/></Icon>;
const IconChip = (p) => <Icon {...p}><rect x="5" y="5" width="14" height="14" rx="2"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/></Icon>;
const IconBriefcase = (p) => <Icon {...p}><rect x="3" y="7" width="18" height="13" rx="1.5"/><path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2"/><path d="M3 13h18"/></Icon>;
const IconChat = (p) => <Icon {...p}><path d="M3 5h18v12H8l-5 4z"/></Icon>;
const IconCheck = (p) => <Icon {...p}><path d="M5 12l5 5 9-11"/></Icon>;
const IconVerified = (p) => <Icon {...p}><path d="M12 2l2.3 1.6 2.8-.3 1.3 2.5 2.4 1.5-.4 2.8L22 12l-1.6 2-.3 2.8-2.5 1.2-1.5 2.4-2.8-.4L12 22l-2-1.6-2.8.3-1.2-2.5-2.4-1.5.4-2.8L2 12l1.6-2 .3-2.8 2.5-1.3L7.9 3.4l2.8.4z"/><path d="M8 12l3 3 5-6"/></Icon>;
const IconPin = (p) => <Icon {...p}><path d="M16 3l5 5-4 2-5 5 1 4-2 1-7-7 1-2 4 1 5-5z"/></Icon>;
const IconFire = (p) => <Icon {...p}><path d="M12 3c0 4-5 5-5 10a5 5 0 0010 0c0-2-1-3-2-4 2 0 3 2 3 4a6 6 0 01-12 0C6 8 12 7 12 3z"/></Icon>;
const IconEye = (p) => <Icon {...p}><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></Icon>;
const IconGrid = (p) => <Icon {...p}><rect x="3.5" y="3.5" width="7" height="7"/><rect x="13.5" y="3.5" width="7" height="7"/><rect x="3.5" y="13.5" width="7" height="7"/><rect x="13.5" y="13.5" width="7" height="7"/></Icon>;
const IconList = (p) => <Icon {...p}><path d="M4 6h16M4 12h16M4 18h16"/></Icon>;
const IconFilter = (p) => <Icon {...p}><path d="M3 5h18l-7 8v6l-4 2v-8z"/></Icon>;
const IconClose = (p) => <Icon {...p}><path d="M6 6l12 12M18 6L6 18"/></Icon>;
const IconThumbUp = (p) => <Icon {...p}><path d="M7 22V11M2 13v7a2 2 0 002 2h11.5a2 2 0 002-1.9l1-9a2 2 0 00-2-2.1H14V5a3 3 0 00-3-3l-4 9z"/></Icon>;
const IconThumbDown = (p) => <Icon {...p}><path d="M17 2v11M22 11V4a2 2 0 00-2-2H8.5a2 2 0 00-2 1.9l-1 9a2 2 0 002 2.1H10v3a3 3 0 003 3l4-9z"/></Icon>;

Object.assign(window, {
  IconHome, IconBoard, IconBell, IconUser, IconSearch, IconBack, IconMore,
  IconHeart, IconHeartFill, IconComment, IconBookmark, IconShare, IconPlus,
  IconSun, IconMoon, IconCamera, IconChip, IconBriefcase, IconChat, IconCheck,
  IconVerified, IconPin, IconFire, IconEye, IconGrid, IconList, IconFilter, IconClose,
  IconThumbUp, IconThumbDown,
});
