// ShotPlaceholder — 촬영 현장 이미지 자리

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

export default function ShotPlaceholder({ tag, h = 180, imageUrl }) {
  if (imageUrl) {
    return (
      <div style={{
        width: '100%', height: h, borderRadius: 6,
        overflow: 'hidden', position: 'relative',
      }}>
        <img
          src={imageUrl}
          alt={tag || 'image'}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      </div>
    );
  }

  return (
    <div style={{
      width: '100%', height: h, borderRadius: 6,
      position: 'relative', overflow: 'hidden',
      background: 'var(--bg-sunken)',
    }}>
      {/* diagonal stripes */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'repeating-linear-gradient(135deg, transparent 0 11px, rgba(255,255,255,0.03) 11px 22px)',
      }} />
      <Corner pos="tl" color="var(--text-muted)" />
      <Corner pos="tr" color="var(--text-muted)" />
      <Corner pos="bl" color="var(--text-muted)" />
      <Corner pos="br" color="var(--text-muted)" />
      {/* center caption */}
      <div style={{
        position: 'absolute', inset: 0, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 6,
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: 14,
          border: '1.5px solid var(--text-muted)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: 4,
            background: 'var(--text-muted)',
          }} />
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 10,
          letterSpacing: 1.5, color: 'var(--text-muted)', fontWeight: 600,
        }}>{tag || 'STILL IMAGE'}</div>
      </div>
      {/* top-left frame info */}
      <div style={{
        position: 'absolute', top: 8, left: 8, display: 'flex', gap: 4,
        fontFamily: 'var(--font-mono)', fontSize: 9,
        color: 'var(--text-muted)', fontWeight: 600, letterSpacing: 1,
      }}>
        <span>●REC</span>
        <span>16:9</span>
      </div>
      <div style={{
        position: 'absolute', top: 8, right: 8,
        fontFamily: 'var(--font-mono)', fontSize: 9,
        color: 'var(--text-muted)', fontWeight: 600, letterSpacing: 1,
      }}>24fps</div>
    </div>
  );
}
