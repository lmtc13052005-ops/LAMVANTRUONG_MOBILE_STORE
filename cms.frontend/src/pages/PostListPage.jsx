import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useApi, imgUrl } from '../hooks/useApi';

function PostCard({ post }) {
  const src = imgUrl(post.imageUrl);
  const date = new Date(post.createdDate).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });

  return (
    <div className="recent-card" style={{
      background: '#fff', borderRadius: '12px', overflow: 'hidden',
      boxShadow: '0 1px 6px rgba(0,0,0,.07)', transition: 'box-shadow .2s, transform .2s'
    }}>
      {/* Thumbnail */}
      <Link to={`/blog/${post.id}`}>
        <div style={{ aspectRatio: '16/9', overflow: 'hidden', background: 'linear-gradient(135deg, #1a2332, #2d3748)' }}>
          {src ? (
            <img src={src} alt={post.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .35s' }}
              className="prod-img"
              onError={e => { e.target.style.display = 'none'; }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#f6ad55" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
          )}
        </div>
      </Link>

      <div style={{ padding: '18px' }}>
        {/* Category + date */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <span style={{
            background: '#f6ad55', color: '#111827', fontSize: '11px',
            fontWeight: 700, padding: '3px 10px', borderRadius: '5px'
          }}>
            {post.category || 'Blog'}
          </span>
          <span style={{ fontSize: '12px', color: '#a0aec0' }}>{date}</span>
        </div>

        <Link to={`/blog/${post.id}`} style={{
          fontSize: '16px', fontWeight: 700, color: '#1a202c', lineHeight: 1.45,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          overflow: 'hidden', textDecoration: 'none', marginBottom: '14px',
          transition: 'color .2s'
        }}
        onMouseEnter={e => { e.currentTarget.style.color = '#f6ad55'; }}
        onMouseLeave={e => { e.currentTarget.style.color = '#1a202c'; }}
        >
          {post.title}
        </Link>

        <Link to={`/blog/${post.id}`} style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          fontSize: '13px', fontWeight: 600, color: '#f6ad55', textDecoration: 'none'
        }}>
          Đọc tiếp
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>
      </div>
    </div>
  );
}

function Pagination({ page, totalPages, onPage }) {
  if (totalPages <= 1) return null;
  const pages = [];
  for (let i = 1; i <= totalPages; i++) pages.push(i);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '36px' }}>
      <button onClick={() => onPage(page - 1)} disabled={page === 1} className="page-btn" style={{
        padding: '8px 14px', border: '1px solid #e2e8f0', borderRadius: '7px',
        background: '#fff', color: page === 1 ? '#a0aec0' : '#1a202c',
        cursor: page === 1 ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: '13px'
      }}>‹</button>
      {pages.map(p => (
        <button key={p} onClick={() => onPage(p)} className={p !== page ? 'page-btn' : ''} style={{
          padding: '8px 14px', border: '1px solid #e2e8f0', borderRadius: '7px',
          background: p === page ? '#111827' : '#fff',
          color: p === page ? '#f6ad55' : '#1a202c',
          cursor: 'pointer', fontWeight: 600, fontSize: '13px'
        }}>{p}</button>
      ))}
      <button onClick={() => onPage(page + 1)} disabled={page === totalPages} className="page-btn" style={{
        padding: '8px 14px', border: '1px solid #e2e8f0', borderRadius: '7px',
        background: '#fff', color: page === totalPages ? '#a0aec0' : '#1a202c',
        cursor: page === totalPages ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: '13px'
      }}>›</button>
    </div>
  );
}

export default function PostListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1');
  const categoryId = searchParams.get('categoryId') || '';

  const { data: catData } = useApi('/categories/posts');
  const queryStr = `/posts?page=${page}&pageSize=6${categoryId ? `&categoryId=${categoryId}` : ''}`;
  const { data, loading, error } = useApi(queryStr);

  const posts = data?.items || [];
  const totalPages = data?.totalPages || 1;
  const total = data?.total || 0;

  const goPage = (p) => setSearchParams({ page: p, ...(categoryId ? { categoryId } : {}) });
  const goCategory = (id) => setSearchParams({ page: 1, ...(id ? { categoryId: id } : {}) });

  return (
    <main style={{ background: '#f0f2f5', minHeight: '60vh' }}>
      {/* Breadcrumb */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '11px 28px', display: 'flex', alignItems: 'center', gap: '7px', fontSize: '13px', color: '#718096' }}>
          <Link to="/" style={{ color: '#718096' }} className="nav-link">Trang chủ</Link>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M4.5 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
          <span style={{ color: '#1a202c', fontWeight: 600 }}>Blog</span>
        </div>
      </div>

      <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '28px 28px' }}>
        <div style={{ display: 'flex', gap: '28px', alignItems: 'flex-start' }}>
          {/* Sidebar danh mục */}
          {catData && catData.length > 0 && (
            <aside style={{ width: '220px', flexShrink: 0 }}>
              <div style={{ background: '#fff', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
                <div style={{ background: '#1a2332', color: '#fff', padding: '14px 18px', fontSize: '14px', fontWeight: 700 }}>
                  Danh mục bài viết
                </div>
                <div style={{ padding: '12px' }}>
                  <button onClick={() => goCategory('')} style={{
                    width: '100%', textAlign: 'left', padding: '9px 12px', borderRadius: '7px',
                    background: !categoryId ? '#f6ad55' : 'transparent',
                    color: !categoryId ? '#111827' : '#4a5568',
                    fontWeight: !categoryId ? 700 : 500, fontSize: '13.5px', border: 'none', cursor: 'pointer', marginBottom: '4px'
                  }}>Tất cả</button>
                  {catData.map(c => (
                    <button key={c.id} onClick={() => goCategory(c.id)} style={{
                      width: '100%', textAlign: 'left', padding: '9px 12px', borderRadius: '7px',
                      background: categoryId === String(c.id) ? '#f6ad55' : 'transparent',
                      color: categoryId === String(c.id) ? '#111827' : '#4a5568',
                      fontWeight: categoryId === String(c.id) ? 700 : 500,
                      fontSize: '13.5px', border: 'none', cursor: 'pointer', marginBottom: '4px'
                    }}>{c.name}</button>
                  ))}
                </div>
              </div>
            </aside>
          )}

          {/* Main content */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
              <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#1a202c', margin: 0 }}>
                {categoryId ? (catData?.find(c => String(c.id) === categoryId)?.name || 'Bài viết') : 'Tất cả bài viết'}
              </h1>
              {total > 0 && <span style={{ fontSize: '13px', color: '#718096' }}>{total} bài viết</span>}
            </div>

            {error && (
              <div style={{ padding: '40px', textAlign: 'center', color: '#e53e3e' }}>
                Không tải được dữ liệu. Kiểm tra kết nối đến Backend.
              </div>
            )}

            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                {[1,2,3,4].map(i => (
                  <div key={i} style={{ background: '#fff', borderRadius: '12px', height: '280px', boxShadow: '0 1px 6px rgba(0,0,0,.07)' }} />
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#a0aec0' }}>
                <div style={{ fontSize: '56px', marginBottom: '14px' }}>📝</div>
                <div style={{ fontSize: '16px' }}>Chưa có bài viết nào.</div>
                <div style={{ fontSize: '13px', marginTop: '6px' }}>Hãy thêm bài viết trong trang quản trị.</div>
              </div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                  {posts.map(p => <PostCard key={p.id} post={p} />)}
                </div>
                <Pagination page={page} totalPages={totalPages} onPage={goPage} />
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
