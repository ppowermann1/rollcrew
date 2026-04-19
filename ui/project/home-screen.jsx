// Home feed screen — 레이아웃 3종 + 구인구직 클릭 지원

function FeedItem({ post, theme: t, onOpen }) {
  const cat = COMMUNITY_CATEGORIES.find(c => c.id === post.communityCategory) || COMMUNITY_CATEGORIES[1];
  const timeAgo = (iso) => {
    const diff = (Date.now() - new Date(iso)) / 1000;
    if (diff < 60) return '방금 전';
    if (diff < 3600) return `${Math.floor(diff/60)}분 전`;
    if (diff < 86400) return `${Math.floor(diff/3600)}시간 전`;
    return `${Math.floor(diff/86400)}일 전`;
  };
  return (
    <div onClick={() => onOpen && onOpen(post)} style={{
      padding: '16px 20px', borderBottom: `1px solid ${t.border}`, cursor: 'pointer',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: `oklch(${t.name==='dark'?'0.75':'0.45'} 0.12 ${cat.hue})` }}>{cat.label}</span>
        {post.hot && <span style={{ fontSize: 11, fontWeight: 700, color: t.danger }}>HOT</span>}
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: t.textFaint }}>{timeAgo(post.createdAt)}</span>
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.4, letterSpacing: -0.3, color: t.text, marginBottom: 5 }}>{post.title}</div>
      <div style={{
        fontSize: 13, color: t.textMuted, lineHeight: 1.55,
        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: 10,
      }}>{post.content}</div>
      {post.imageURL && post.imageURL.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <ShotPlaceholder theme={t} tag={post.imageURL[0]} h={140} hue={cat.hue} />
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Avatar theme={t} name={post.nickname} size={20} />
        <span style={{ fontSize: 12, color: t.textMuted, fontWeight: 600 }}>{post.nickname}</span>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: t.textMuted, fontSize: 12 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><IconThumbUp size={13} sw={1.8}/> {post.likeCount}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><IconThumbDown size={13} sw={1.8}/> {post.dislikeCount}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><IconComment size={13} sw={1.8}/> {post.commentCount}</span>
        </div>
      </div>
    </div>
  );
}

// 카드형 레이아웃
function FeedCard({ post, theme: t, onOpen }) {
  const cat = COMMUNITY_CATEGORIES.find(c => c.id === post.communityCategory) || COMMUNITY_CATEGORIES[1];
  return (
    <div onClick={() => onOpen && onOpen(post)} style={{
      background: t.bgElevated, borderRadius: 12, border: `1px solid ${t.border}`,
      cursor: 'pointer', overflow: 'hidden',
    }}>
      {post.imageURL && post.imageURL.length > 0 && (
        <div style={{ padding: '10px 10px 0' }}>
          <ShotPlaceholder theme={t} tag={post.imageURL[0]} h={100} hue={cat.hue} />
        </div>
      )}
      <div style={{ padding: '12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: `oklch(${t.name==='dark'?'0.75':'0.45'} 0.12 ${cat.hue})` }}>{cat.label}</span>
          {post.hot && <span style={{ fontSize: 10, fontWeight: 700, color: t.danger }}>HOT</span>}
        </div>
        <div style={{ fontSize: 13.5, fontWeight: 700, lineHeight: 1.35, color: t.text, marginBottom: 5,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 8 }}>
          <Avatar theme={t} name={post.nickname} size={16} />
          <span style={{ fontSize: 11, color: t.textMuted, flex: 1 }}>{post.nickname}</span>
          <span style={{ fontSize: 11, color: t.textMuted, display: 'flex', gap: 6 }}>
            <span>👍{post.likeCount}</span><span>💬{post.commentCount}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

// 컴팩트형 레이아웃
function DenseRow({ post, theme: t, onOpen }) {
  const cat = COMMUNITY_CATEGORIES.find(c => c.id === post.communityCategory) || COMMUNITY_CATEGORIES[1];
  return (
    <div onClick={() => onOpen && onOpen(post)} style={{
      display: 'flex', gap: 10, padding: '11px 20px',
      borderBottom: `1px solid ${t.border}`, cursor: 'pointer', alignItems: 'center',
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 13.5, fontWeight: 600, color: t.text, marginBottom: 2,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{post.title}</div>
        <div style={{ display: 'flex', gap: 6, fontSize: 11, color: t.textMuted, alignItems: 'center' }}>
          <span style={{ color: `oklch(${t.name==='dark'?'0.7':'0.5'} 0.1 ${cat.hue})`, fontWeight: 600 }}>{cat.label}</span>
          <span>·</span><span>{post.nickname}</span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, fontSize: 11, color: t.textMuted, flexShrink: 0 }}>
        <span>👍{post.likeCount}</span>
        <span>💬{post.commentCount}</span>
      </div>
    </div>
  );
}

// 구인구직 리스트형
function JobRow({ job, theme: t, onOpen }) {
  const cat = JOB_CATEGORIES.find(c => c.id === job.category) || JOB_CATEGORIES[0];
  const isOpen = job.status === 'OPEN';
  return (
    <div onClick={() => onOpen && onOpen(job)} style={{
      padding: '16px 20px', borderBottom: `1px solid ${t.border}`, cursor: 'pointer', opacity: isOpen ? 1 : 0.55,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: `oklch(${t.name==='dark'?'0.75':'0.45'} 0.12 ${cat.hue})` }}>{cat.label}</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: isOpen ? t.success : t.textFaint }}>{isOpen ? '모집중' : '마감'}</span>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: t.textFaint }}>{job.shootingDates}</span>
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.4, letterSpacing: -0.3, color: t.text, marginBottom: 5 }}>{job.title}</div>
      <div style={{
        fontSize: 13, color: t.textMuted, lineHeight: 1.55,
        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>{job.content}</div>
    </div>
  );
}

