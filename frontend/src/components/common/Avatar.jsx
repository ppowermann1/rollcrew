// Avatar — 이니셜 기반 아바타 (디자인 시안 기반)

export default function Avatar({ name, size = 36 }) {
  const initial = (name || '?').replace(/[^가-힣A-Za-z]/g, '').slice(0, 2) || '?';
  const hue = (name || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 360;

  return (
    <div style={{
      position: 'relative',
      width: size,
      height: size,
      flexShrink: 0,
    }}>
      <div style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        background: `oklch(0.55 0.08 ${hue})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: 700,
        fontSize: size * 0.38,
        letterSpacing: -0.5,
        fontFamily: 'var(--font-display)',
      }}>
        {initial}
      </div>
    </div>
  );
}
