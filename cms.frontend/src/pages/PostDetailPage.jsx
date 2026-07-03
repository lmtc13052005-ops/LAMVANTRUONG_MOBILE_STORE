import { Link, useParams } from 'react-router-dom';
import { useApi, imgUrl } from '../hooks/useApi';

export default function PostDetailPage() {
  const { id } = useParams();
  const { data: post, loading, error } = useApi(id ? `/posts/${id}` : null);

  if (loading) {
    return (
      <main style={{ background: '#f0f2f5', minHeight: '60vh' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto', padding: '40px 28px' }}>
          {[1,2,3,4].map(i => (
            <div key={i} style={{
              height: i === 1 ? '40px' : '14px', background: '#e8ecf0',
              borderRadius: '6px', marginBottom: '16px', width: i === 1 ? '70%' : `${60 + i * 10}%`
            }} />
          ))}
        </div>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main style={{ background: '#f0f2f5', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#718096', padding: '60px 28px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>😕</div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#1a202c', marginBottom: '8px' }}>
            Không tìm thấy bài viết
          </div>
          <Link to="/blog" style={{
            display: 'inline-block', marginTop: '16px',
            padding: '12px 28px', background: '#f6ad55', color: '#111827',
            borderRadius: '8px', fontWeight: 700, fontSize: '14px'
          }}>← Quay lại Blog</Link>
        </div>
      </main>
    );
  }

  const date = new Date(post.createdDate).toLocaleDateString('vi-VN', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
  });
  const src = imgUrl(post.imageUrl);

  return (
    <main style={{ background: '#f0f2f5', minHeight: '60vh' }}>
      {/* Breadcrumb */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '11px 28px', display: 'flex', alignItems: 'center', gap: '7px', fontSize: '13px', color: '#718096' }}>
          <Link to="/" className="nav-link" style={{ color: '#718096' }}>Trang chủ</Link>
          <span>›</span>
          <Link to="/blog" className="nav-link" style={{ color: '#718096' }}>Blog</Link>
          <span>›</span>
          <span style={{ color: '#1a202c', fontWeight: 600 }} title={post.title}>
            {post.title.length > 50 ? post.title.substring(0, 50) + '…' : post.title}
          </span>
        </div>
      </div>

      {/* Article */}
      <div style={{ maxWidth: '820px', margin: '0 auto', padding: '36px 28px 60px' }}>
        <article style={{ background: '#fff', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,.08)' }}>
          {/* Header image */}
          {src && (
            <div style={{ aspectRatio: '16/7', overflow: 'hidden' }}>
              <img src={src} alt={post.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={e => { e.target.parentNode.style.display = 'none'; }}
              />
            </div>
          )}

          <div style={{ padding: '36px 40px' }}>
            {/* Meta */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px', flexWrap: 'wrap' }}>
              <span style={{
                background: '#f6ad55', color: '#111827',
                fontSize: '11px', fontWeight: 800,
                padding: '4px 12px', borderRadius: '5px', letterSpacing: '0.5px'
              }}>
                {post.category || 'Blog'}
              </span>
              <span style={{ fontSize: '13px', color: '#718096' }}>{date}</span>
            </div>

            {/* Title */}
            <h1 style={{
              fontSize: '30px', fontWeight: 800, color: '#1a202c',
              lineHeight: 1.35, marginBottom: '28px'
            }}>
              {post.title}
            </h1>

            {/* Divider */}
            <div style={{ height: '3px', width: '60px', background: '#f6ad55', borderRadius: '2px', marginBottom: '28px' }} />

            {/* Content — tiêu chí #44: dangerouslySetInnerHTML hiển thị HTML từ CKEditor */}
            {post.content ? (
              <div
                className="ck-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
                style={{
                  fontSize: '16px', lineHeight: 1.85, color: '#2d3748',
                  /* Các style cho nội dung CKEditor */
                }}
              />
            ) : (
              <p style={{ color: '#a0aec0', fontStyle: 'italic' }}>Bài viết chưa có nội dung.</p>
            )}
          </div>
        </article>

        {/* Back link */}
        <div style={{ marginTop: '28px' }}>
          <Link to="/blog" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            color: '#718096', fontSize: '14px', fontWeight: 600
          }} className="nav-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Xem tất cả bài viết
          </Link>
        </div>
      </div>
    </main>
  );
}
