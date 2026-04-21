// JobRow — 구인구직 리스트 아이템
import { timeAgo } from '../../utils/time';

const JOB_CATEGORIES = {
  FILMING:   { label: '촬영', hue: 300 },
  LIGHTING:  { label: '조명', hue: 40 },
  DIRECTING: { label: '연출', hue: 200 },
  ETC:       { label: '기타', hue: 155 },
};

export default function JobRow({ job, onClick }) {
  const cat = JOB_CATEGORIES[job.category] || JOB_CATEGORIES.ETC;
  const isOpen = job.status === 'OPEN';

  return (
    <div
      onClick={() => onClick && onClick(job)}
      style={{
        padding: '16px 20px',
        borderBottom: '1px solid var(--border)',
        cursor: 'pointer',
        opacity: isOpen ? 1 : 0.55,
        transition: 'background var(--transition-fast)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
        <span style={{
          fontSize: 11, fontWeight: 700,
          color: `oklch(0.75 0.12 ${cat.hue})`,
        }}>{cat.label}</span>
        <span style={{
          fontSize: 11, fontWeight: 700,
          color: isOpen ? 'var(--success)' : 'var(--text-faint)',
        }}>{isOpen ? '모집중' : '마감'}</span>
        <div style={{ flex: 1 }} />
        <span style={{ 
          fontSize: 12, 
          fontWeight: 700, 
          color: 'var(--text)',
          letterSpacing: 0.5 
        }}>
          🗓 {job.shootingDates}
        </span>
      </div>

      <div style={{
        fontSize: 15, fontWeight: 700, lineHeight: 1.4,
        letterSpacing: -0.3, color: 'var(--text)', marginBottom: 5,
        textDecoration: isOpen ? 'none' : 'line-through',
      }}>{job.title}</div>

      <div style={{
        fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.55,
        display: '-webkit-box', WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical', overflow: 'hidden',
        textDecoration: isOpen ? 'none' : 'line-through',
      }}>{job.content}</div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>
          {job.authorName || '알 수 없음'}
        </span>
        <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>·</span>
        <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>
          {timeAgo(job.createdAt)}
        </span>
      </div>
    </div>
  );
}
