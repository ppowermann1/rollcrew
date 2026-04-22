// LoginPage — 로그인 페이지
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BackBtn from '../components/common/BackBtn';
import FilmLogo from '../components/common/FilmLogo';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  // 이미 로그인된 경우 홈으로
  if (isAuthenticated) {
    navigate('/');
    return null;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* 헤더 */}
      <div style={{
        display: 'flex', alignItems: 'center', padding: '10px 16px',
        borderBottom: '1px solid var(--border)',
      }}>
        <BackBtn onClick={() => navigate(-1)} />
      </div>

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: 40,
      }}>
        {/* 로고 */}
        <div style={{ marginBottom: 24 }}>
          <FilmLogo />
        </div>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800,
          letterSpacing: -1, color: 'var(--text)', marginBottom: 8,
        }}>
          롤크루<span style={{ color: 'var(--accent)' }}>.</span>
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: 2,
          color: 'var(--text-muted)', marginBottom: 48,
        }}>촬영 업계 커뮤니티</div>

        {/* 로그인 버튼 */}
        <div style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button
            id="btn-naver-login"
            onClick={() => login('naver')}
            style={{
              width: '100%', height: 52, borderRadius: 12,
              border: 'none', background: '#03C75A', color: '#ffffff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
              fontSize: 14, fontWeight: 700, cursor: 'pointer',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffffff">
              <path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z"/>
            </svg>
            네이버로 로그인하기
          </button>

          <button
            id="btn-kakao-login"
            onClick={() => login('kakao')}
            style={{
              width: '100%', height: 52, borderRadius: 12,
              border: 'none', background: '#FEE500', color: '#191919',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
              fontSize: 14, fontWeight: 700, cursor: 'pointer',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#191919">
              <path d="M12 3c-5.5 0-10 3.8-10 8.5 0 2.7 1.4 5.2 3.8 6.7-.2 1.3-1 3.5-1 3.8 0 .2.2.3.4.2 1.3-.8 4.2-2.7 4.2-2.7 1 .3 2 .4 3 .4 5.5 0 10-3.8 10-8.5S17.5 3 12 3z"/>
            </svg>
            카카오로 로그인하기
          </button>
        </div>

        <div style={{
          marginTop: 20, fontSize: 12, color: 'var(--text-faint)',
          textAlign: 'center', lineHeight: 1.6,
        }}>
          로그인하면 게시글 작성, 좋아요, 댓글 등<br />
          모든 기능을 이용할 수 있습니다
        </div>
      </div>
    </div>
  );
}
