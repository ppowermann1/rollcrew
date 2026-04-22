// DevLoginPanel — 로컬 개발 전용 테스트 로그인 패널
import { useState, useEffect } from 'react';
import client from '../../api/client';
import { useAuth } from '../../context/AuthContext';

const isDev = import.meta.env.DEV;

export default function DevLoginPanel() {
  const { loginWithToken } = useAuth();
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isDev) return;
    client.get('/api/test/users')
      .then(res => setUsers(res.data.data || []))
      .catch(() => {});
  }, []);

  if (!isDev) return null;

  const handleLogin = async (nickname) => {
    try {
      const res = await client.post(`/api/test/login?nickname=${encodeURIComponent(nickname)}`);
      const token = res.data.data;
      await loginWithToken(token);
      setOpen(false);
    } catch (e) {
      alert('테스트 로그인 실패: ' + nickname);
    }
  };

  return (
    <div style={{
      position: 'fixed', bottom: 90, left: 16, zIndex: 9999,
    }}>
      {open && (
        <div style={{
          marginBottom: 8,
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border)',
          borderRadius: 14,
          padding: '10px 8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          minWidth: 160,
        }}>
          <div style={{
            fontSize: 10, fontWeight: 700, color: 'var(--text-faint)',
            letterSpacing: 0.5, padding: '0 6px 8px',
            borderBottom: '1px solid var(--border)', marginBottom: 6,
          }}>DEV — 테스트 계정</div>
          {users.map(u => (
            <button
              key={u.id}
              onClick={() => handleLogin(u.nickname)}
              style={{
                display: 'block', width: '100%',
                padding: '7px 10px', textAlign: 'left',
                background: 'transparent', border: 'none',
                borderRadius: 8, cursor: 'pointer',
                fontSize: 13, fontWeight: 600, color: 'var(--text)',
                fontFamily: 'var(--font-sans)',
              }}
            >
              {u.nickname}
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: 44, height: 44, borderRadius: '50%',
          background: '#ff6b6b', border: 'none',
          fontSize: 18, cursor: 'pointer',
          boxShadow: '0 2px 10px rgba(255,107,107,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
        title="DEV 로그인"
      >
        🔑
      </button>
    </div>
  );
}
