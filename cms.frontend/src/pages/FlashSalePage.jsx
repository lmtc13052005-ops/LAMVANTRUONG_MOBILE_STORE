import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { imgUrl, formatPrice } from '../hooks/useApi';

const API = process.env.REACT_APP_API_BASE_URL || 'https://localhost:7094/api';

function useCountdown() {
  const [time, setTime] = useState({ h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const end = new Date();
      end.setHours(23, 59, 59, 0);
      const diff = Math.max(0, Math.floor((end - now) / 1000));
      setTime({ h: Math.floor(diff / 3600), m: Math.floor((diff % 3600) / 60), s: diff % 60 });
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);
  return time;
}

function pad(n) { return String(n).padStart(2, '0'); }

function FlashCard({ product, index }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const price = Number(product.price);
  const originalPrice = Math.round(price * 1.25);
  const discountPct = Math.round((1 - price / originalPrice) * 100);
  const src = imgUrl(product.imageUrl);
  const inStock = product.stockQuantity > 0;

  return (
    <div className="prod-card" style={{
      background: '#fff', borderRadius: '14px', overflow: 'hidden',
      boxShadow: '0 2px 12px rgba(0,0,0,.08)', position: 'relative',
      border: '2px solid transparent',
      backgroundClip: 'padding-box',
      transition: 'transform .25s, box-shadow .25s'
    }}>
      {/* Flash badge */}
      <div style={{
        position: 'absolute', top: '10px', left: '10px', zIndex: 2,
        background: 'linear-gradient(135deg, #e53e3e, #c62828)',
        color: '#fff', fontSize: '12px', fontWeight: 800,
        padding: '4px 10px', borderRadius: '6px',
        display: 'flex', alignItems: 'center', gap: '4px',
        boxShadow: '0 2px 8px rgba(229,62,62,.4)'
      }}>
        ⚡ -{discountPct}%
      </div>

      {/* Sold count */}
      <div style={{
        position: 'absolute', top: '10px', right: '10px', zIndex: 2,
        background: 'rgba(0,0,0,.55)', color: '#fff', fontSize: '11px',
        fontWeight: 600, padding: '3px 8px', borderRadius: '5px'
      }}>
        Đã bán {(product.id * 47 + index * 23) % 500 + 50}
      </div>

      {/* Image */}
      <div style={{ aspectRatio: '1', overflow: 'hidden', background: '#f7f9fc' }}>
        {src ? (
          <img src={src} alt={product.name} className="prod-img"
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .35s' }}
            onError={e => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#1a2332,#2d3748)' }}>
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#f6ad55" strokeWidth="1.5"><rect x="5" y="2" width="14" height="20" rx="3"/><line x1="12" y1="18" x2="12" y2="18" strokeWidth="2.5" strokeLinecap="round"/></svg>
          </div>
        )}
      </div>

      {/* Progress bar tồn kho */}
      <div style={{ margin: '0 14px', marginTop: '12px' }}>
        <div style={{ height: '6px', background: '#fee2e2', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: '3px',
            background: 'linear-gradient(90deg, #e53e3e, #f6ad55)',
            width: `${Math.max(10, 100 - (product.stockQuantity / 20) * 100)}%`,
            transition: 'width .5s'
          }} />
        </div>
        <div style={{ fontSize: '11px', color: '#e53e3e', fontWeight: 600, marginTop: '3px' }}>
          Còn {product.stockQuantity} sản phẩm
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '10px 14px 14px' }}>
        <div style={{ fontSize: '10.5px', color: '#f6ad55', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: '5px' }}>
          {product.category}
        </div>
        <Link to={`/product/${product.id}`} style={{
          fontSize: '13.5px', fontWeight: 600, color: '#1a202c', lineHeight: 1.4,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          overflow: 'hidden', minHeight: '38px', textDecoration: 'none', marginBottom: '10px', display: 'block'
        }}>{product.name}</Link>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px' }}>
          <span style={{ fontSize: '18px', fontWeight: 900, color: '#e53e3e' }}>{formatPrice(price)}</span>
          <span style={{ fontSize: '13px', color: '#a0aec0', textDecoration: 'line-through' }}>{formatPrice(originalPrice)}</span>
        </div>

        <button disabled={!inStock || added} onClick={() => { addItem(product); setAdded(true); setTimeout(() => setAdded(false), 1800); }} style={{
          width: '100%', padding: '11px', borderRadius: '9px', border: 'none',
          background: added ? '#38a169' : inStock ? 'linear-gradient(135deg,#e53e3e,#c62828)' : '#a0aec0',
          color: '#fff', fontWeight: 700, fontSize: '13.5px',
          cursor: inStock ? 'pointer' : 'not-allowed',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          boxShadow: inStock && !added ? '0 4px 12px rgba(229,62,62,.3)' : 'none',
          transition: 'all .2s'
        }}>
          {added ? '✓ Đã thêm' : inStock ? '⚡ Mua ngay' : 'Hết hàng'}
        </button>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div style={{ background: '#fff', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,.08)' }}>
      <div style={{ aspectRatio: '1', background: '#f0f2f5' }} />
      <div style={{ padding: '14px' }}>
        {[80, 100, 60, 70].map((w, i) => <div key={i} style={{ height: '12px', background: '#f0f2f5', borderRadius: '4px', marginBottom: '10px', width: `${w}%` }} />)}
      </div>
    </div>
  );
}

export default function FlashSalePage() {
  const { h, m, s } = useCountdown();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/products?sort=hot&pageSize=12`)
      .then(r => r.json())
      .then(data => { setProducts(data.items || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <main style={{ background: '#f0f2f5', minHeight: '80vh' }}>
      {/* Hero banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1a0a0a 0%, #2d1515 50%, #1a0a0a 100%)',
        padding: '40px 28px', textAlign: 'center', position: 'relative', overflow: 'hidden'
      }}>
        {/* Background decorations */}
        <div style={{ position: 'absolute', top: '-40px', left: '10%', fontSize: '120px', opacity: 0.04, userSelect: 'none' }}>⚡</div>
        <div style={{ position: 'absolute', bottom: '-30px', right: '10%', fontSize: '100px', opacity: 0.04, userSelect: 'none' }}>⚡</div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ fontSize: '36px' }}>⚡</span>
            <span style={{ fontSize: '40px', fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>
              FLASH SALE
            </span>
            <span style={{ fontSize: '36px' }}>⚡</span>
          </div>
          <p style={{ color: '#fca5a5', fontSize: '15px', margin: '0 0 24px' }}>
            Ưu đãi sốc mỗi ngày — Giảm đến 25% cho sản phẩm Hot!
          </p>

          {/* Countdown */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#a0aec0', fontSize: '14px', fontWeight: 600 }}>Kết thúc sau:</span>
            {[{ val: h, unit: 'GIỜ' }, { val: m, unit: 'PHÚT' }, { val: s, unit: 'GIÂY' }].map((t, i) => (
              <div key={t.unit} style={{ display: 'flex', alignItems: 'center', gap: i < 2 ? '10px' : 0 }}>
                <div style={{
                  background: '#1a202c', border: '2px solid #e53e3e',
                  borderRadius: '10px', padding: '10px 16px', minWidth: '60px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '28px', fontWeight: 900, color: '#e53e3e', lineHeight: 1 }}>{pad(t.val)}</div>
                  <div style={{ fontSize: '10px', color: '#718096', fontWeight: 600, marginTop: '3px' }}>{t.unit}</div>
                </div>
                {i < 2 && <span style={{ fontSize: '24px', color: '#e53e3e', fontWeight: 900, marginRight: '0' }}>:</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Products */}
      <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '32px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '4px', height: '28px', background: '#e53e3e', borderRadius: '2px' }} />
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#1a202c', margin: 0 }}>Sản phẩm Flash Sale</h2>
          </div>
          <Link to="/shop?sort=hot" style={{ fontSize: '13.5px', fontWeight: 600, color: '#e53e3e' }}>Xem tất cả →</Link>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 28px', background: '#fff', borderRadius: '14px' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>⚡</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#1a202c' }}>Chưa có sản phẩm Flash Sale</div>
            <div style={{ fontSize: '14px', color: '#718096', marginTop: '8px' }}>Hãy đánh dấu "Hot" cho sản phẩm trong trang quản trị để hiển thị tại đây.</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {products.map((p, i) => <FlashCard key={p.id} product={p} index={i} />)}
          </div>
        )}
      </div>
    </main>
  );
}
