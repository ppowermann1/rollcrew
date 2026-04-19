// 구인구직 상세 화면 — JobPostingResponse 기반

function JobDetailScreen({ job, theme: t, onBack }) {
  const cat = JOB_CATEGORIES.find(c => c.id === job.category) || JOB_CATEGORIES[0];
  const isOpen = job.status === 'OPEN';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: t.bg }}>
      {/* 상단 nav */}
      <div style={{
        display: 'flex', alignItems: 'center', padding: '10px 16px',
        borderBottom: `1px solid ${t.border}`,
      }}>
        <IconBtn theme={t} onClick={onBack}><IconBack size={20} /></IconBtn>
        <div style={{ flex: 1, textAlign: 'center', fontSize: 14, fontWeight: 700, color: t.text }}>구인구직</div>
        <IconBtn theme={t}><IconMore size={20} /></IconBtn>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* 헤더 정보 */}
        <div style={{ padding: '20px 20px 18px', borderBottom: `1px solid ${t.border}` }}>
          {/* 상태 배지 */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
            <div style={{
              padding: '4px 10px', borderRadius: 6,
              background: isOpen ? `${t.success}22` : t.surface,
              color: isOpen ? t.success : t.textMuted,
              fontSize: 12, fontWeight: 700,
            }}>{isOpen ? '● 모집중' : '마감'}</div>
            <div style={{
              padding: '4px 10px', borderRadius: 6,
              background: `oklch(${t.name==='dark'?'0.22':'0.94'} 0.05 ${cat.hue})`,
              color: `oklch(${t.name==='dark'?'0.75':'0.45'} 0.12 ${cat.hue})`,
              fontSize: 12, fontWeight: 700,
            }}>{cat.label}</div>
          </div>

          <h1 style={{
            margin: '0 0 16px', fontSize: 20, fontWeight: 800,
            lineHeight: 1.35, letterSpacing: -0.5, color: t.text,
          }}>{job.title}</h1>

          {/* 촬영일 */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px',
            background: t.bgSunken, borderRadius: 10,
          }}>
            <div style={{ fontSize: 20 }}>📅</div>
            <div>
              <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 2 }}>촬영 일정</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: t.text }}>{job.shootingDates}</div>
            </div>
          </div>
        </div>

        {/* 본문 */}
        <div style={{ padding: '18px 20px', borderBottom: `1px solid ${t.border}` }}>
          <p style={{
            margin: 0, fontSize: 14.5, lineHeight: 1.75,
            color: t.text, letterSpacing: -0.2, whiteSpace: 'pre-line',
          }}>{job.content}</p>
        </div>

        {/* 지원하기 안내 */}
        <div style={{ padding: '18px 20px' }}>
          <div style={{
            padding: '14px 16px', borderRadius: 12,
            background: t.bgSunken, border: `1px solid ${t.border}`,
            fontSize: 13, color: t.textMuted, lineHeight: 1.6,
          }}>
            <div style={{ fontWeight: 700, color: t.text, marginBottom: 4 }}>지원 방법</div>
            DM 또는 댓글로 포트폴리오와 간단한 소개를 남겨주세요.
          </div>
        </div>
      </div>

      {/* 지원하기 버튼 */}
      <div style={{ padding: '12px 16px', borderTop: `1px solid ${t.border}`, background: t.bg }}>
        <button style={{
          width: '100%', height: 50, borderRadius: 12, border: 'none',
          background: isOpen ? t.accent : t.surface,
          color: isOpen ? t.accentInk : t.textMuted,
          fontSize: 15, fontWeight: 800, cursor: isOpen ? 'pointer' : 'default',
          fontFamily: FONT_SANS, letterSpacing: -0.3,
        }}>{isOpen ? '지원하기' : '마감된 공고입니다'}</button>
      </div>
    </div>
  );
}

Object.assign(window, { JobDetailScreen });
