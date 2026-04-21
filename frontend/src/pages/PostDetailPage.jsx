// PostDetailPage — 커뮤니티 게시글 상세
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Avatar from '../components/common/Avatar';
import IconBtn from '../components/common/IconBtn';
import ShotPlaceholder from '../components/common/ShotPlaceholder';
import CommentItem from '../components/community/CommentItem';
import { IconBack, IconMore, IconThumbUp, IconThumbDown, IconShare, IconPlus } from '../components/common/Icons';
import { getPost, togglePostLike, updatePost, deletePost } from '../api/communityApi';
import { getComments, createComment, toggleCommentLike } from '../api/commentApi';
import { useAuth } from '../context/AuthContext';
import { timeAgo } from '../utils/time';
import { generateRandomNickname } from '../utils/randomNickname';
import Pagination from '../components/common/Pagination';

export default function PostDetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commPage, setCommPage] = useState(0);
  const [commTotal, setCommTotal] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);

  const [commentText, setCommentText] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [commentNickname] = useState(() => generateRandomNickname());

  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [postData, commentsData] = await Promise.all([
          getPost(postId),
          getComments(postId, 0),
        ]);
        setPost(postData);
        setComments(commentsData?.comments || []);
        setCommTotal(commentsData?.totalPages || 1);
        setLikeCount(postData.likeCount || 0);
        setDislikeCount(postData.dislikeCount || 0);
      } catch (err) {
        console.error('게시글 로딩 실패:', err);
        setError('게시글을 불러올 수 없습니다');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [postId]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await getComments(postId, commPage);
        setComments(data?.comments || []);
        setCommTotal(data?.totalPages || 1);
      } catch (err) {
        console.error('댓글 로딩 실패:', err);
      }
    };
    fetchComments();
  }, [postId, commPage]);

  const handleToggleLike = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    try {
      await togglePostLike(postId, 'LIKE');
      if (liked) {
        setLiked(false);
        setLikeCount(n => n - 1);
      } else {
        setLiked(true);
        setLikeCount(n => n + 1);
        if (disliked) { setDisliked(false); setDislikeCount(n => n - 1); }
      }
    } catch (err) {
      console.error('좋아요 실패:', err);
    }
  };

  const handleToggleDislike = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    try {
      await togglePostLike(postId, 'DISLIKE');
      if (disliked) {
        setDisliked(false);
        setDislikeCount(n => n - 1);
      } else {
        setDisliked(true);
        setDislikeCount(n => n + 1);
        if (liked) { setLiked(false); setLikeCount(n => n - 1); }
      }
    } catch (err) {
      console.error('싫어요 실패:', err);
    }
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim() || submitting) return;
    if (!isAuthenticated) { navigate('/login'); return; }

    setSubmitting(true);
    try {
      await createComment(postId, {
        nickname: commentNickname,
        content: commentText,
        parentId: replyTo?.id || null,
      });
      setCommentText('');
      setReplyTo(null);
      // 댓글 목록 새로고침
      const updated = await getComments(postId, commPage);
      setComments(updated?.comments || []);
      setCommTotal(updated?.totalPages || 1);
    } catch (err) {
      console.error('댓글 작성 실패:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCommentLike = async (commentId, likeType) => {
    if (!isAuthenticated) { navigate('/login'); return; }
    try {
      await toggleCommentLike(commentId, likeType);
      const updated = await getComments(postId, commPage);
      setComments(updated?.comments || []);
      setCommTotal(updated?.totalPages || 1);
    } catch (err) {
      console.error('댓글 좋아요 실패:', err);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <div className="flex-center" style={{ flex: 1 }}><div className="spinner" /></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <div style={{
          display: 'flex', alignItems: 'center', padding: '10px 16px',
          borderBottom: '1px solid var(--border)',
        }}>
          <IconBtn onClick={() => navigate('/', { state: { tab: 'community' } })}><IconBack size={20} /></IconBtn>
        </div>
        <div className="empty-state">
          <div className="empty-icon">😥</div>
          <div>{error || '게시글을 찾을 수 없습니다'}</div>
        </div>
      </div>
    );
  }

  const isOwner = isAuthenticated && user?.id === post?.userId;

  const handleEdit = () => {
    setEditTitle(post.title);
    setEditContent(post.content);
    setIsEditing(true);
    setShowMenu(false);
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim() || !editContent.trim() || saving) return;
    setSaving(true);
    try {
      const updated = await updatePost(postId, { title: editTitle.trim(), content: editContent.trim() });
      setPost(prev => ({ ...prev, title: updated.title, content: updated.content }));
      setIsEditing(false);
    } catch (err) {
      console.error('수정 실패:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('게시글을 삭제하시겠습니까?')) return;
    try {
      await deletePost(postId);
      navigate(-1);
    } catch (err) {
      console.error('삭제 실패:', err);
    }
  };

  const commentCount = comments.reduce((acc, c) => {
    let count = c.isDeleted ? 0 : 1;
    if (c.replies) count += c.replies.filter(r => !r.isDeleted).length;
    return acc + count;
  }, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* 상단 nav */}
      <div style={{
        display: 'flex', alignItems: 'center', padding: '10px 16px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <IconBtn onClick={() => navigate('/', { state: { tab: 'community' } })}><IconBack size={20} /></IconBtn>
        <div style={{
          flex: 1, textAlign: 'center', fontSize: 14, fontWeight: 700, color: 'var(--text)',
        }}>커뮤니티</div>
        {isOwner ? (
          <div style={{ position: 'relative' }}>
            <IconBtn onClick={() => setShowMenu(v => !v)}><IconMore size={20} /></IconBtn>
            {showMenu && (
              <>
                <div
                  style={{ position: 'fixed', inset: 0, zIndex: 98 }}
                  onClick={() => setShowMenu(false)}
                />
                <div style={{
                  position: 'absolute', top: '100%', right: 0, zIndex: 99,
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 10, boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                  minWidth: 120, overflow: 'hidden',
                }}>
                  <button
                    onClick={handleEdit}
                    style={{
                      display: 'block', width: '100%', padding: '12px 16px',
                      textAlign: 'left', fontSize: 14, fontWeight: 600,
                      color: 'var(--text)', background: 'transparent', cursor: 'pointer',
                      borderBottom: '1px solid var(--border)',
                    }}
                  >수정</button>
                  <button
                    onClick={() => { setShowMenu(false); handleDelete(); }}
                    style={{
                      display: 'block', width: '100%', padding: '12px 16px',
                      textAlign: 'left', fontSize: 14, fontWeight: 600,
                      color: 'var(--danger)', background: 'transparent', cursor: 'pointer',
                    }}
                  >삭제</button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div style={{ width: 40 }} />
        )}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 70 }}>
        {/* 제목 + 작성자 */}
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--border)' }}>
          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              maxLength={100}
              style={{
                display: 'block', width: '100%', marginBottom: 16,
                fontSize: 18, fontWeight: 800, color: 'var(--text)',
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 10, padding: '10px 14px',
                boxSizing: 'border-box',
              }}
            />
          ) : (
            <h1 style={{
              margin: '0 0 16px 0', fontSize: 20, fontWeight: 800,
              lineHeight: 1.35, letterSpacing: -0.5, color: 'var(--text)',
            }}>{post.title}</h1>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar name={post.nickname} size={34} />
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text)' }}>
                {post.nickname}
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>
                {timeAgo(post.createdAt)}
              </div>
            </div>
          </div>
        </div>

        {/* 본문 */}
        <div style={{ padding: '18px 20px' }}>
          {isEditing ? (
            <>
              <textarea
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
                rows={10}
                style={{
                  display: 'block', width: '100%', marginBottom: 12,
                  fontSize: 14, color: 'var(--text)', lineHeight: 1.75,
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 10, padding: '12px 14px', resize: 'vertical',
                  minHeight: 180, boxSizing: 'border-box',
                }}
              />
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={handleSaveEdit}
                  disabled={!editTitle.trim() || !editContent.trim() || saving}
                  style={{
                    flex: 1, height: 42, borderRadius: 10, fontSize: 14, fontWeight: 700,
                    background: editTitle.trim() && editContent.trim() ? 'var(--accent)' : 'var(--surface)',
                    color: editTitle.trim() && editContent.trim() ? 'var(--accent-ink)' : 'var(--text-faint)',
                    cursor: editTitle.trim() && editContent.trim() ? 'pointer' : 'default',
                  }}
                >{saving ? '저장 중...' : '저장'}</button>
                <button
                  onClick={() => setIsEditing(false)}
                  style={{
                    flex: 1, height: 42, borderRadius: 10, fontSize: 14, fontWeight: 700,
                    border: '1.5px solid var(--border)', background: 'transparent',
                    color: 'var(--text)', cursor: 'pointer',
                  }}
                >취소</button>
              </div>
            </>
          ) : (
            <p style={{
              margin: 0, fontSize: 14.5, lineHeight: 1.75,
              color: 'var(--text)', letterSpacing: -0.2, whiteSpace: 'pre-line',
            }}>{post.content}</p>
          )}

          {!isEditing && post.imageURL && post.imageURL.length > 0 && (
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {post.imageURL.map((url, i) => (
                <ShotPlaceholder key={i} tag={url} h={190} imageUrl={url.startsWith('http') ? url : null} />
              ))}
            </div>
          )}

          {/* 좋아요 / 싫어요 */}
          {!isEditing && <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
            <button
              id="btn-like"
              onClick={handleToggleLike}
              style={{
                flex: 1, height: 44, borderRadius: 10,
                border: `1.5px solid ${liked ? 'var(--accent)' : 'var(--border)'}`,
                background: liked ? 'var(--accent)' : 'transparent',
                color: liked ? 'var(--accent-ink)' : 'var(--text)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                fontSize: 13, fontWeight: 700, cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                transition: 'all var(--transition-fast)',
              }}
            >
              <IconThumbUp size={17} sw={liked ? 2.2 : 1.8} />
              {likeCount}
            </button>
            <button
              id="btn-dislike"
              onClick={handleToggleDislike}
              style={{
                flex: 1, height: 44, borderRadius: 10,
                border: `1.5px solid ${disliked ? 'var(--danger)' : 'var(--border)'}`,
                background: disliked ? 'var(--danger)' : 'transparent',
                color: disliked ? '#fff' : 'var(--text)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                fontSize: 13, fontWeight: 700, cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                transition: 'all var(--transition-fast)',
              }}
            >
              <IconThumbDown size={17} sw={disliked ? 2.2 : 1.8} />
              {dislikeCount}
            </button>
            <button style={{
              width: 44, height: 44, borderRadius: 10,
              border: '1.5px solid var(--border)', background: 'transparent',
              color: 'var(--text)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}><IconShare size={18} /></button>
          </div>}
        </div>

        {/* 댓글 헤더 */}
        <div style={{
          padding: '12px 20px', background: 'var(--bg-sunken)',
          borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>댓글</span>
          <span style={{
            width: 20, height: 20, borderRadius: 10, background: 'var(--accent)',
            color: 'var(--accent-ink)', fontSize: 11, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{commentCount}</span>
        </div>

        {/* 댓글 목록 */}
        {comments.length === 0 ? (
          <div style={{
            padding: '32px 20px', textAlign: 'center',
            color: 'var(--text-faint)', fontSize: 13,
          }}>첫 댓글을 남겨보세요</div>
        ) : (
          comments.map(c => (
            <CommentItem
              key={c.id}
              comment={c}
              onReply={(comment) => {
                setReplyTo(comment);
                document.getElementById('comment-input')?.focus();
              }}
              onLike={handleCommentLike}
            />
          ))
        )}

        {/* 댓글 페이지네이션 */}
        <Pagination
          currentPage={commPage}
          totalPages={commTotal}
          onPageChange={setCommPage}
        />
      </div>

      {/* 답글 표시 */}
      {replyTo && (
        <div style={{
          padding: '6px 16px', background: 'var(--bg-sunken)',
          borderTop: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontSize: 12, color: 'var(--text-muted)',
        }}>
          <span><strong>{replyTo.nickname}</strong>님에게 답글</span>
          <button
            onClick={() => setReplyTo(null)}
            style={{ fontSize: 12, color: 'var(--text-muted)', cursor: 'pointer' }}
          >취소</button>
        </div>
      )}

      {/* 댓글 입력 바 */}
      <div style={{
        display: 'flex', gap: 8, padding: '10px 16px',
        borderTop: '1px solid var(--border)', background: 'var(--bg)',
        alignItems: 'center',
      }}>
        <input
          id="comment-input"
          type="text"
          value={commentText}
          onChange={e => setCommentText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmitComment()}
          placeholder={replyTo ? `${replyTo.nickname}님에게 답글...` : '댓글을 남겨보세요…'}
          style={{
            flex: 1, height: 38, borderRadius: 19,
            background: 'var(--surface)',
            padding: '0 14px', fontSize: 13,
            color: 'var(--text)',
          }}
        />
        <button
          onClick={handleSubmitComment}
          disabled={submitting || !commentText.trim()}
          style={{
            width: 38, height: 38, borderRadius: 19,
            background: commentText.trim() ? 'var(--accent)' : 'var(--surface)',
            color: commentText.trim() ? 'var(--accent-ink)' : 'var(--text-faint)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: commentText.trim() ? 'pointer' : 'default',
            transition: 'all var(--transition-fast)',
          }}
        ><IconPlus size={18} sw={2.4} /></button>
      </div>
    </div>
  );
}
