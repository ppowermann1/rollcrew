// FeaturesPage — 기능 탭
import Header from '../components/layout/Header';

const FEATURES = [
  {
    id: 'estimate',
    icon: '📄',
    title: '견적서 작성',
    desc: '촬영 견적서를 빠르게 작성하고 공유해보세요',
    url: 'https://tltgogo.netlify.app',
    comingSoon: false,
  },
  {
    id: 'suggestion',
    icon: '💬',
    title: '건의하기',
    desc: '서비스 개선 아이디어나 불편한 점을 알려주세요',
    url: 'https://forms.gle/EKPareSpthrkLefM6',
    comingSoon: false,
  },
];

export default function FeaturesPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header />

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }}>
        <div style={{ padding: '20px 20px 8px' }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', letterSpacing: -0.4 }}>
            기능
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            롤크루에서 제공하는 도구들
          </div>
        </div>

        <div style={{ padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {FEATURES.map(f => (
            <button
              key={f.id}
              onClick={() => !f.comingSoon && f.url && window.open(f.url, '_blank')}
              style={{
                width: '100%', padding: '18px 20px',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: 16,
                cursor: f.comingSoon ? 'default' : 'pointer',
                display: 'flex', alignItems: 'center', gap: 16,
                textAlign: 'left',
                opacity: f.comingSoon ? 0.6 : 1,
              }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                background: 'rgba(255,107,107,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24,
              }}>{f.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: 15, fontWeight: 800, color: 'var(--text)',
                  letterSpacing: -0.3, marginBottom: 4,
                }}>{f.title}</div>
                <div style={{
                  fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5,
                }}>{f.desc}</div>
              </div>
              <div style={{ flexShrink: 0 }}>
                {f.comingSoon ? (
                  <span style={{
                    fontSize: 11, fontWeight: 700,
                    color: 'var(--text-faint)',
                    padding: '4px 8px', borderRadius: 6,
                    background: 'var(--surface)',
                  }}>Coming Soon</span>
                ) : (
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)' }}>열기 →</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
