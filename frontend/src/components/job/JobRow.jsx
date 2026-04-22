// JobRow — 구인구직 리스트 아이템
import { timeAgo } from '../../utils/time';

const JOB_CATEGORIES = {
  FILMING:   { label: '촬영', hue: 300 },
  LIGHTING:  { label: '조명', hue: 40 },
  DIRECTING: { label: '연출', hue: 200 },
  ETC:       { label: '기타', hue: 155 },
};

// "2026-04-25" → "4월 25일"
// "2026-06-01 ~ 2026-10-31" → "6월 1일 ~ 10월 31일"
const fmtSingle = (s) => {
  const d = new Date(s.trim());
  if (isNaN(d)) return s.trim();
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
};

const getYear = (s) => {
  const d = new Date(s.trim());
  return isNaN(d) ? '' : ` (${d.getFullYear()})`;
};

const formatDate = (str) => {
  if (!str) return '';
  if (str.includes('~')) {
    const [s, e] = str.split('~');
    const ds = new Date(s.trim()), de = new Date(e.trim());
    if (!isNaN(ds) && !isNaN(de) && ds.getFullYear() !== de.getFullYear()) {
      return `${fmtSingle(s)} ~ ${fmtSingle(e)} (${ds.getFullYear()}-${String(de.getFullYear()).slice(2)})`;
    }
    return `${fmtSingle(s)} ~ ${fmtSingle(e)}${getYear(s)}`;
  }
  if (str.includes(',')) {
    const parts = str.split(',').map(p => p.trim()).filter(Boolean);
    const first = fmtSingle(parts[0]);
    const rest = parts.length - 1;
    return rest > 0
      ? `${first} 외 ${rest}일${getYear(parts[0])}`
      : `${first}${getYear(parts[0])}`;
  }
  return `${fmtSingle(str)}${getYear(str)}`;
};

const isPastShootingDate = (shootingDates) => {
  if (!shootingDates) return false;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  // 기간이면 종료일, 복수면 마지막 날, 단일이면 그 날
  let lastDate;
  if (shootingDates.includes('~')) {
    lastDate = new Date(shootingDates.split('~')[1].trim());
  } else if (shootingDates.includes(',')) {
    const parts = shootingDates.split(',').map(d => new Date(d.trim()));
    lastDate = new Date(Math.max(...parts));
  } else {
    lastDate = new Date(shootingDates.trim());
  }
  return !isNaN(lastDate) && lastDate < today;
};

export default function JobRow({ job, onClick }) {
  const cat = JOB_CATEGORIES[job.category] || JOB_CATEGORIES.ETC;
  const isOpen = job.status === 'OPEN';
  const isPast = isPastShootingDate(job.shootingDates);
  const isDisabled = !isOpen || isPast;

  return (
    <div
      onClick={() => !isDisabled && onClick && onClick(job)}
      style={{
        padding: '16px 20px',
        borderBottom: '1px solid var(--border)',
        cursor: isDisabled ? 'default' : 'pointer',
        opacity: isDisabled ? 0.4 : 1,
        transition: 'background var(--transition-fast)',
      }}
    >
      {/* 카테고리 + 모집상태 + 촬영일 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <span style={{
          fontSize: 11, fontWeight: 700,
          color: `oklch(0.75 0.12 ${cat.hue})`,
        }}>{cat.label}</span>
        <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>·</span>
        <span style={{
          fontSize: 11, fontWeight: 700,
          color: isOpen ? 'var(--success)' : 'var(--text-faint)',
        }}>{isOpen ? '모집중' : '마감'}</span>
        <div style={{ flex: 1 }} />
        {job.shootingDates && (
          <span style={{
            fontSize: 12, fontFamily: "'DM Mono', monospace",
            color: '#fff', letterSpacing: -0.6,
          }}>
            촬영일: {formatDate(job.shootingDates)}
          </span>
        )}
      </div>

      {/* 제목 */}
      <div style={{
        fontSize: 15, fontWeight: 700, lineHeight: 1.4,
        letterSpacing: -0.3, color: 'var(--text)', marginBottom: 6,
        textDecoration: isOpen ? 'none' : 'line-through',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>{job.title}</div>

      {/* 내용 미리보기 */}
      <div style={{
        fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.55,
        display: '-webkit-box', WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical', overflow: 'hidden',
        textDecoration: isOpen ? 'none' : 'line-through',
        marginBottom: 10,
      }}>{job.content}</div>

      {/* 하단 메타 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>
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
