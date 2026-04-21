import React from 'react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  // Render up to 5 pages around the current page
  let startPage = Math.max(0, currentPage - 2);
  let endPage = Math.min(totalPages - 1, startPage + 4);

  // Adjust start page if we are near the end
  if (endPage - startPage < 4) {
    startPage = Math.max(0, endPage - 4);
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      gap: 8, padding: '20px 0 40px',
    }}>
      <button
        onClick={() => onPageChange(Math.max(0, currentPage - 1))}
        disabled={currentPage <= 0}
        style={{
          width: 32, height: 32, borderRadius: 8,
          border: '1px solid var(--border)', background: 'var(--bg)',
          color: currentPage <= 0 ? 'var(--text-faint)' : 'var(--text)',
          cursor: currentPage <= 0 ? 'default' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all var(--transition-fast)',
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 700 }}>&lt;</span>
      </button>

      {pages.map(p => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          style={{
            width: 32, height: 32, borderRadius: 8,
            border: p === currentPage ? 'none' : '1px solid var(--border)',
            background: p === currentPage ? 'var(--accent)' : 'var(--bg)',
            color: p === currentPage ? 'var(--accent-ink)' : 'var(--text)',
            fontWeight: p === currentPage ? 800 : 500,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontFamily: 'var(--font-mono)',
            transition: 'all var(--transition-fast)',
          }}
        >
          {p + 1}
        </button>
      ))}

      <button
        onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
        disabled={currentPage >= totalPages - 1}
        style={{
          width: 32, height: 32, borderRadius: 8,
          border: '1px solid var(--border)', background: 'var(--bg)',
          color: currentPage >= totalPages - 1 ? 'var(--text-faint)' : 'var(--text)',
          cursor: currentPage >= totalPages - 1 ? 'default' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all var(--transition-fast)',
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 700 }}>&gt;</span>
      </button>
    </div>
  );
}
