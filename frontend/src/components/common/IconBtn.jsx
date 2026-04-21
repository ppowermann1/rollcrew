// IconBtn — 아이콘 래퍼 버튼

export default function IconBtn({ children, onClick, active, style }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 36,
        height: 36,
        borderRadius: 10,
        border: 'none',
        cursor: 'pointer',
        background: active ? 'var(--accent)' : 'var(--surface)',
        color: active ? 'var(--accent-ink)' : 'var(--text)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background var(--transition-fast)',
        ...style,
      }}
    >
      {children}
    </button>
  );
}
