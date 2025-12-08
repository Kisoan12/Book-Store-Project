import React from 'react';
import { useNavigate } from 'react-router-dom';

const PLACEHOLDER = 'https://via.placeholder.com/300x450?text=Book+Cover';

export function Container({ children, className = '' }) {
  return <div className={`max-w-[1280px] mx-auto ${className}`}>{children}</div>;
}


export default function ProductCard({ book = {} }) {
  const navigate = useNavigate();
  const id = book._id || book.id || book.itemId || '';

  const openDetail = (e) => {
    if (!id) return;
    navigate(`/book/${id}`);
  };

  return (
    <article
      onClick={openDetail}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') openDetail(e); }}
      className="bg-card rounded-2xl-lg overflow-hidden border border-white/4 shadow-card-md transform hover:-translate-y-1 transition cursor-pointer"
      aria-label={book.title ? `${book.title} — view details` : 'View book details'}
    >
      <div className="relative">
        <img
          src={book.itemImage || PLACEHOLDER}
          alt={book.title ? `${book.title} cover` : 'Book cover'}
          className="w-full h-64 object-cover"
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = PLACEHOLDER; }}
          loading="lazy"
        />

        {/* optional genre badge */}
        {book.genre && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs bg-black/50 text-white/90 backdrop-blur-sm">
            {book.genre}
          </span>
        )}
      </div>

      <div className="p-4 pt-3 pb-3 relative min-h-[88px]">
        {/* space reserved for any short excerpt (optional) */}
        {book.short && (
          <p className="text-sm text-muted line-clamp-2 mb-3">{book.short}</p>
        )}

        {/* bottom row: title+author (left) and price (right) */}
        <div className="absolute left-4 right-4 bottom-4 flex items-end justify-between">
          <div className="text-left">
            <h3 className="text-sm font-semibold leading-tight line-clamp-2" title={book.title}>
              {book.title || 'Untitled'}
            </h3>
            <p className="text-xs text-muted mt-0.5">{book.author || 'Unknown author'}</p>
          </div>

          <div className="text-right">
            <div className="text-sm font-bold text-accent">₹{book.price ?? '—'}</div>
          </div>
        </div>
      </div>
    </article>
  );
}
