// BackBtn — 원형 뒤로가기 버튼
import { IconBack } from './Icons';

export default function BackBtn({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 36, height: 36, borderRadius: '50%',
        border: 'none', cursor: 'pointer',
        background: 'var(--surface)',
        color: 'var(--text)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
        transition: 'background var(--transition-fast)',
        flexShrink: 0,
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-sunken)'}
      onMouseLeave={e => e.currentTarget.style.background = 'var(--surface)'}
    >
      <IconBack size={18} />
    </button>
  );
}
