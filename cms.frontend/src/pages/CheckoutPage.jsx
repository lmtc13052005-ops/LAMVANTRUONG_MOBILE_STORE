import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { imgUrl, formatPrice } from '../hooks/useApi';

const API = process.env.REACT_APP_API_BASE_URL || 'https://localhost:7094/api';

// Validate phone VN — chấp nhận: 0xxxxxxxxx, +84xxxxxxxxx (9-10 chữ số sau đầu số)
const isValidPhone = p => /^(0[0-9]{9}|\+84[0-9]{9})$/.test(p.trim().replace(/\s/g, ''));

export default function CheckoutPage() {
  const { items, total, count, clearCart } = useCart();
  const navigate = useNavigate();
  const customer = (() => { try { return JSON.parse(localStorage.getItem('customer') || 'null'); } catch { return null; } })();

  const [form, setForm] = useState({
    fullName: customer?.fullName || '',
    phone: customer?.phone || '',
    address: '',
    notes: '',
    paymentMethod: 'cod',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null); // { orderId, total }

  // Redirect nếu chưa đăng nhập hoặc giỏ trống
  if (!customer) {
    return (
      <main style={{ background: '#f0f2f5', minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '60px 28px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔒</div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#1a202c', marginBottom: '10px' }}>Vui lòng đăng nhập để đặt hàng</div>
          <Link to="/login" style={{ display: 'inline-block', padding: '13px 28px', background: '#111827', color: '#f6ad55', borderRadius: '9px', fontWeight: 700, fontSize: '14px' }}>
            Đăng nhập →
          </Link>
        </div>
      </main>
    );
  }

  if (items.length === 0 && !success) {
    return (
      <main style={{ background: '#f0f2f5', minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '60px 28px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🛒</div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#1a202c', marginBottom: '12px' }}>Giỏ hàng trống</div>
          <Link to="/shop" style={{ display: 'inline-block', padding: '13px 28px', background: '#111827', color: '#f6ad55', borderRadius: '9px', fontWeight: 700 }}>
            Mua sắm ngay
          </Link>
        </div>
      </main>
    );
  }

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Vui lòng nhập họ tên.';
    if (!form.phone.trim()) e.phone = 'Vui lòng nhập số điện thoại.';
    else if (!isValidPhone(form.phone)) e.phone = 'Số điện thoại không hợp lệ. Định dạng: 0901234567 hoặc +84901234567';
    if (!form.address.trim()) e.address = 'Vui lòng nhập địa chỉ giao hàng.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const body = {
        customerId: customer.customerId,
        customerEmail: customer.email,
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        notes: form.notes.trim(),
        items: items.map(i => ({ productId: i.id, quantity: i.quantity }))
      };
      const res = await fetch(`${API}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors({ submit: data.message || 'Đặt hàng thất bại.' });
        return;
      }
      clearCart();
      setSuccess({ orderId: data.orderId, total: data.total });
    } catch {
      setErrors({ submit: 'Không kết nối được server. Vui lòng thử lại.' });
    } finally {
      setLoading(false);
    }
  };

  // Màn hình thành công
  if (success) {
    return (
      <main style={{ background: '#f0f2f5', minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '60px 28px', maxWidth: '480px' }}>
          <div style={{ width: '80px', height: '80px', background: '#38a169', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '36px' }}>✓</div>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#1a202c', marginBottom: '10px' }}>Đặt hàng thành công!</div>
          <div style={{ fontSize: '15px', color: '#718096', marginBottom: '6px' }}>Mã đơn hàng: <strong style={{ color: '#f6ad55' }}>#{success.orderId}</strong></div>
          <div style={{ fontSize: '15px', color: '#718096', marginBottom: '8px' }}>Tổng tiền: <strong style={{ color: '#1a202c', fontSize: '18px' }}>{formatPrice(success.total)}</strong></div>
          <div style={{ fontSize: '13.5px', color: '#718096', marginBottom: '32px', padding: '14px 18px', background: '#fff', borderRadius: '9px', border: '1px solid #e2e8f0' }}>
            Xác nhận đơn hàng đã được gửi đến email của bạn. Chúng tôi sẽ liên hệ trong thời gian sớm nhất!
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link to="/" style={{ padding: '12px 24px', background: '#f0f2f5', color: '#4a5568', borderRadius: '9px', fontWeight: 700, fontSize: '14px' }}>Về trang chủ</Link>
            <Link to="/shop" style={{ padding: '12px 24px', background: '#111827', color: '#f6ad55', borderRadius: '9px', fontWeight: 700, fontSize: '14px' }}>Tiếp tục mua sắm</Link>
          </div>
        </div>
      </main>
    );
  }

  const Field = ({ name, label, placeholder, required, type = 'text', as }) => (
    <div>
      <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>
        {label} {required && <span style={{ color: '#e53e3e' }}>*</span>}
      </label>
      {as === 'textarea' ? (
        <textarea
          value={form[name]} onChange={e => { setForm(f => ({ ...f, [name]: e.target.value })); setErrors(er => ({ ...er, [name]: '' })); }}
          placeholder={placeholder} rows={3}
          style={{ width: '100%', padding: '11px 14px', border: `1px solid ${errors[name] ? '#e53e3e' : '#e2e8f0'}`, borderRadius: '9px', fontSize: '14px', outline: 'none', resize: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
        />
      ) : (
        <input
          type={type} value={form[name]}
          onChange={e => { setForm(f => ({ ...f, [name]: e.target.value })); setErrors(er => ({ ...er, [name]: '' })); }}
          placeholder={placeholder}
          style={{ width: '100%', padding: '11px 14px', border: `1px solid ${errors[name] ? '#e53e3e' : '#e2e8f0'}`, borderRadius: '9px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
        />
      )}
      {errors[name] && <div style={{ fontSize: '12px', color: '#e53e3e', marginTop: '5px' }}>{errors[name]}</div>}
    </div>
  );

  return (
    <main style={{ background: '#f0f2f5', minHeight: '70vh' }}>
      {/* Breadcrumb */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '11px 28px', display: 'flex', alignItems: 'center', gap: '7px', fontSize: '13px', color: '#718096' }}>
          <Link to="/" className="nav-link" style={{ color: '#718096' }}>Trang chủ</Link>
          <span>›</span>
          <Link to="/cart" className="nav-link" style={{ color: '#718096' }}>Giỏ hàng</Link>
          <span>›</span>
          <span style={{ color: '#1a202c', fontWeight: 600 }}>Thanh toán</span>
        </div>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '28px', display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
        {/* Form */}
        <form onSubmit={handleSubmit} style={{ flex: 1 }}>
          <div style={{ background: '#fff', borderRadius: '14px', padding: '28px', boxShadow: '0 1px 8px rgba(0,0,0,.07)', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#1a202c', marginBottom: '20px', marginTop: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '3px', height: '22px', background: '#f6ad55', borderRadius: '2px' }} />
              Thông tin giao hàng
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Field name="fullName" label="Họ và tên" placeholder="Nguyễn Văn A" required />
              <Field name="phone" label="Số điện thoại" placeholder="0901 234 567" required type="tel" />
              <Field name="address" label="Địa chỉ giao hàng" placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố" required />
              <div style={{ fontSize: '12px', color: '#f6ad55', background: 'rgba(246,173,85,0.08)', border: '1px solid rgba(246,173,85,0.2)', borderRadius: '7px', padding: '8px 12px', marginTop: '-8px' }}>
                💡 Vui lòng nhập địa chỉ theo đơn vị hành chính <strong>trước sáp nhập</strong> (ví dụ: 123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh).
              </div>
              <Field name="notes" label="Ghi chú đơn hàng" placeholder="Ghi chú cho người giao hàng (không bắt buộc)" as="textarea" />
            </div>
          </div>

          {/* Phương thức thanh toán */}
          <div style={{ background: '#fff', borderRadius: '14px', padding: '28px', boxShadow: '0 1px 8px rgba(0,0,0,.07)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#1a202c', marginBottom: '18px', marginTop: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '3px', height: '22px', background: '#f6ad55', borderRadius: '2px' }} />
              Phương thức thanh toán
            </h2>
            {[
              { value: 'cod', label: 'Thanh toán khi nhận hàng (COD)', icon: '💵' },
              { value: 'bank', label: 'Chuyển khoản ngân hàng', icon: '🏦' },
            ].map(opt => (
              <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px', borderRadius: '10px', border: `2px solid ${form.paymentMethod === opt.value ? '#f6ad55' : '#e2e8f0'}`, background: form.paymentMethod === opt.value ? 'rgba(246,173,85,0.06)' : '#fff', marginBottom: '10px', cursor: 'pointer', transition: 'all .2s' }}>
                <input type="radio" value={opt.value} checked={form.paymentMethod === opt.value} onChange={e => setForm(f => ({ ...f, paymentMethod: e.target.value }))} style={{ accentColor: '#f6ad55', width: '18px', height: '18px' }} />
                <span style={{ fontSize: '16px' }}>{opt.icon}</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#1a202c' }}>{opt.label}</span>
              </label>
            ))}

            {errors.submit && (
              <div style={{ padding: '12px 16px', background: 'rgba(229,62,62,0.08)', border: '1px solid rgba(229,62,62,0.3)', borderRadius: '8px', color: '#e53e3e', fontSize: '13.5px', marginBottom: '16px' }}>
                {errors.submit}
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '16px', background: loading ? '#a0aec0' : 'linear-gradient(135deg, #f6ad55, #ed8936)',
              color: '#111827', fontWeight: 800, fontSize: '16px', borderRadius: '10px',
              border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 16px rgba(246,173,85,0.4)', letterSpacing: '0.3px'
            }}>
              {loading ? 'Đang xử lý...' : `ĐẶT HÀNG — ${formatPrice(total)}`}
            </button>
          </div>
        </form>

        {/* Order summary */}
        <div style={{ width: '300px', flexShrink: 0, position: 'sticky', top: '88px' }}>
          <div style={{ background: '#fff', borderRadius: '14px', padding: '22px', boxShadow: '0 1px 8px rgba(0,0,0,.07)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1a202c', marginBottom: '16px', marginTop: 0 }}>
              Đơn hàng ({count} sản phẩm)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px', maxHeight: '300px', overflowY: 'auto' }}>
              {items.map(item => {
                const src = imgUrl(item.imageUrl);
                return (
                  <div key={item.id} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: '7px', overflow: 'hidden', flexShrink: 0, background: '#f0f2f5' }}>
                      {src ? <img src={src} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>📦</div>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#1a202c', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.name}</div>
                      <div style={{ fontSize: '12px', color: '#718096' }}>× {item.quantity}</div>
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#1a202c', whiteSpace: 'nowrap' }}>{formatPrice(item.price * item.quantity)}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#718096', marginBottom: '6px' }}>
                <span>Tạm tính</span><span>{formatPrice(total)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#38a169', marginBottom: '12px' }}>
                <span>Vận chuyển</span><span>Miễn phí</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#1a202c' }}>Tổng cộng</span>
                <span style={{ fontSize: '22px', fontWeight: 900, color: '#1a202c' }}>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
