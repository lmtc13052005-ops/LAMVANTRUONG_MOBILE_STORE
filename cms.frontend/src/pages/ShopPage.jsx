import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { imgUrl, formatPrice } from '../hooks/useApi';
import { useCart } from '../context/CartContext';

const API = process.env.REACT_APP_API_BASE_URL || 'https://localhost:7094/api';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'price_asc', label: 'Giá: Thấp → Cao' },
  { value: 'price_desc', label: 'Giá: Cao → Thấp' },
  { value: 'hot', label: 'Bán chạy' },
];

function ProductCard({ product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const price = Number(product.price);
  const originalPrice = Math.round(price * 1.15);
  const discountPct = Math.round((1 - price / originalPrice) * 100);
  const src = imgUrl(product.imageUrl);
  const inStock = product.stockQuantity > 0;

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="prod-card" style={{
      background: '#fff', borderRadius: '12px', overflow: 'hidden',
      boxShadow: '0 1px 6px rgba(0,0,0,.07)', position: 'relative'
    }}>
      {product.isHot && (
        <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 2, background: '#f6ad55', color: '#111827', fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '5px' }}>Hot</div>
      )}
      {!product.isHot && discountPct >= 5 && (
        <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 2, background: '#e53e3e', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '5px' }}>-{discountPct}%</div>
      )}

      <div style={{ aspectRatio: '1', overflow: 'hidden', background: '#f7f9fc' }}>
        {src ? (
          <img src={src} alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .35s' }}
            className="prod-img"
            onError={e => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#1a2332,#2d3748)' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#f6ad55" strokeWidth="1.5"><rect x="5" y="2" width="14" height="20" rx="3"/><line x1="12" y1="18" x2="12" y2="18" strokeWidth="2.5" strokeLinecap="round"/></svg>
          </div>
        )}
      </div>

      <div style={{ padding: '14px' }}>
        <div style={{ fontSize: '10.5px', color: '#f6ad55', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: '6px' }}>{product.category}</div>
        <Link to={`/product/${product.id}`} style={{
          fontSize: '13.5px', fontWeight: 600, color: '#1a202c', lineHeight: 1.45, marginBottom: '8px',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          overflow: 'hidden', minHeight: '40px', textDecoration: 'none'
        }}>{product.name}</Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '10px' }}>
          <span style={{ color: '#f6ad55', fontSize: '12px' }}>★★★★★</span>
          <span style={{ fontSize: '11.5px', color: '#a0aec0' }}>(1.243)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '16px', fontWeight: 800, color: '#1a202c' }}>{formatPrice(price)}</span>
          <span style={{ fontSize: '12.5px', color: '#a0aec0', textDecoration: 'line-through' }}>{formatPrice(originalPrice)}</span>
        </div>
        {!inStock && <div style={{ fontSize: '12px', color: '#e53e3e', marginBottom: '8px', fontWeight: 600 }}>Hết hàng</div>}
        <button disabled={!inStock || added} onClick={handleAdd} style={{
          width: '100%', padding: '10px', borderRadius: '8px', border: 'none',
          background: added ? '#38a169' : inStock ? '#111827' : '#a0aec0',
          color: added ? '#fff' : inStock ? '#f6ad55' : '#fff',
          fontWeight: 700, fontSize: '13px', cursor: inStock ? 'pointer' : 'not-allowed',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all .2s'
        }}>
          {added ? '✓ Đã thêm' : inStock ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              Thêm vào giỏ
            </>
          ) : 'Hết hàng'}
        </button>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,.07)' }}>
      <div style={{ aspectRatio: '1', background: 'linear-gradient(90deg,#f0f2f5 25%,#e8ecf0 50%,#f0f2f5 75%)', backgroundSize: '200% 100%' }} />
      <div style={{ padding: '14px' }}>
        {[80, 100, 60, 70].map((w, i) => <div key={i} style={{ height: '12px', background: '#f0f2f5', borderRadius: '4px', marginBottom: '10px', width: `${w}%` }} />)}
      </div>
    </div>
  );
}

