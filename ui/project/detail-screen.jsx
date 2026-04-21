// Detail screen — 심플 버전 (좋아요/싫어요 손가락 아이콘)

function DetailScreen({ post, theme: t, onBack }) {
  const cat = COMMUNITY_CATEGORIES.find(c => c.id === post.communityCategory) || COMMUNITY_CATEGORIES[1];
  const [liked, setLiked] = React.useState(false);
  const [disliked, setDisliked] = React.useState(false);
  const [likeCount, setLikeCount] = React.useState(post.likeCount);
  const [dislikeCount, setDislikeCount] = React.useState(post.dislikeCount);

  const comments = POST_COMMENTS[post.id] || [];

  const toggleLike = () => {
    if (liked) { setLiked(false); setLikeCount(n => n - 1); }
    else {
      setLiked(true); setLikeCount(n => n + 1);
      if (disliked) { setDisliked(false); setDislikeCount(n => n - 1); }
    }
  };
  const toggleDislike = () => {
    if (disliked) { setDisliked(false); setDislikeCount(n => n - 1); }
    else {
      setDisliked(true); setDislikeCount(n => n + 1);
      if (liked) { setLiked(false); setLikeCount(n => n - 1); }
    }
  };

  const timeAgo = (iso) => {
    const diff = (Date.now() - new Date(iso)) / 1000;
    if (diff < 60) return '방금 전';
    if (diff < 3600) return `${Math.floor(diff/60)}분 전`;
    if (diff < 86400) return `${Math.floor(diff/3600)}시간 전`;
    return `${Math.floor(diff/86400)}일 전`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: t.bg }}>
      {/* 상단 nav */}
      <div style={{
        display: 'flex', alignItems: 'center', padding: '10px 16px',
        borderBottom: `1px solid ${t.border}`,
      }}>
        <IconBtn theme={t} onClick={onBack}><IconBack size={20} /></IconBtn>
        <div style={{ flex: 1, textAlign: 'center', fontSize: 14, fontWeight: 700, color: t.text }}>
          {cat.label}
        </div>
        <IconBtn theme={t}><IconMore size={20} /></IconBtn>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* 제목 + 작성자 */}
        <div style={{ padding: '20px 20px 16px', borderBottom: `1px solid ${t.border}` }}>
          <h1 style={{
            margin: '0 0 16px 0', fontSize: 20, fontWeight: 800,
            lineHeight: 1.35, letterSpacing: -0.5, color: t.text,
          }}>{post.title}</h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar theme={t} name={post.nickname} size={34} />
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: t.text }}>{post.nickname}</div>
              <div style={{ fontSize: 11.5, color: t.textMuted, marginTop: 2 }}>{timeAgo(post.createdAt)}</div>
            </div>
          </div>
        </div>

        {/* 본문 */}
        <div style={{ padding: '18px 20px' }}>
          <p style={{
            margin: 0, fontSize: 14.5, lineHeight: 1.75,
            color: t.text, letterSpacing: -0.2, whiteSpace: 'pre-line',
          }}>{post.content}</p>

          {post.imageURL && post.imageURL.length > 0 && (
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {post.imageURL.map((tag, i) => (
                <ShotPlaceholder key={i} theme={t} tag={tag} h={190} hue={cat.hue} />
              ))}
            </div>
          )}

          {/* 좋아요 / 싫어요 */}
          <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
            <button onClick={toggleLike} style={{
              flex: 1, height: 44, borderRadius: 10,
              border: `1.5px solid ${liked ? t.accent : t.border}`,
              background: liked ? t.accent : 'transparent',
              color: liked ? t.accentInk : t.text,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: FONT_SANS,
            }}>
              <IconThumbUp size={17} sw={liked ? 2.2 : 1.8} />
              {likeCount}
            </button>
            <button onClick={toggleDislike} style={{
              flex: 1, height: 44, borderRadius: 10,
              border: `1.5px solid ${disliked ? t.danger : t.border}`,
              background: disliked ? t.danger : 'transparent',
              color: disliked ? '#fff' : t.text,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: FONT_SANS,
            }}>
              <IconThumbDown size={17} sw={disliked ? 2.2 : 1.8} />
              {dislikeCount}
            </button>
            <button style={{
              width: 44, height: 44, borderRadius: 10,
              border: `1.5px solid ${t.border}`, background: 'transparent',
              color: t.text, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}><IconShare size={18} /></button>
          </div>
        </div>

        {/* 댓글 헤더 */}
        <div style={{
          padding: '12px 20px', background: t.bgSunken,
          borderTop: `1px solid ${t.border}`, borderBottom: `1px solid ${t.border}`,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: t.text }}>댓글</span>
          <span style={{
            width: 20, height: 20, borderRadius: 10, background: t.accent,
            color: t.accentInk, fontSize: 11, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{post.commentCount}</span>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 12, color: t.textMuted }}>인기순 ▾</span>
        </div>

        {/* 댓글 목록 */}
        {comments.length === 0 ? (
          <div style={{ padding: '32px 20px', textAlign: 'center', color: t.textFaint, fontSize: 13 }}>
            첫 댓글을 남겨보세요
          </div>
        ) : (
          comments.map(c => <CommentItem key={c.id} comment={c} theme={t} timeAgo={timeAgo} />)
        )}
        <div style={{ height: 20 }} />
      </div>

      {/* 댓글 입력 바 */}
      <div style={{
        display: 'flex', gap: 8, padding: '10px 16px',
        borderTop: `1px solid ${t.border}`, background: t.bg, alignItems: 'center',
      }}>
        <div style={{
          flex: 1, height: 38, borderRadius: 19, background: t.surface,
          display: 'flex', alignItems: 'center', padding: '0 14px',
          fontSize: 13, color: t.textFaint,
        }}>댓글을 남겨보세요…</div>
        <button style={{
          width: 38, height: 38, borderRadius: 19, border: 'none', cursor: 'pointer',
          background: t.accent, color: t.accentInk,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}><IconPlus size={18} sw={2.4} /></button>
      </div>
    </div>
  );
}

