import { Link } from 'react-router-dom';
import { useApi, imgUrl } from '../hooks/useApi';

// Icon fallback theo tên danh mục
function CategoryIcon({ name, color }) {
  const n = (name || '').toLowerCase();
  if (n.includes('laptop') || n.includes('máy tính'))
    return (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
        <rect x="2" y="4" width="20" height="14" rx="2"/><path d="M2 20h20"/>
      </svg>
    );
  if (n.includes('bảng') || n.includes('tablet'))
    return (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
        <rect x="4" y="2" width="16" height="20" rx="3"/>
        <circle cx="12" cy="18" r="1" fill={color} stroke="none"/>
      </svg>
    );
  if (n.includes('tai nghe') || n.includes('loa'))
    return (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"/>
        <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
      </svg>
    );
  if (n.includes('đồng hồ') || n.includes('smartwatch'))
    return (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
        <rect x="7" y="4" width="10" height="16" rx="4"/>
        <path d="M9 4V2M15 4V2M9 20v2M15 20v2"/>
        <circle cx="12" cy="12" r="2"/>
      </svg>
    );
  if (n.includes('phụ kiện') || n.includes('accessories'))
    return (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    );
  // Mặc định: điện thoại
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
      <rect x="5" y="2" width="14" height="20" rx="3"/>
      <line x1="12" y1="18" x2="12" y2="18" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

const PALETTE = ['#3182ce','#805ad5','#38a169','#e53e3e','#f6ad55','#ed8936','#0bc5ea','#d69e2e'];

export default function CategorySection() {
  const { data: categories, loading } = useApi('/categories/products');

  if (loading) return null; // Không chiếm không gian khi đang load

  const items = categories && categories.length > 0 ? categories : [];
  if (items.length === 0) return null;

  return (
    <section style={{ padding: '48px 0 0' }}>
      <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '0 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <div style={{ width: '4px', height: '28px', background: '#f6ad55', borderRadius: '2px' }} />
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#1a202c', margin: 0 }}>Danh mục nổi bật</h2>
            </div>
            <p style={{ fontSize: '14px', color: '#718096', marginLeft: '14px' }}>
              Khám phá hàng nghìn sản phẩm theo từng danh mục
            </p>
          </div>
          <Link to="/shop" style={{ fontSize: '13.5px', fontWeight: 600, color: '#f6ad55' }}>
            Xem tất cả →
          </Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(items.length, 6)}, 1fr)`,
          gap: '14px'
        }}>
          {items.map((cat, idx) => {
            const color = PALETTE[idx % PALETTE.length];
            const bg = `${color}1e`; // 12% opacity
            return (
              <Link key={cat.id} to={`/shop?categoryId=${cat.id}`}
                style={{
                  background: '#fff', borderRadius: '14px', padding: '24px 16px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
                  boxShadow: '0 1px 4px rgba(0,0,0,.06)', border: '1px solid #e8ecf0',
                  transition: 'transform .2s, box-shadow .2s', textDecoration: 'none',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,.06)'; }}
              >
                <div style={{
                  width: '62px', height: '62px', borderRadius: '50%',
                  background: bg, color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden', flexShrink: 0
                }}>
                  {cat.imageUrl
                    ? <img src={imgUrl(cat.imageUrl)} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} onError={e => { e.target.style.display = 'none'; }} />
                    : <CategoryIcon name={cat.name} color={color} />
                  }
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#1a202c' }}>{cat.name}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
