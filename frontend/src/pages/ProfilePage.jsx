// ProfilePage — 프로필 페이지
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/common/Avatar';
import Header from '../components/layout/Header';
import IconBtn from '../components/common/IconBtn';
import { IconLogout, IconBack } from '../components/common/Icons';
import { getProfile, updateProfile } from '../api/userApi';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const [profile, setProfile] = useState(null);
  const [bio, setBio] = useState('');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    getProfile().then((data) => {
      setProfile(data);
      setBio(data.bio || '');
    });
  }, [isAuthenticated]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updateProfile({ bio });
      setProfile(updated);
      setBio(updated.bio || '');
      setEditing(false);
      showToast('저장됐어요');
    } catch {
      showToast('저장에 실패했어요');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Header />
        <div className="empty-state" style={{ flex: 1 }}>
          <div className="empty-icon">👤</div>
          <div>로그인이 필요합니다</div>
          <button
            onClick={() => navigate('/login')}
            style={{
              marginTop: 12, padding: '10px 28px',
              borderRadius: 10, background: 'var(--accent)',
              color: 'var(--accent-ink)', fontWeight: 700, fontSize: 14,
            }}
          >로그인하기</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header />

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }}>

        {/* bio 없는 유저 — 상단 CTA 배너 */}
        {profile !== null && !profile.bio && !editing && (
          <div
            onClick={() => setEditing(true)}
            style={{
              margin: '16px 20px 0', padding: '14px 16px',
              background: 'rgba(255,107,107,0.08)',
              border: '1px solid rgba(255,107,107,0.22)',
              borderRadius: 14, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 12,
            }}
          >
            <span style={{ fontSize: 22, flexShrink: 0 }}>📋</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--accent)', marginBottom: 2 }}>
                자기소개를 작성해보세요
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                구인구직 지원 시 자동으로 채워져요
              </div>
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)' }}>작성하기 →</span>
          </div>
        )}

        {/* 프로필 카드 */}
        <div style={{
          margin: '20px 20px 0', padding: 24,
          background: 'var(--bg-elevated)', borderRadius: 16,
          border: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
          {/* 아바타 */}
          {profile?.profileImageUrl ? (
            <img
              src={profile.profileImageUrl}
              alt="프로필"
              style={{ width: 72, height: 72, borderRadius: 36, objectFit: 'cover' }}
            />
          ) : (
            <Avatar name={user?.nickname || user?.email} size={72} />
          )}

          <div style={{
            fontSize: 18, fontWeight: 800, color: 'var(--text)',
            marginTop: 14, letterSpacing: -0.3,
          }}>{user?.nickname || '닉네임 없음'}</div>

          <div style={{
            fontSize: 13, color: 'var(--text-muted)', marginTop: 4,
          }}>{user?.email}</div>

          <div style={{
            marginTop: 10, padding: '4px 12px', borderRadius: 8,
            background: 'var(--surface)', fontSize: 11,
            fontWeight: 700, color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)', letterSpacing: 1,
          }}>{user?.role}</div>
        </div>

        {/* 자기소개 */}
        <div style={{
          margin: '16px 20px 0', padding: 20,
          background: 'var(--bg-elevated)', borderRadius: 16,
          border: '1px solid var(--border)',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', marginBottom: 12,
          }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)' }}>
              자기소개
            </span>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                style={{
                  fontSize: 12, fontWeight: 700,
                  color: 'var(--accent)', padding: '4px 10px',
                  borderRadius: 8, background: 'var(--surface)',
                }}
              >편집</button>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => { setEditing(false); setBio(profile?.bio || ''); }}
                  style={{
                    fontSize: 12, fontWeight: 700,
                    color: 'var(--text-muted)', padding: '4px 10px',
                    borderRadius: 8, background: 'var(--surface)',
                  }}
                >취소</button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    fontSize: 12, fontWeight: 700,
                    color: 'var(--accent-ink)', padding: '4px 10px',
                    borderRadius: 8, background: 'var(--accent)',
                    opacity: saving ? 0.6 : 1,
                  }}
                >{saving ? '저장 중' : '저장'}</button>
              </div>
            )}
          </div>

          {editing ? (
            <>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder={"경력 · 보유 장비 · 전문 분야를 적어보세요.\n구인구직 지원 시 이 내용이 자동으로 채워져요."}
                rows={5}
                style={{
                  width: '100%', padding: '12px 14px',
                  background: 'var(--bg-sunken)', borderRadius: 10,
                  border: '1px solid var(--border)',
                  fontSize: 14, lineHeight: 1.6, color: 'var(--text)',
                  resize: 'none',
                }}
              />
            </>
          ) : bio ? (
            <div style={{
              fontSize: 14, color: 'var(--text)',
              lineHeight: 1.65, whiteSpace: 'pre-wrap',
            }}>{bio}</div>
          ) : (
            <div
              onClick={() => setEditing(true)}
              style={{
                padding: '20px 16px', borderRadius: 12,
                background: 'var(--bg-sunken)',
                border: '1.5px dashed var(--border-strong)',
                cursor: 'pointer', textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 22, marginBottom: 8 }}>✏️</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
                자기소개 작성하기
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-faint)', lineHeight: 1.5 }}>
                구인구직 지원 시 자동으로 활용돼요
              </div>
            </div>
          )}
        </div>

        {/* 메뉴 */}
        <div style={{ margin: '16px 20px 0' }}>
          <div style={{
            background: 'var(--bg-elevated)', borderRadius: 12,
            border: '1px solid var(--border)', overflow: 'hidden',
          }}>
            <div
              onClick={() => navigate('/profile/posts')}
              style={{
                padding: '14px 16px',
                display: 'flex', alignItems: 'center', gap: 10,
                cursor: 'pointer',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <span style={{ fontSize: 18 }}>📝</span>
              <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
                내 게시글
              </span>
              <IconBack size={16} color="var(--text-faint)" style={{ transform: 'rotate(180deg)' }} />
            </div>
          </div>
        </div>

        {/* 로그아웃 */}
        <div style={{ margin: '16px 20px 0' }}>
          <button
            id="btn-logout"
            onClick={handleLogout}
            style={{
              width: '100%', padding: '14px', borderRadius: 12,
              background: 'var(--bg-elevated)', border: '1px solid var(--border)',
              color: 'var(--danger)', fontSize: 14, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              cursor: 'pointer',
            }}
          >
            <IconLogout size={18} />
            로그아웃
          </button>
        </div>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
