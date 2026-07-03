import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const API = process.env.REACT_APP_API_BASE_URL || 'https://localhost:7094/api';

// Từ khoá để tự động ghép nav link với danh mục từ API
const NAV_KEYWORDS = [
  { label: 'Điện thoại', keys: ['điện thoại', 'dien thoai', 'phone', 'smartphone'] },
  { label: 'Laptop & Máy tính', keys: ['laptop', 'máy tính', 'may tinh', 'computer', 'pc'] },
  { label: 'Phụ kiện', keys: ['phụ kiện', 'phu kien', 'accessory', 'phukien'] },
];

function findCategoryId(categories, keys) {
  const cat = categories.find(c =>
    keys.some(k => c.name.toLowerCase().includes(k.toLowerCase()))
  );
  return cat ? cat.id : null;
}

export default function Header() {
  const [query, setQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { count: cartCount } = useCart();
  const [categories, setCategories] = useState([]);
  const [selectedCatId, setSelectedCatId] = useState('');

  const [customer, setCustomer] = useState(() => {
    try { return JSON.parse(localStorage.getItem('customer') || 'null'); } catch { return null; }
  });
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef(null);

  // Đồng bộ trạng thái login khi localStorage thay đổi (sau login/logout)
  useEffect(() => {
    const sync = () => {
      try { setCustomer(JSON.parse(localStorage.getItem('customer') || 'null')); } catch { setCustomer(null); }
    };
    window.addEventListener('customerChanged', sync);
    return () => window.removeEventListener('customerChanged', sync);
  }, []);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleOutside = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) setAccountOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('customer');
    window.dispatchEvent(new Event('customerChanged'));
    setAccountOpen(false);
    navigate('/');
  };

  // Fetch danh mục một lần
  useEffect(() => {
    fetch(`${API}/categories/products`)
      .then(r => r.json())
      .then(setCategories)
      .catch(() => {});
  }, []);

  // Đồng bộ dropdown với URL
  useEffect(() => {
    setSelectedCatId(searchParams.get('categoryId') || '');
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
  };

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    setSelectedCatId(val);
    if (val) navigate(`/shop?categoryId=${val}`);
    else navigate('/shop');
  };

  // Xây dựng nav links động từ danh mục
  const dynamicNavLinks = NAV_KEYWORDS.map(item => {
    const catId = findCategoryId(categories, item.keys);
    return { label: item.label, catId };
  });

  const isActive = (path, catId) => {
    if (path === '/') return location.pathname === '/';
    if (path === '/blog') return location.pathname.startsWith('/blog');
    if (path === '/shop') {
      if (catId) return location.pathname === '/shop' && searchParams.get('categoryId') === String(catId);
      // "Cửa hàng" active khi ở /shop mà không có categoryId cụ thể
      return location.pathname === '/shop';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Promo Banner */}
      <div style={{
        background: 'linear-gradient(90deg,#1a2332 0%,#2d3748 50%,#1a2332 100%)',
        color: '#f6ad55', textAlign: 'center', padding: '9px 16px',
        fontSize: '13px', fontWeight: 500, letterSpacing: '0.3px'
      }}>
        🎁 Miễn phí vận chuyển toàn quốc cho đơn từ <strong>500.000đ</strong>
        &nbsp;·&nbsp; Bảo hành chính hãng &nbsp;·&nbsp; Đổi trả 30 ngày
      </div>

      {/* Main Header */}
      <header style={{
        background: '#111827', position: 'sticky', top: 0, zIndex: 200,
        boxShadow: '0 2px 16px rgba(0,0,0,.4)'
      }}>
        <div style={{
          maxWidth: '1380px', margin: '0 auto', padding: '0 28px',
          display: 'flex', alignItems: 'center', gap: '18px', height: '68px'
        }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <div style={{ width: '38px', height: '38px', background: '#f6ad55', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" stroke="#111827" strokeWidth="2" strokeLinejoin="round"/>
                <line x1="3" y1="6" x2="21" y2="6" stroke="#111827" strokeWidth="2"/>
                <path d="M16 10a4 4 0 0 1-8 0" stroke="#111827" strokeWidth="2"/>
              </svg>
            </div>
            <span style={{ fontSize: '19px', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>
              Truong<span style={{ color: '#f6ad55' }}>Mobile</span>
            </span>
          </Link>

          {/* Category dropdown — kết nối API thật */}
          <select
            value={selectedCatId}
            onChange={handleCategoryChange}
            style={{
              background: '#1e2d3d', color: '#cbd5e0', border: '1px solid #2d3748',
              borderRadius: '7px', padding: '8px 12px', fontSize: '13px',
              cursor: 'pointer', flexShrink: 0, outline: 'none', minWidth: '140px'
            }}
          >
            <option value="">Tất cả danh mục</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          {/* Search */}
          <form onSubmit={handleSearch} style={{
            flex: 1, display: 'flex', borderRadius: '8px', overflow: 'hidden',
            border: '2px solid #f6ad55', maxWidth: '680px'
          }}>
            <input
              type="text" placeholder="Tìm điện thoại, laptop, phụ kiện..."
              value={query} onChange={e => setQuery(e.target.value)}
              style={{ flex: 1, padding: '10px 16px', background: '#1e2d3d', color: '#fff', border: 'none', fontSize: '14px', outline: 'none' }}
            />
            <button type="submit" style={{
              background: '#f6ad55', padding: '0 22px', color: '#111827',
              fontWeight: 700, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '7px',
              whiteSpace: 'nowrap', border: 'none', cursor: 'pointer'
            }}>
              <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.099zm-5.242 1.656a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z"/>
              </svg>
              Tìm kiếm
            </button>
          </form>

          {/* Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0, marginLeft: 'auto' }}>
            {/* Account icon — nếu đã login thì hiện dropdown, chưa login thì link đến /login */}
            {customer ? (
              <div ref={accountRef} style={{ position: 'relative' }}>
                <button onClick={() => setAccountOpen(o => !o)} style={{
                  color: '#f6ad55', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: '3px', fontSize: '11px', padding: '6px 10px',
                  borderRadius: '7px', background: 'none', border: 'none', cursor: 'pointer'
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                  <span style={{ maxWidth: '60px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {customer.fullName.split(' ').pop()}
                  </span>
                </button>
                {accountOpen && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 6px)', right: 0,
                    background: '#1e2d3d', border: '1px solid #2d3748',
                    borderRadius: '10px', minWidth: '170px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.4)', zIndex: 999, overflow: 'hidden'
                  }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid #2d3748' }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>{customer.fullName}</div>
                      <div style={{ fontSize: '11px', color: '#718096', marginTop: '2px' }}>{customer.email}</div>
                    </div>
                    <Link to="/account" onClick={() => setAccountOpen(false)} style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '10px 16px', color: '#cbd5e0', fontSize: '13px',
                      textDecoration: 'none', transition: 'background .15s'
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = '#2d3748'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                      </svg>
                      Tài khoản của tôi
                    </Link>
                    <button onClick={handleLogout} style={{
                      display: 'flex', alignItems: 'center', gap: '8px', width: '100%',
                      padding: '10px 16px', color: '#fc8181', fontSize: '13px',
                      background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                      transition: 'background .15s'
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = '#2d3748'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                        <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                      </svg>
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" style={{
                color: '#a0aec0', display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: '3px', fontSize: '11px', padding: '6px 10px',
                borderRadius: '7px', transition: 'color .2s'
              }} className="nav-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                <span>Đăng nhập</span>
              </Link>
            )}

            <Link to="/cart" style={{
              color: '#a0aec0', display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: '3px', fontSize: '11px', padding: '6px 10px',
              borderRadius: '7px', position: 'relative', transition: 'color .2s'
            }} className="nav-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              {cartCount > 0 && (
                <div style={{
                  position: 'absolute', top: '2px', right: '4px',
                  background: '#e53e3e', color: '#fff', fontSize: '9px',
                  fontWeight: 800, width: '16px', height: '16px',
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>{cartCount > 99 ? '99+' : cartCount}</div>
              )}
              <span>Giỏ hàng</span>
            </Link>
          </div>
        </div>

        {/* Nav menu */}
        <div style={{ borderTop: '1px solid #1e2d3d' }}>
          <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '0 28px', display: 'flex', gap: '4px' }}>
            {/* Trang chủ */}
            <Link to="/" className="nav-link" style={{
              color: isActive('/', null) ? '#f6ad55' : '#a0aec0', fontSize: '13.5px',
              fontWeight: isActive('/', null) ? 700 : 500, padding: '9px 14px', display: 'block',
              borderBottom: isActive('/', null) ? '2px solid #f6ad55' : '2px solid transparent',
              transition: 'color .2s'
            }}>Trang chủ</Link>

            {/* Cửa hàng (tất cả) */}
            <Link to="/shop" className="nav-link" style={{
              color: isActive('/shop', null) && !searchParams.get('categoryId') ? '#f6ad55' : '#a0aec0',
              fontSize: '13.5px',
              fontWeight: isActive('/shop', null) && !searchParams.get('categoryId') ? 700 : 500,
              padding: '9px 14px', display: 'block',
              borderBottom: isActive('/shop', null) && !searchParams.get('categoryId') ? '2px solid #f6ad55' : '2px solid transparent',
              transition: 'color .2s'
            }}>Cửa hàng</Link>

            {/* Nav links động theo danh mục */}
            {dynamicNavLinks.map(item => {
              const active = item.catId && isActive('/shop', item.catId);
              const to = item.catId ? `/shop?categoryId=${item.catId}` : `/shop?q=${encodeURIComponent(item.label)}`;
              return (
                <Link key={item.label} to={to} className="nav-link" style={{
                  color: active ? '#f6ad55' : '#a0aec0', fontSize: '13.5px',
                  fontWeight: active ? 700 : 500, padding: '9px 14px', display: 'block',
                  borderBottom: active ? '2px solid #f6ad55' : '2px solid transparent',
                  transition: 'color .2s'
                }}>{item.label}</Link>
              );
            })}

            {/* Blog */}
            <Link to="/blog" className="nav-link" style={{
              color: isActive('/blog', null) ? '#f6ad55' : '#a0aec0', fontSize: '13.5px',
              fontWeight: isActive('/blog', null) ? 700 : 500, padding: '9px 14px', display: 'block',
              borderBottom: isActive('/blog', null) ? '2px solid #f6ad55' : '2px solid transparent',
              transition: 'color .2s'
            }}>Blog</Link>

            {/* Flash Sale */}
            <Link to="/flash-sale" style={{
              color: location.pathname === '/flash-sale' ? '#e53e3e' : '#e53e3e',
              fontSize: '13.5px', fontWeight: 700, padding: '9px 14px', display: 'block',
              borderBottom: location.pathname === '/flash-sale' ? '2px solid #e53e3e' : '2px solid transparent',
              opacity: location.pathname === '/flash-sale' ? 1 : 0.85
            }}>🔥 Flash Sale</Link>
          </div>
        </div>
      </header>
    </>
  );
}
