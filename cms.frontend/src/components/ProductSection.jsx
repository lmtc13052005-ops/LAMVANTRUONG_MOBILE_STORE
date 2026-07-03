import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApi, imgUrl, formatPrice } from '../hooks/useApi';
import { useCart } from '../context/CartContext';

function ProductCard({ product, index }) {
  const { addItem } = useCart();
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);

  const price = Number(product.price);
  const originalPrice = Math.round(price * 1.15);
  const discountPct = Math.round((1 - price / originalPrice) * 100);
  const src = imgUrl(product.imageUrl);

  return (
    <div className="prod-card" style={{
      background: '#fff', borderRadius: '12px', overflow: 'hidden',
      boxShadow: '0 1px 6px rgba(0,0,0,.07)', position: 'relative',
      transition: 'box-shadow .25s', animationDelay: `${index * 0.06}s`
    }}>
      {/* Badge */}
      {product.isHot && (
        <div style={{
          position: 'absolute', top: '10px', left: '10px', zIndex: 2,
          background: '#f6ad55', color: '#111827', fontSize: '11px',
          fontWeight: 700, padding: '3px 8px', borderRadius: '5px'
        }}>Hot</div>
      )}
      {!product.isHot && discountPct >= 5 && (
        <div style={{
          position: 'absolute', top: '10px', left: '10px', zIndex: 2,
          background: '#e53e3e', color: '#fff', fontSize: '11px',
          fontWeight: 700, padding: '3px 8px', borderRadius: '5px'
        }}>-{discountPct}%</div>
      )}

      {/* Wishlist */}
      <button className="wishlist-btn" onClick={() => setWished(w => !w)} style={{
        position: 'absolute', top: '10px', right: '10px', zIndex: 2,
        background: 'rgba(255,255,255,0.92)', borderRadius: '50%',
        width: '32px', height: '32px', display: 'flex', alignItems: 'center',
        justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,.1)',
        color: wished ? '#e53e3e' : '#a0aec0',
        transition: 'color .2s, background .2s', border: 'none', cursor: 'pointer'
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24"
          fill={wished ? 'currentColor' : 'none'}
          stroke="currentColor" strokeWidth="2.2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>

      {/* Image */}
      <div style={{ aspectRatio: '1', overflow: 'hidden', background: '#f7f9fc' }}>
        {src ? (
          <img className="prod-img" src={src} alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .35s' }}
            onError={e => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%', display: 'flex', alignItems: 'center',
            justifyContent: 'center', background: 'linear-gradient(135deg, #1a2332, #2d3748)'
          }}>
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#f6ad55" strokeWidth="1.5">
              <rect x="5" y="2" width="14" height="20" rx="3"/>
              <line x1="12" y1="18" x2="12" y2="18" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '14px' }}>
        <div style={{
          fontSize: '10.5px', color: '#f6ad55', fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: '6px'
        }}>
          {product.category || 'Sản phẩm'}
        </div>

        <Link to={`/product/${product.id}`} style={{
          fontSize: '13.5px', fontWeight: 600, color: '#1a202c', lineHeight: 1.45,
          marginBottom: '8px',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          overflow: 'hidden', minHeight: '40px', textDecoration: 'none'
        }}>
          {product.name}
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '10px' }}>
          <span style={{ color: '#f6ad55', fontSize: '12px', letterSpacing: '1px' }}>★★★★★</span>
          <span style={{ fontSize: '11.5px', color: '#a0aec0' }}>(1.243)</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '16px', fontWeight: 800, color: '#1a202c' }}>
            {formatPrice(price)}
          </span>
          <span style={{ fontSize: '12.5px', color: '#a0aec0', textDecoration: 'line-through' }}>
            {formatPrice(originalPrice)}
          </span>
        </div>

        {/* Tồn kho */}
        {product.stockQuantity === 0 && (
          <div style={{ fontSize: '12px', color: '#e53e3e', marginBottom: '8px', fontWeight: 600 }}>
            Hết hàng
          </div>
        )}

        <button
          disabled={product.stockQuantity === 0 || added}
          onClick={() => { addItem(product); setAdded(true); setTimeout(() => setAdded(false), 1800); }}
          style={{
            width: '100%', padding: '10px',
            background: added ? '#38a169' : product.stockQuantity === 0 ? '#a0aec0' : '#111827',
            color: added || product.stockQuantity === 0 ? '#fff' : '#f6ad55',
            fontWeight: 700, fontSize: '13px', borderRadius: '8px', border: '1px solid #2d3748',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            cursor: product.stockQuantity === 0 ? 'not-allowed' : 'pointer',
            transition: 'background .2s'
          }}
        >
          {added ? '✓ Đã thêm' : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              {product.stockQuantity === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div style={{
      background: '#fff', borderRadius: '12px', overflow: 'hidden',
      boxShadow: '0 1px 6px rgba(0,0,0,.07)'
    }}>
      <div style={{ aspectRatio: '1', background: 'linear-gradient(90deg, #f0f2f5 25%, #e8ecf0 50%, #f0f2f5 75%)', backgroundSize: '200% 100%' }} />
      <div style={{ padding: '14px' }}>
        {[80, 100, 60, 70].map((w, i) => (
          <div key={i} style={{ height: '12px', background: '#f0f2f5', borderRadius: '4px', marginBottom: '10px', width: `${w}%` }} />
        ))}
      </div>
    </div>
  );
}

export default function ProductSection({ title, apiPath, viewAllLink }) {
  const { data, loading, error } = useApi(apiPath);
  const products = Array.isArray(data) ? data : [];

  return (
    <section style={{ padding: '48px 0 0' }}>
      <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '0 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '4px', height: '28px', background: '#f6ad55', borderRadius: '2px' }} />
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#1a202c', margin: 0 }}>{title}</h2>
          </div>
          {viewAllLink && (
            <Link to={viewAllLink} style={{ fontSize: '13.5px', fontWeight: 600, color: '#f6ad55' }}>
              Xem tất cả →
            </Link>
          )}
        </div>

        {error && (
          <div style={{ padding: '20px', textAlign: 'center', color: '#e53e3e', fontSize: '14px' }}>
            Không tải được dữ liệu. Vui lòng kiểm tra kết nối đến Backend.
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {loading
            ? [1, 2, 3].map(i => <SkeletonCard key={i} />)
            : products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)
          }
        </div>

        {!loading && !error && products.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#a0aec0' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>📦</div>
            <div>Chưa có sản phẩm nào. Hãy thêm sản phẩm trong trang quản trị.</div>
          </div>
        )}
      </div>
    </section>
  );
}
