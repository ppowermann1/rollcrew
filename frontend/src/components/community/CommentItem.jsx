// CommentItem — 댓글 컴포넌트 (대댓글 포함)
import Avatar from '../common/Avatar';
import { IconThumbUp, IconThumbDown } from '../common/Icons';
import { timeAgo } from '../../utils/time';

export default function CommentItem({ comment: c, onReply, onLike, depth = 0 }) {
  if (c.isDeleted) {
    return (
      <div>
        <div style={{
          padding: '12px 20px',
          borderBottom: '1px solid var(--border)',
          background: depth > 0 ? 'var(--bg-sunken)' : 'transparent',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          {depth > 0 && (
            <span style={{
              fontSize: 15, fontWeight: 700, color: 'var(--text-faint)',
              flexShrink: 0, lineHeight: 1,
            }}>ㄴ</span>
          )}
          <span style={{ fontSize: 13, color: 'var(--text-faint)', fontStyle: 'italic' }}>
            삭제된 댓글입니다.
          </span>
        </div>
        {c.replies && c.replies.map(r => (
          <CommentItem key={r.id} comment={r} onReply={onReply} onLike={onLike} depth={depth + 1} />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div style={{
        padding: '14px 20px',
        borderBottom: '1px solid var(--border)',
        background: depth > 0 ? 'var(--bg-sunken)' : 'transparent',
      }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>

          {/* ㄴ 대댓글 인디케이터 */}
          {depth > 0 && (
            <span style={{
              fontSize: 15, fontWeight: 700, color: 'var(--text-faint)',
              flexShrink: 0, paddingTop: 4, lineHeight: 1,
            }}>ㄴ</span>
          )}

          <Avatar name={c.nickname} size={28} />

          <div style={{ flex: 1 }}>
            {/* 닉네임 + 작성자 뱃지 + 시간 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>
                {c.nickname}
              </span>
              {c.isAuthor && (
                <span style={{
                  fontSize: 10, fontWeight: 700,
                  background: 'var(--accent)', color: 'var(--accent-ink)',
                  padding: '2px 6px', borderRadius: 4,
                  lineHeight: 1.4,
                }}>작성자</span>
              )}
              <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>
                {timeAgo(c.createdAt)}
              </span>
            </div>

            {/* 본문 */}
            <div style={{
              fontSize: 13.5, color: 'var(--text)', lineHeight: 1.55, marginBottom: 8,
            }}>{c.content}</div>

            {/* 좋아요/싫어요/답글 */}
            <div style={{
              display: 'flex', gap: 12, fontSize: 12,
              color: 'var(--text-muted)', alignItems: 'center',
            }}>
              <span
                onClick={() => onLike && onLike(c.id, 'LIKE')}
                style={{ display: 'flex', alignItems: 'center', gap: 3, cursor: 'pointer' }}
              >
                <IconThumbUp size={13} sw={1.7} /> {c.likeCount}
              </span>
              <span
                onClick={() => onLike && onLike(c.id, 'DISLIKE')}
                style={{ display: 'flex', alignItems: 'center', gap: 3, cursor: 'pointer' }}
              >
                <IconThumbDown size={13} sw={1.7} /> {c.dislikeCount}
              </span>
              {depth === 0 && (
                <span onClick={() => onReply && onReply(c)} style={{ cursor: 'pointer' }}>
                  답글
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {c.replies && c.replies.map(r => (
        <CommentItem key={r.id} comment={r} onReply={onReply} onLike={onLike} depth={depth + 1} />
      ))}
    </div>
  );
}