function Pagination({ page, totalPages, onPage }) {
  if (totalPages <= 1) return null;
  const pages = [];
  for (let i = 1; i <= Math.min(totalPages, 7); i++) pages.push(i);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '36px' }}>
      {page > 1 && (
        <button onClick={() => onPage(page - 1)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontWeight: 600, color: '#4a5568' }}>← Trước</button>
      )}
      {pages.map(p => (
        <button key={p} onClick={() => onPage(p)} style={{
          padding: '8px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700,
          background: p === page ? '#111827' : '#fff',
          color: p === page ? '#f6ad55' : '#4a5568',
          border: p === page ? 'none' : '1px solid #e2e8f0'
        }}>{p}</button>
      ))}
      {page < totalPages && (
        <button onClick={() => onPage(page + 1)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontWeight: 600, color: '#4a5568' }}>Tiếp →</button>
      )}
    </div>
  );
}

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const qParam = searchParams.get('q') || '';
  const catParam = searchParams.get('categoryId') || '';
  const sortParam = searchParams.get('sort') || 'newest';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  // Bộ lọc giá local (áp dụng khi bấm nút)
  const [minInput, setMinInput] = useState('');
  const [maxInput, setMaxInput] = useState('');

  // Kết quả API
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  // Tải danh mục một lần
  useEffect(() => {
    fetch(`${API}/categories/products`)
      .then(r => r.json())
      .then(setCategories)
      .catch(() => {});
  }, []);

  // Tải sản phẩm mỗi khi params thay đổi
  useEffect(() => {
    setLoading(true);
    const minP = searchParams.get('minPrice') || '';
    const maxP = searchParams.get('maxPrice') || '';
    setMinInput(minP);
    setMaxInput(maxP);

    const params = new URLSearchParams();
    if (qParam) params.set('search', qParam);
    if (catParam) params.set('categoryId', catParam);
    params.set('sort', sortParam);
    params.set('page', String(pageParam));
    params.set('pageSize', '12');
    if (minP) params.set('minPrice', minP);
    if (maxP) params.set('maxPrice', maxP);

    fetch(`${API}/products?${params.toString()}`)
      .then(r => r.json())
      .then(data => {
        setProducts(data.items || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 0);
      })
      .catch(() => { setProducts([]); setTotal(0); })
      .finally(() => setLoading(false));
  }, [searchParams]);

  const updateParams = useCallback((updates) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) => {
      if (v) next.set(k, v); else next.delete(k);
    });
    next.set('page', '1');
    setSearchParams(next);
  }, [searchParams, setSearchParams]);

  const applyPriceFilter = () => {
    const next = new URLSearchParams(searchParams);
    if (minInput) next.set('minPrice', minInput); else next.delete('minPrice');
    if (maxInput) next.set('maxPrice', maxInput); else next.delete('maxPrice');
    next.set('page', '1');
    setSearchParams(next);
  };

  const clearPriceFilter = () => {
    setMinInput(''); setMaxInput('');
    const next = new URLSearchParams(searchParams);
    next.delete('minPrice'); next.delete('maxPrice'); next.set('page', '1');
    setSearchParams(next);
  };

  const activeCategory = categories.find(c => String(c.id) === catParam);

  return (
    <main style={{ background: '#f0f2f5', minHeight: '80vh' }}>
      {/* Breadcrumb */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '11px 28px', display: 'flex', alignItems: 'center', gap: '7px', fontSize: '13px', color: '#718096' }}>
          <Link to="/" className="nav-link" style={{ color: '#718096' }}>Trang chủ</Link>
          <span>›</span>
          {activeCategory ? (
            <>
              <Link to="/shop" className="nav-link" style={{ color: '#718096' }}>Cửa hàng</Link>
              <span>›</span>
              <span style={{ color: '#1a202c', fontWeight: 600 }}>{activeCategory.name}</span>
            </>
          ) : qParam ? (
            <>
              <Link to="/shop" className="nav-link" style={{ color: '#718096' }}>Cửa hàng</Link>
              <span>›</span>
              <span style={{ color: '#1a202c', fontWeight: 600 }}>Kết quả: "{qParam}"</span>
            </>
          ) : (
            <span style={{ color: '#1a202c', fontWeight: 600 }}>Cửa hàng</span>
          )}
        </div>
      </div>

      <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '28px', display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
        {/* Sidebar */}
        <aside style={{ width: '240px', flexShrink: 0 }}>
          {/* Danh mục */}
          <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 6px rgba(0,0,0,.06)', marginBottom: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#1a202c', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '3px', height: '18px', background: '#f6ad55', borderRadius: '2px' }} />
              Danh mục
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <button onClick={() => updateParams({ categoryId: '' })} style={{
                padding: '8px 12px', borderRadius: '7px', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '13.5px',
                background: !catParam ? 'rgba(246,173,85,0.12)' : 'transparent',
                color: !catParam ? '#f6ad55' : '#4a5568', fontWeight: !catParam ? 700 : 400
              }}>Tất cả sản phẩm</button>
              {categories.map(cat => (
                <button key={cat.id} onClick={() => updateParams({ categoryId: String(cat.id) })} style={{
                  padding: '8px 12px', borderRadius: '7px', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '13.5px',
                  background: catParam === String(cat.id) ? 'rgba(246,173,85,0.12)' : 'transparent',
                  color: catParam === String(cat.id) ? '#f6ad55' : '#4a5568',
                  fontWeight: catParam === String(cat.id) ? 700 : 400
                }}>{cat.name}</button>
              ))}
            </div>
          </div>

          {/* Bộ lọc giá (#39) */}
          <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 6px rgba(0,0,0,.06)' }}>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#1a202c', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '3px', height: '18px', background: '#f6ad55', borderRadius: '2px' }} />
              Khoảng giá
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '11.5px', color: '#718096', display: 'block', marginBottom: '5px' }}>Giá từ (đ)</label>
                <input type="number" placeholder="0" value={minInput} onChange={e => setMinInput(e.target.value)}
                  style={{ width: '100%', padding: '9px 11px', border: '1px solid #e2e8f0', borderRadius: '7px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '11.5px', color: '#718096', display: 'block', marginBottom: '5px' }}>Giá đến (đ)</label>
                <input type="number" placeholder="100.000.000" value={maxInput} onChange={e => setMaxInput(e.target.value)}
                  style={{ width: '100%', padding: '9px 11px', border: '1px solid #e2e8f0', borderRadius: '7px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={applyPriceFilter} style={{
                  flex: 1, padding: '9px', background: '#111827', color: '#f6ad55', border: 'none',
                  borderRadius: '7px', fontWeight: 700, fontSize: '13px', cursor: 'pointer'
                }}>Áp dụng</button>
                {(searchParams.get('minPrice') || searchParams.get('maxPrice')) && (
                  <button onClick={clearPriceFilter} style={{
                    padding: '9px 12px', background: '#f0f2f5', color: '#718096',
                    border: 'none', borderRadius: '7px', fontSize: '13px', cursor: 'pointer'
                  }}>✕</button>
                )}
              </div>
              {/* Quick price ranges */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {[
                  { label: 'Dưới 5 triệu', min: '', max: '5000000' },
                  { label: '5 – 15 triệu', min: '5000000', max: '15000000' },
                  { label: '15 – 30 triệu', min: '15000000', max: '30000000' },
                  { label: 'Trên 30 triệu', min: '30000000', max: '' },
                ].map(r => (
                  <button key={r.label} onClick={() => {
                    setMinInput(r.min); setMaxInput(r.max);
                    const next = new URLSearchParams(searchParams);
                    if (r.min) next.set('minPrice', r.min); else next.delete('minPrice');
                    if (r.max) next.set('maxPrice', r.max); else next.delete('maxPrice');
                    next.set('page', '1');
                    setSearchParams(next);
                  }} style={{
                    padding: '7px 10px', border: '1px solid #e2e8f0', borderRadius: '6px',
                    background: '#fff', fontSize: '12.5px', color: '#4a5568', cursor: 'pointer', textAlign: 'left'
                  }}>{r.label}</button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div style={{ flex: 1 }}>
          {/* Toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', background: '#fff', padding: '12px 18px', borderRadius: '10px', boxShadow: '0 1px 6px rgba(0,0,0,.06)' }}>
            <span style={{ fontSize: '13.5px', color: '#718096' }}>
              {loading ? 'Đang tải...' : <><strong style={{ color: '#1a202c' }}>{total}</strong> sản phẩm{qParam && <> cho "<em>{qParam}</em>"</>}</>}
            </span>
            <select value={sortParam} onChange={e => updateParams({ sort: e.target.value })}
              style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '7px', fontSize: '13px', background: '#fff', color: '#1a202c', outline: 'none', cursor: 'pointer' }}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {/* Grid */}
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : products.length === 0 ? (
            /* Empty state (#43) */
            <div style={{ background: '#fff', borderRadius: '14px', padding: '80px 28px', textAlign: 'center', boxShadow: '0 1px 6px rgba(0,0,0,.06)' }}>
              <div style={{ fontSize: '72px', marginBottom: '20px', lineHeight: 1 }}>🔍</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#1a202c', marginBottom: '10px' }}>
                Không tìm thấy sản phẩm phù hợp
              </div>
              <div style={{ fontSize: '14px', color: '#718096', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px' }}>
                {qParam
                  ? `Không có kết quả nào cho "${qParam}". Hãy thử tìm kiếm với từ khoá khác.`
                  : 'Không có sản phẩm nào phù hợp với bộ lọc hiện tại. Hãy thử điều chỉnh bộ lọc.'}
              </div>
              <button onClick={() => setSearchParams(new URLSearchParams())} style={{
                padding: '12px 28px', background: '#111827', color: '#f6ad55',
                border: 'none', borderRadius: '9px', fontWeight: 700, fontSize: '14px', cursor: 'pointer'
              }}>Xem tất cả sản phẩm</button>
            </div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                {products.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
              <Pagination page={pageParam} totalPages={totalPages} onPage={p => updateParams({ page: String(p) })} />
            </>
          )}
        </div>
      </div>
    </main>
  );
}
