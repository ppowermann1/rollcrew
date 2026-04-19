// Design System — 촬영 업계 커뮤니티 앱
// 필름/카메라 UI 느낌 · 거친 현장감 · 모노스페이스 라벨 · 프레임 마커

const THEMES = {
  dark: {
    name: 'dark',
    bg: '#0B0B0C',           // 딥 블랙
    bgElevated: '#141416',   // 카드 배경
    bgSunken: '#060607',     // 한 단계 더 깊음
    surface: '#1A1A1D',      // 버튼, 칩
    border: '#26262A',
    borderStrong: '#3A3A40',
    text: '#EDEDEE',
    textMuted: '#8A8A92',
    textFaint: '#55555B',
    accent: '#B47BFF',       // oklch(0.72 0.17 300) 계열 - 보라
    accentInk: '#0B0B0C',
    danger: '#FF6B6B',
    success: '#5BD4A6',
    grain: 0.04,
  },
  light: {
    name: 'light',
    bg: '#F5F4F1',
    bgElevated: '#FFFFFF',
    bgSunken: '#EBE9E4',
    surface: '#F0EEEA',
    border: '#E1DED7',
    borderStrong: '#C9C5BC',
    text: '#0B0B0C',
    textMuted: '#6B6B70',
    textFaint: '#A5A5AB',
    accent: '#7C3FE4',
    accentInk: '#FFFFFF',
    danger: '#D93838',
    success: '#2E8C66',
    grain: 0.025,
  },
};

// 필름 그레인 SVG 데이터 URI
const GRAIN_URI = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.5'/></svg>")`;

// Font stacks
const FONT_SANS = `'Pretendard', 'Pretendard Variable', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Malgun Gothic', system-ui, sans-serif`;
const FONT_MONO = `'JetBrains Mono', 'IBM Plex Mono', 'Roboto Mono', ui-monospace, Menlo, monospace`;
const FONT_DISPLAY = `'Pretendard', -apple-system, 'Apple SD Gothic Neo', system-ui, sans-serif`;

Object.assign(window, { THEMES, GRAIN_URI, FONT_SANS, FONT_MONO, FONT_DISPLAY });