function CommentItem({ comment: c, theme: t, timeAgo, depth = 0 }) {
  if (c.isDeleted) {
    return (
      <div>
        <div style={{
          padding: '12px 20px', paddingLeft: depth > 0 ? 44 : 20,
          borderBottom: `1px solid ${t.border}`,
          background: depth > 0 ? t.bgSunken : 'transparent',
        }}>
          <span style={{ fontSize: 13, color: t.textFaint, fontStyle: 'italic' }}>삭제된 댓글입니다.</span>
        </div>
        {c.replies && c.replies.map(r => (
          <CommentItem key={r.id} comment={r} theme={t} timeAgo={timeAgo} depth={depth + 1} />
        ))}
      </div>
    );
  }
  return (
    <div>
      <div style={{
        padding: '14px 20px', paddingLeft: depth > 0 ? 44 : 20,
        borderBottom: `1px solid ${t.border}`,
        background: depth > 0 ? t.bgSunken : 'transparent',
      }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <Avatar theme={t} name={c.nickname} size={28} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: t.text }}>{c.nickname}</span>
              <span style={{ fontSize: 11, color: t.textFaint }}>{timeAgo(c.createdAt)}</span>
            </div>
            <div style={{ fontSize: 13.5, color: t.text, lineHeight: 1.55, marginBottom: 8 }}>{c.content}</div>
            <div style={{ display: 'flex', gap: 12, fontSize: 12, color: t.textMuted, alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 3, cursor: 'pointer' }}>
                <IconThumbUp size={13} sw={1.7} /> {c.likeCount}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 3, cursor: 'pointer' }}>
                <IconThumbDown size={13} sw={1.7} /> {c.dislikeCount}
              </span>
              <span style={{ cursor: 'pointer' }}>답글</span>
            </div>
          </div>
        </div>
      </div>
      {c.replies && c.replies.map(r => (
        <CommentItem key={r.id} comment={r} theme={t} timeAgo={timeAgo} depth={depth + 1} />
      ))}
    </div>
  );
}

Object.assign(window, { DetailScreen, CommentItem });
