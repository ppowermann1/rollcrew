// CreatePostPage — 게시글 작성
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import IconBtn from '../components/common/IconBtn';
import { IconBack } from '../components/common/Icons';
import { createPost } from '../api/communityApi';
import { useAuth } from '../context/AuthContext';
import { generateRandomNickname } from '../utils/randomNickname';

const CATEGORIES = [
  { id: 'GENERAL', label: '일반' },
  { id: 'ACCUSATION', label: '제보/고발' },
];

export default function CreatePostPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('GENERAL');
  const [nickname, setNickname] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // 컴포넌트 마운트 시 랜덤 닉네임 1회 생성
  useEffect(() => {
    setNickname(generateRandomNickname());
  }, []);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim() || submitting) return;
    if (!isAuthenticated) { navigate('/login'); return; }

    setSubmitting(true);
    setError(null);
    try {
      await createPost({
        title: title.trim(),
        content: content.trim(),
        communityCategory: category,
        nickname: nickname,
      });
      navigate('/');
    } catch (err) {
      console.error('게시글 작성 실패:', err);
      setError('게시글 작성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* 헤더 */}
      <div style={{
        display: 'flex', alignItems: 'center', padding: '10px 16px',
        borderBottom: '1px solid var(--border)', background: 'var(--bg)',
      }}>
        <IconBtn onClick={() => navigate(-1)}><IconBack size={20} /></IconBtn>
        <div style={{
          flex: 1, textAlign: 'center', fontSize: 14, fontWeight: 700, color: 'var(--text)',
        }}>글쓰기</div>
        <button
          id="btn-submit-post"
          onClick={handleSubmit}
          disabled={!title.trim() || !content.trim() || submitting}
          style={{
            padding: '8px 16px', borderRadius: 8,
            background: title.trim() && content.trim() ? 'var(--accent)' : 'var(--surface)',
            color: title.trim() && content.trim() ? 'var(--accent-ink)' : 'var(--text-faint)',
            fontSize: 13, fontWeight: 700,
            transition: 'all var(--transition-fast)',
          }}
        >{submitting ? '등록 중...' : '등록'}</button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
        {error && (
          <div style={{
            padding: '12px 14px', borderRadius: 10,
            background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)',
            color: 'var(--danger)', fontSize: 13, marginBottom: 16,
          }}>{error}</div>
        )}

        {/* 카테고리 선택 */}
        <div style={{ marginBottom: 20 }}>
          <label style={{
            fontSize: 12, fontWeight: 700, color: 'var(--text-muted)',
            display: 'block', marginBottom: 8,
          }}>카테고리</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {CATEGORIES.map(c => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                style={{
                  flex: 1, padding: '10px 0', borderRadius: 10,
                  border: `1.5px solid ${category === c.id ? 'var(--accent)' : 'var(--border)'}`,
                  background: category === c.id ? 'var(--accent)' : 'transparent',
                  color: category === c.id ? 'var(--accent-ink)' : 'var(--text)',
                  fontSize: 13, fontWeight: 700,
                  transition: 'all var(--transition-fast)',
                }}
              >{c.label}</button>
            ))}
          </div>
        </div>

        {/* 닉네임 */}
        <div style={{ marginBottom: 20 }}>
          <label style={{
            fontSize: 12, fontWeight: 700, color: 'var(--text-muted)',
            display: 'block', marginBottom: 8,
          }}>작성자 (익명)</label>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', borderRadius: 8,
            background: 'var(--bg-sunken)', border: '1px solid var(--border)',
            fontSize: 13, fontWeight: 700, color: 'var(--text)',
          }}>
            <span style={{ fontSize: 16 }}>🎭</span> {nickname}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 6, marginLeft: 2 }}>
            안전한 커뮤니티를 위해 익명 닉네임이 무작위로 부여됩니다.
          </div>
        </div>

        {/* 제목 */}
        <div style={{ marginBottom: 20 }}>
          <label style={{
            fontSize: 12, fontWeight: 700, color: 'var(--text-muted)',
            display: 'block', marginBottom: 8,
          }}>제목</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            maxLength={100}
            style={{
              width: '100%', height: 44, borderRadius: 10, padding: '0 14px',
              background: 'var(--surface)', border: '1px solid var(--border)',
              fontSize: 14, color: 'var(--text)',
            }}
          />
        </div>

        {/* 본문 */}
        <div>
          <label style={{
            fontSize: 12, fontWeight: 700, color: 'var(--text-muted)',
            display: 'block', marginBottom: 8,
          }}>내용</label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="내용을 입력하세요"
            rows={12}
            style={{
              width: '100%', borderRadius: 10, padding: '14px',
              background: 'var(--surface)', border: '1px solid var(--border)',
              fontSize: 14, color: 'var(--text)', lineHeight: 1.6,
              resize: 'vertical', minHeight: 200,
            }}
          />
        </div>
      </div>
    </div>
  );
}
