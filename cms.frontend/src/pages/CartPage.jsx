import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { imgUrl, formatPrice } from '../hooks/useApi';

const API = process.env.REACT_APP_API_BASE_URL || 'https://localhost:7094/api';

const STATUS_STEPS = ['Chờ xác nhận', 'Đang giao hàng', 'Đã hoàn thành'];
const STATUS_ICONS = ['🕐', '🚚', '✅'];

function OrderTracker() {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    setLoading(true); setError(''); setOrder(null);
    try {
      const res = await fetch(`${API}/orders/track/${orderId.trim()}`);
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Không tìm thấy đơn hàng.'); return; }
      setOrder(data);
    } catch {
      setError('Không kết nối được server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#fff', borderRadius: '14px', padding: '24px', boxShadow: '0 1px 8px rgba(0,0,0,.07)', marginTop: '24px' }}>
      <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#1a202c', marginBottom: '16px', marginTop: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '3px', height: '22px', background: '#f6ad55', borderRadius: '2px' }} />
        Theo dõi đơn hàng
      </h2>
      <form onSubmit={handleTrack} style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
        <input
          type="number" placeholder="Nhập mã đơn hàng (VD: 12)"
          value={orderId} onChange={e => setOrderId(e.target.value)}
          style={{ flex: 1, padding: '11px 14px', border: '1px solid #e2e8f0', borderRadius: '9px', fontSize: '14px', outline: 'none' }}
        />
        <button type="submit" disabled={loading} style={{
          padding: '11px 22px', background: '#111827', color: '#f6ad55',
          borderRadius: '9px', border: 'none', fontWeight: 700, fontSize: '14px', cursor: 'pointer', whiteSpace: 'nowrap'
        }}>{loading ? '...' : 'Tra cứu'}</button>
      </form>

      {error && (
        <div style={{ padding: '12px 16px', background: 'rgba(229,62,62,0.08)', border: '1px solid rgba(229,62,62,0.2)', borderRadius: '8px', color: '#e53e3e', fontSize: '13.5px' }}>{error}</div>
      )}

      {order && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <div style={{ fontSize: '13px', color: '#718096' }}>Mã đơn hàng <strong style={{ color: '#1a202c', fontSize: '16px' }}>#{order.id}</strong></div>
              <div style={{ fontSize: '12.5px', color: '#718096', marginTop: '3px' }}>
                Ngày đặt: {new Date(order.orderDate).toLocaleDateString('vi-VN', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' })}
              </div>
            </div>
            <div style={{ fontSize: '20px', fontWeight: 900, color: '#1a202c' }}>{formatPrice(order.totalAmount)}</div>
          </div>

          {/* Progress steps */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            {STATUS_STEPS.map((step, i) => {
              const done = order.status > i;
              const current = order.status === i;
              return (
                <div key={step} style={{ display: 'flex', alignItems: 'center', flex: i < STATUS_STEPS.length - 1 ? 1 : 0 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '50%', fontSize: '18px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: done ? '#38a169' : current ? '#f6ad55' : '#f0f2f5',
                      border: `2px solid ${done ? '#38a169' : current ? '#f6ad55' : '#e2e8f0'}`,
                      transition: 'all .3s'
                    }}>{STATUS_ICONS[i]}</div>
                    <span style={{ fontSize: '11px', color: done || current ? '#1a202c' : '#a0aec0', fontWeight: done || current ? 700 : 400, whiteSpace: 'nowrap', textAlign: 'center' }}>{step}</span>
                  </div>
                  {i < STATUS_STEPS.length - 1 && (
                    <div style={{ flex: 1, height: '2px', margin: '0 6px 20px', background: done ? '#38a169' : '#e2e8f0', transition: 'background .3s' }} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Items */}
          <div style={{ background: '#f7f9fc', borderRadius: '9px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {order.items && order.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13.5px' }}>
                <span style={{ color: '#4a5568' }}>{item.productName} × {item.quantity}</span>
                <span style={{ fontWeight: 700, color: '#1a202c' }}>{formatPrice(item.unitPrice * item.quantity)}</span>
              </div>
            ))}
          </div>

          {order.notes && (
            <div style={{ marginTop: '12px', padding: '10px 14px', background: '#f7f9fc', borderRadius: '7px', fontSize: '12.5px', color: '#718096', whiteSpace: 'pre-line' }}>
              {order.notes}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function CartPage() {
  const { items, removeItem, updateQty, total, count, clearCart } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <main style={{ background: '#f0f2f5', minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '60px 28px' }}>
          <div style={{ fontSize: '80px', marginBottom: '20px', lineHeight: 1 }}>🛒</div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#1a202c', marginBottom: '10px' }}>Giỏ hàng đang trống</div>
          <div style={{ fontSize: '14px', color: '#718096', marginBottom: '28px' }}>Hãy khám phá và thêm sản phẩm vào giỏ hàng!</div>
          <Link to="/shop" style={{
            display: 'inline-block', padding: '14px 32px',
            background: '#111827', color: '#f6ad55', borderRadius: '10px', fontWeight: 800, fontSize: '15px'
          }}>Tiếp tục mua sắm</Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ background: '#f0f2f5', minHeight: '70vh' }}>
      {/* Breadcrumb */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '11px 28px', display: 'flex', alignItems: 'center', gap: '7px', fontSize: '13px', color: '#718096' }}>
          <Link to="/" className="nav-link" style={{ color: '#718096' }}>Trang chủ</Link>
          <span>›</span>
          <span style={{ color: '#1a202c', fontWeight: 600 }}>Giỏ hàng ({count} sản phẩm)</span>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '28px', display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
        {/* Cart items */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#1a202c', margin: 0 }}>Giỏ hàng</h1>
            <button onClick={clearCart} style={{
              background: 'none', border: '1px solid #e2e8f0', borderRadius: '7px',
              color: '#e53e3e', fontSize: '13px', fontWeight: 600, padding: '7px 14px', cursor: 'pointer'
            }}>Xóa tất cả</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {items.map(item => {
              const src = imgUrl(item.imageUrl);
              const price = Number(item.price);
              return (
                <div key={item.id} style={{
                  background: '#fff', borderRadius: '12px', padding: '18px',
                  boxShadow: '0 1px 6px rgba(0,0,0,.06)',
                  display: 'flex', gap: '18px', alignItems: 'center'
                }}>
                  {/* Image */}
                  <div style={{ width: '90px', height: '90px', borderRadius: '9px', overflow: 'hidden', flexShrink: 0, background: '#f7f9fc' }}>
                    {src ? (
                      <img src={src} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5', color: '#a0aec0', fontSize: '24px' }}>📦</div>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '11px', color: '#f6ad55', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>{item.category}</div>
                    <Link to={`/product/${item.id}`} style={{ fontSize: '14.5px', fontWeight: 600, color: '#1a202c', display: 'block', marginBottom: '4px', textDecoration: 'none' }}>
                      {item.name}
                    </Link>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#1a202c' }}>{formatPrice(price)}</div>
                  </div>

                  {/* Quantity controls (#28) */}
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                    <button onClick={() => updateQty(item.id, item.quantity - 1)} style={{
                      width: '36px', height: '36px', background: '#f0f2f5', border: 'none',
                      fontSize: '18px', cursor: 'pointer', color: '#1a202c', fontWeight: 300
                    }}>−</button>
                    <span style={{ width: '44px', textAlign: 'center', fontSize: '15px', fontWeight: 700 }}>{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stockQuantity}
                      style={{
                        width: '36px', height: '36px', background: item.quantity >= item.stockQuantity ? '#e2e8f0' : '#f0f2f5',
                        border: 'none', fontSize: '18px', cursor: item.quantity >= item.stockQuantity ? 'not-allowed' : 'pointer',
                        color: item.quantity >= item.stockQuantity ? '#a0aec0' : '#1a202c', fontWeight: 300
                      }}>+</button>
                  </div>

                  {/* Subtotal */}
                  <div style={{ minWidth: '110px', textAlign: 'right' }}>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#1a202c' }}>{formatPrice(price * item.quantity)}</div>
                    {item.quantity > 1 && <div style={{ fontSize: '12px', color: '#a0aec0' }}>{formatPrice(price)} × {item.quantity}</div>}
                  </div>

                  {/* Remove */}
                  <button onClick={() => removeItem(item.id)} style={{
                    background: 'none', border: 'none', cursor: 'pointer', color: '#a0aec0',
                    padding: '6px', borderRadius: '6px', transition: 'color .2s'
                  }} title="Xóa">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>
                      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>

          <Link to="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', marginTop: '20px', color: '#718096', fontSize: '13.5px', fontWeight: 600 }} className="nav-link">
            ← Tiếp tục mua sắm
          </Link>

          <OrderTracker />
        </div>

        {/* Order summary */}
        <div style={{ width: '320px', flexShrink: 0, position: 'sticky', top: '88px' }}>
          <div style={{ background: '#fff', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 16px rgba(0,0,0,.08)' }}>
            <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#1a202c', marginBottom: '20px', marginTop: 0 }}>Tóm tắt đơn hàng</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
              {items.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', color: '#4a5568' }}>
                  <span style={{ flex: 1, marginRight: '8px', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.name} × {item.quantity}
                  </span>
                  <span style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px dashed #e2e8f0', paddingTop: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: '13.5px', color: '#718096' }}>Tạm tính ({count} sản phẩm)</span>
                <span style={{ fontSize: '20px', fontWeight: 900, color: '#1a202c' }}>{formatPrice(total)}</span>
              </div>
              <div style={{ fontSize: '12.5px', color: '#38a169', marginTop: '6px', fontWeight: 500 }}>+ Miễn phí vận chuyển đơn ≥ 500.000đ</div>
            </div>

            <button onClick={() => navigate('/checkout')} style={{
              width: '100%', padding: '15px', background: 'linear-gradient(135deg, #f6ad55, #ed8936)',
              color: '#111827', fontWeight: 800, fontSize: '16px', borderRadius: '10px',
              border: 'none', cursor: 'pointer', boxShadow: '0 4px 16px rgba(246,173,85,0.35)'
            }}>
              Tiến hành đặt hàng →
            </button>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '16px' }}>
              {['VISA', 'MOMO', 'COD'].map(p => (
                <div key={p} style={{ padding: '4px 10px', background: '#f0f2f5', borderRadius: '5px', fontSize: '11px', fontWeight: 700, color: '#718096' }}>{p}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
