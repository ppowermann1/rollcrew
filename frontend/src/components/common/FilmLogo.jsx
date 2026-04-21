// FilmLogo — 필름 스트립 로고 (시안 기반)

export default function FilmLogo() {
  return (
    <div style={{
      width: 36,
      height: 36,
      borderRadius: 8,
      background: 'var(--accent)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* film perforations top */}
      <div style={{
        position: 'absolute', top: 3, left: 3, right: 3,
        display: 'flex', justifyContent: 'space-between',
      }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{
            width: 4, height: 3, borderRadius: 1,
            background: 'var(--accent-ink)', opacity: 0.4,
          }} />
        ))}
      </div>
      {/* film perforations bottom */}
      <div style={{
        position: 'absolute', bottom: 3, left: 3, right: 3,
        display: 'flex', justifyContent: 'space-between',
      }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{
            width: 4, height: 3, borderRadius: 1,
            background: 'var(--accent-ink)', opacity: 0.4,
          }} />
        ))}
      </div>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        fontWeight: 800,
        color: 'var(--accent-ink)',
        letterSpacing: -0.5,
      }}>RC</div>
    </div>
  );
}
