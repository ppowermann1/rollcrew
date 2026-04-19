// FeedItem — 게시글 리스트형 아이템
import Avatar from '../common/Avatar';
import { IconThumbUp, IconThumbDown, IconComment } from '../common/Icons';
import { timeAgo } from '../../utils/time';

export default function FeedItem({ post, onClick }) {
  return (
    <div
      onClick={() => onClick && onClick(post)}
      style={{
        padding: '16px 20px',
        borderBottom: '1px solid var(--border)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'background var(--transition-fast)',
      }}
    >
      {/* 상단: 카테고리 + 시간 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
        {post.communityCategory && (
          <span style={{
            fontSize: 11, fontWeight: 700,
            color: post.communityCategory === 'ACCUSATION' ? '#FF6B6B' : 'var(--accent)',
          }}>
            {post.communityCategory === 'ACCUSATION' ? '제보/고발' : '일반'}
          </span>
        )}
        {post.hot && (
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--danger)' }}>HOT</span>
        )}
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>
          {timeAgo(post.createdAt)}
        </span>
      </div>

      {/* 제목 */}
      <div style={{
        fontSize: 15, fontWeight: 700, lineHeight: 1.4,
        letterSpacing: -0.3, color: 'var(--text)', marginBottom: 5,
      }}>{post.title}</div>

      {/* 본문 미리보기 */}
      {post.content && (
        <div style={{
          fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.55,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: 10,
        }}>{post.content}</div>
      )}

      {/* 하단: 작성자 + 좋아요/댓글 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Avatar name={post.nickname} size={20} />
        <span style={{
          fontSize: 12, color: 'var(--text-muted)', fontWeight: 600,
        }}>{post.nickname}</span>
        <div style={{ flex: 1 }} />
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          color: 'var(--text-muted)', fontSize: 12,
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <IconThumbUp size={13} sw={1.8} /> {post.likeCount || 0}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <IconThumbDown size={13} sw={1.8} /> {post.dislikeCount || 0}
          </span>
          {post.commentCount !== undefined && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <IconComment size={13} sw={1.8} /> {post.commentCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