function HomeScreen({ theme: t, onOpenPost, onOpenJob, layout = 'list' }) {
  const [activeCat, setActiveCat] = React.useState('ALL');
  const [activeJobCat, setActiveJobCat] = React.useState('ALL');
  const [tab, setTab] = React.useState('community');

  const filtered = tab === 'community'
    ? (activeCat === 'ALL' ? COMMUNITY_POSTS : COMMUNITY_POSTS.filter(p => p.communityCategory === activeCat))
    : (activeJobCat === 'ALL' ? JOB_POSTS : JOB_POSTS.filter(j => j.category === activeJobCat));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: t.bg, position: 'relative' }}>
      {/* 헤더 */}
      <div style={{ padding: '12px 20px 0', background: t.bg, borderBottom: `1px solid ${t.border}`, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <FilmLogo theme={t} />
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 20, fontWeight: 800, letterSpacing: -0.6, color: t.text }}>
              롤크루<span style={{ color: t.accent }}>.</span>
            </div>
          </div>
          <IconBtn theme={t}><IconSearch size={20} /></IconBtn>
        </div>

        {/* 탭 */}
        <div style={{ display: 'flex' }}>
          {[{id:'community', label:'커뮤니티'}, {id:'job', label:'구인구직'}].map(tb => (
            <button key={tb.id} onClick={() => setTab(tb.id)} style={{
              flex: 1, padding: '10px 0', background: 'transparent', border: 'none',
              borderBottom: tab === tb.id ? `2px solid ${t.accent}` : `2px solid transparent`,
              color: tab === tb.id ? t.accent : t.textMuted,
              fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: FONT_SANS,
            }}>{tb.label}</button>
          ))}
        </div>

        {/* 카테고리 칩 */}
        <div style={{
          display: 'flex', gap: 6, margin: '10px -20px 0', padding: '0 20px 12px',
          overflowX: 'auto', scrollbarWidth: 'none',
        }}>
          {tab === 'community' && COMMUNITY_CATEGORIES.map(c => (
            <button key={c.id} onClick={() => setActiveCat(c.id)} style={{
              height: 34, padding: '0 4px', whiteSpace: 'nowrap', border: 'none', background: 'transparent',
              borderBottom: activeCat === c.id ? `2px solid ${t.accent}` : '2px solid transparent',
              color: activeCat === c.id ? t.text : t.textMuted,
              fontSize: 13, fontWeight: activeCat === c.id ? 700 : 500,
              flexShrink: 0, cursor: 'pointer', fontFamily: FONT_SANS,
              marginRight: 16, transition: 'color 0.15s',
            }}>{c.label}</button>
          ))}
          {tab === 'job' && [{id:'ALL', label:'전체'}, ...JOB_CATEGORIES].map(c => (
            <button key={c.id} onClick={() => setActiveJobCat(c.id)} style={{
              height: 34, padding: '0 4px', whiteSpace: 'nowrap', border: 'none', background: 'transparent',
              borderBottom: activeJobCat === c.id ? `2px solid ${t.accent}` : '2px solid transparent',
              color: activeJobCat === c.id ? t.text : t.textMuted,
              fontSize: 13, fontWeight: activeJobCat === c.id ? 700 : 500,
              flexShrink: 0, cursor: 'pointer', fontFamily: FONT_SANS, marginRight: 16,
            }}>{c.label}</button>
          ))}
        </div>
      </div>

      {/* 피드 */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {tab === 'community' && layout === 'list' && filtered.map(p => (
          <FeedItem key={p.id} post={p} theme={t} onOpen={onOpenPost} />
        ))}
        {tab === 'community' && layout === 'card' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: '14px 14px 80px' }}>
            {filtered.map(p => <FeedCard key={p.id} post={p} theme={t} onOpen={onOpenPost} />)}
          </div>
        )}
        {tab === 'community' && layout === 'dense' && filtered.map(p => (
          <DenseRow key={p.id} post={p} theme={t} onOpen={onOpenPost} />
        ))}
        {tab === 'job' && filtered.map(j => (
          <JobRow key={j.id} job={j} theme={t} onOpen={onOpenJob} />
        ))}
        <div style={{ height: 80 }} />
      </div>

      {/* FAB */}
      <button style={{
        position: 'absolute', bottom: 10, right: 18, width: 50, height: 50, borderRadius: 25,
        background: t.accent, color: t.accentInk, border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 4px 16px ${t.accent}55`,
      }}>
        <IconPlus size={22} sw={2.4} />
      </button>
    </div>
  );
}

Object.assign(window, { HomeScreen, FeedItem, FeedCard, DenseRow, JobRow });
