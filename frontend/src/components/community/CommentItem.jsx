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
          paddingLeft: depth > 0 ? 44 : 20,
          borderBottom: '1px solid var(--border)',
          background: depth > 0 ? 'var(--bg-sunken)' : 'transparent',
        }}>
          <span style={{
            fontSize: 13, color: 'var(--text-faint)', fontStyle: 'italic',
          }}>삭제된 댓글입니다.</span>
        </div>
        {c.replies && c.replies.map(r => (
          <CommentItem
            key={r.id}
            comment={r}
            onReply={onReply}
            onLike={onLike}
            depth={depth + 1}
          />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div style={{
        padding: '14px 20px',
        paddingLeft: depth > 0 ? 44 : 20,
        borderBottom: '1px solid var(--border)',
        background: depth > 0 ? 'var(--bg-sunken)' : 'transparent',
      }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <Avatar name={c.nickname} size={28} />
          <div style={{ flex: 1 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4,
            }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>
                {c.nickname}
              </span>
              <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>
                {timeAgo(c.createdAt)}
              </span>
            </div>
            <div style={{
              fontSize: 13.5, color: 'var(--text)', lineHeight: 1.55, marginBottom: 8,
            }}>{c.content}</div>
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
                <span
                  onClick={() => onReply && onReply(c)}
                  style={{ cursor: 'pointer' }}
                >답글</span>
              )}
            </div>
          </div>
        </div>
      </div>
      {c.replies && c.replies.map(r => (
        <CommentItem
          key={r.id}
          comment={r}
          onReply={onReply}
          onLike={onLike}
          depth={depth + 1}
        />
      ))}
    </div>
  );
}
