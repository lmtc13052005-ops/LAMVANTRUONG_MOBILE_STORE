import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const API = process.env.REACT_APP_API_BASE_URL || process.env.REACT_APP_API_URL || 'https://localhost:7094/api';
const IMG = process.env.REACT_APP_IMAGE_BASE_URL || 'https://localhost:7094';

const STATUS_COLOR = { 0: '#f6ad55', 1: '#63b3ed', 2: '#68d391', 3: '#fc8181' };
const STATUS_BG    = { 0: '#2d2010', 1: '#0d1f2d', 2: '#0d2018', 3: '#2d1010' };

function fmt(n) {
  return Number(n).toLocaleString('vi-VN') + 'đ';
}

function fmtDate(d) {
  return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// ──── SIDEBAR ─────────────────────────────────────────────────────────────────
function Sidebar({ customer, active, onSelect }) {
  const initial = (customer?.fullName || 'K').charAt(0).toUpperCase();

  const navItems = [
    { id: 'profile',  icon: <UserIcon />,    label: 'Hồ Sơ' },
    { id: 'address',  icon: <MapPinIcon />,  label: 'Địa Chỉ' },
    { id: 'password', icon: <LockIcon />,    label: 'Đổi Mật Khẩu' },
  ];

  return (
    <aside style={{ width: '220px', flexShrink: 0 }}>
      {/* Avatar + name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 0 20px', borderBottom: '1px solid #1e2d3d', marginBottom: '16px' }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '50%',
          background: '#f6ad55', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '20px', fontWeight: 800, color: '#111827', flexShrink: 0
        }}>{initial}</div>
        <div>
          <div style={{ fontWeight: 700, color: '#fff', fontSize: '14px', lineHeight: 1.3 }}>{customer?.fullName}</div>
          <button style={{ background: 'none', border: 'none', color: '#718096', fontSize: '12px', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px' }}
            onClick={() => onSelect('profile')}>
            <EditIcon /> Sửa Hồ Sơ
          </button>
        </div>
      </div>

      {/* Tài khoản của tôi group */}
      <div style={{ marginBottom: '4px', fontSize: '12px', fontWeight: 700, color: '#a0aec0', textTransform: 'uppercase', letterSpacing: '0.5px', padding: '0 8px 8px' }}>
        Tài Khoản Của Tôi
      </div>
      {navItems.map(item => (
        <button key={item.id} onClick={() => onSelect(item.id)} style={{
          display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
          padding: '10px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer',
          background: active === item.id ? '#1e2d3d' : 'none',
          color: active === item.id ? '#f6ad55' : '#a0aec0',
          fontSize: '14px', fontWeight: active === item.id ? 600 : 400,
          transition: 'all .15s', textAlign: 'left', marginBottom: '2px'
        }}
          onMouseEnter={e => { if (active !== item.id) e.currentTarget.style.background = '#1a2332'; }}
          onMouseLeave={e => { if (active !== item.id) e.currentTarget.style.background = 'none'; }}
        >
          <span style={{ color: active === item.id ? '#f6ad55' : '#4a5568' }}>{item.icon}</span>
          {item.label}
        </button>
      ))}

      <div style={{ height: '1px', background: '#1e2d3d', margin: '12px 0' }} />

      {/* Đơn Mua */}
      <button onClick={() => onSelect('orders')} style={{
        display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
        padding: '10px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer',
        background: active === 'orders' ? '#1e2d3d' : 'none',
        color: active === 'orders' ? '#f6ad55' : '#a0aec0',
        fontSize: '14px', fontWeight: active === 'orders' ? 600 : 400,
        transition: 'all .15s', textAlign: 'left'
      }}
        onMouseEnter={e => { if (active !== 'orders') e.currentTarget.style.background = '#1a2332'; }}
        onMouseLeave={e => { if (active !== 'orders') e.currentTarget.style.background = 'none'; }}
      >
        <span style={{ color: active === 'orders' ? '#f6ad55' : '#4a5568' }}><ShoppingBagIcon /></span>
        Đơn Mua
      </button>
    </aside>
  );
}

// ──── TAB: HỒ SƠ ──────────────────────────────────────────────────────────────
function ProfileTab({ customer }) {
  const [form, setForm]     = useState({ fullName: '', phone: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [msg, setMsg]         = useState(null);

  useEffect(() => {
    if (!customer) return;
    fetch(`${API}/customers/${customer.customerId}/profile`)
      .then(r => r.json())
      .then(d => {
        setForm({ fullName: d.fullName || '', phone: d.phone || '' });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [customer]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const r = await fetch(`${API}/customers/${customer.customerId}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: form.fullName, phone: form.phone, address: null })
      });
      const d = await r.json();
      if (r.ok) {
        setMsg({ type: 'ok', text: d.message });
        // Cập nhật localStorage để Header đồng bộ
        const stored = JSON.parse(localStorage.getItem('customer') || '{}');
        localStorage.setItem('customer', JSON.stringify({ ...stored, fullName: d.fullName, phone: d.phone }));
        window.dispatchEvent(new Event('customerChanged'));
      } else {
        setMsg({ type: 'err', text: d.message });
      }
    } catch {
      setMsg({ type: 'err', text: 'Không thể kết nối máy chủ.' });
    }
    setSaving(false);
  };

  if (loading) return <div style={{ color: '#718096', padding: '40px 0' }}>Đang tải...</div>;

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', margin: 0 }}>Hồ Sơ Của Tôi</h2>
        <p style={{ color: '#718096', fontSize: '13px', marginTop: '4px' }}>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
      </div>

      {msg && (
        <div style={{
          padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px',
          background: msg.type === 'ok' ? '#0d2018' : '#2d1010',
          color: msg.type === 'ok' ? '#68d391' : '#fc8181',
          border: `1px solid ${msg.type === 'ok' ? '#276749' : '#742a2a'}`
        }}>{msg.text}</div>
      )}

      <form onSubmit={handleSave} style={{ maxWidth: '500px' }}>
        <Field label="Tên đăng nhập">
          <span style={{ color: '#a0aec0', fontSize: '14px' }}>{customer?.email?.split('@')[0]}</span>
        </Field>

        <Field label="Họ và Tên">
          <input
            value={form.fullName}
            onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
            style={inputStyle}
            placeholder="Nhập họ và tên"
          />
        </Field>

        <Field label="Email">
          <span style={{ color: '#a0aec0', fontSize: '14px' }}>
            {maskEmail(customer?.email)}
          </span>
        </Field>

        <Field label="Số điện thoại">
          <input
            value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            style={inputStyle}
            placeholder="Nhập số điện thoại"
          />
        </Field>

        <div style={{ marginTop: '28px' }}>
          <button type="submit" disabled={saving} style={{
            background: saving ? '#4a5568' : '#f6ad55', color: '#111827',
            fontWeight: 700, fontSize: '14px', padding: '10px 32px',
            borderRadius: '8px', border: 'none', cursor: saving ? 'not-allowed' : 'pointer'
          }}>
            {saving ? 'Đang lưu...' : 'Lưu'}
          </button>
        </div>
      </form>
    </div>
  );
}

// ──── TAB: ĐỊA CHỈ ────────────────────────────────────────────────────────────
function AddressTab({ customer }) {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [msg, setMsg]         = useState(null);

  useEffect(() => {
    if (!customer) return;
    fetch(`${API}/customers/${customer.customerId}/profile`)
      .then(r => r.json())
      .then(d => { setAddress(d.address || ''); setLoading(false); })
      .catch(() => setLoading(false));
  }, [customer]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setMsg(null);
    try {
      const r = await fetch(`${API}/customers/${customer.customerId}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: customer.fullName, phone: customer.phone, address })
      });
      const d = await r.json();
      setMsg({ type: r.ok ? 'ok' : 'err', text: d.message });
    } catch {
      setMsg({ type: 'err', text: 'Không thể kết nối máy chủ.' });
    }
    setSaving(false);
  };

  if (loading) return <div style={{ color: '#718096', padding: '40px 0' }}>Đang tải...</div>;

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', margin: 0 }}>Địa Chỉ Của Tôi</h2>
        <p style={{ color: '#718096', fontSize: '13px', marginTop: '4px' }}>Địa chỉ giao hàng mặc định</p>
      </div>

      {msg && (
        <div style={{
          padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px',
          background: msg.type === 'ok' ? '#0d2018' : '#2d1010',
          color: msg.type === 'ok' ? '#68d391' : '#fc8181',
          border: `1px solid ${msg.type === 'ok' ? '#276749' : '#742a2a'}`
        }}>{msg.text}</div>
      )}

      <form onSubmit={handleSave} style={{ maxWidth: '500px' }}>
        <Field label="Địa chỉ giao hàng">
          <textarea
            value={address}
            onChange={e => setAddress(e.target.value)}
            rows={3}
            placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
            style={{ ...inputStyle, resize: 'vertical', height: 'auto', paddingTop: '10px' }}
          />
        </Field>

        <div style={{ marginTop: '20px' }}>
          <button type="submit" disabled={saving} style={{
            background: saving ? '#4a5568' : '#f6ad55', color: '#111827',
            fontWeight: 700, fontSize: '14px', padding: '10px 32px',
            borderRadius: '8px', border: 'none', cursor: saving ? 'not-allowed' : 'pointer'
          }}>
            {saving ? 'Đang lưu...' : 'Lưu'}
          </button>
        </div>
      </form>
    </div>
  );
}

// ──── TAB: ĐỔI MẬT KHẨU ──────────────────────────────────────────────────────
function PasswordTab({ customer }) {
  const [form, setForm]   = useState({ old: '', newPw: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg]       = useState(null);

  const handleSave = async (e) => {
    e.preventDefault();
    setMsg(null);
    if (form.newPw !== form.confirm)
      return setMsg({ type: 'err', text: 'Mật khẩu mới và xác nhận không khớp.' });
    setSaving(true);
    try {
      const r = await fetch(`${API}/customers/${customer.customerId}/change-password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword: form.old, newPassword: form.newPw })
      });
      const d = await r.json();
      if (r.ok) {
        setMsg({ type: 'ok', text: d.message });
        setForm({ old: '', newPw: '', confirm: '' });
      } else {
        setMsg({ type: 'err', text: d.message });
      }
    } catch {
      setMsg({ type: 'err', text: 'Không thể kết nối máy chủ.' });
    }
    setSaving(false);
  };

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', margin: 0 }}>Đổi Mật Khẩu</h2>
        <p style={{ color: '#718096', fontSize: '13px', marginTop: '4px' }}>Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu</p>
      </div>

      {msg && (
        <div style={{
          padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px',
          background: msg.type === 'ok' ? '#0d2018' : '#2d1010',
          color: msg.type === 'ok' ? '#68d391' : '#fc8181',
          border: `1px solid ${msg.type === 'ok' ? '#276749' : '#742a2a'}`
        }}>{msg.text}</div>
      )}

      <form onSubmit={handleSave} style={{ maxWidth: '400px' }}>
        <Field label="Mật khẩu hiện tại">
          <input type="password" value={form.old} onChange={e => setForm(f => ({ ...f, old: e.target.value }))}
            style={inputStyle} placeholder="Nhập mật khẩu hiện tại" required />
        </Field>
        <Field label="Mật khẩu mới">
          <input type="password" value={form.newPw} onChange={e => setForm(f => ({ ...f, newPw: e.target.value }))}
            style={inputStyle} placeholder="Ít nhất 6 ký tự" required />
        </Field>
        <Field label="Xác nhận mật khẩu mới">
          <input type="password" value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
            style={inputStyle} placeholder="Nhập lại mật khẩu mới" required />
        </Field>
        <div style={{ marginTop: '28px' }}>
          <button type="submit" disabled={saving} style={{
            background: saving ? '#4a5568' : '#f6ad55', color: '#111827',
            fontWeight: 700, fontSize: '14px', padding: '10px 32px',
            borderRadius: '8px', border: 'none', cursor: saving ? 'not-allowed' : 'pointer'
          }}>
            {saving ? 'Đang xử lý...' : 'Xác Nhận'}
          </button>
        </div>
      </form>
    </div>
  );
}

// ──── TAB: ĐƠN MUA ────────────────────────────────────────────────────────────
function OrdersTab({ customer }) {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('all');

  useEffect(() => {
    if (!customer) return;
    fetch(`${API}/customers/${customer.customerId}/orders`)
      .then(r => r.json())
      .then(d => { setOrders(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [customer]);

  const TABS = [
    { id: 'all', label: 'Tất Cả' },
    { id: '0',   label: 'Chờ Xác Nhận' },
    { id: '1',   label: 'Đang Giao' },
    { id: '2',   label: 'Hoàn Thành' },
    { id: '3',   label: 'Đã Hủy' },
  ];

  const filtered = filter === 'all' ? orders : orders.filter(o => String(o.status) === filter);

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', margin: 0 }}>Đơn Mua</h2>
      </div>

      {/* Status filter tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', borderBottom: '1px solid #1e2d3d', paddingBottom: '0' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setFilter(t.id)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '8px 14px', fontSize: '13px',
            color: filter === t.id ? '#f6ad55' : '#718096',
            fontWeight: filter === t.id ? 700 : 400,
            borderBottom: filter === t.id ? '2px solid #f6ad55' : '2px solid transparent',
            transition: 'all .15s', marginBottom: '-1px'
          }}>{t.label}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ color: '#718096', padding: '40px 0', textAlign: 'center' }}>Đang tải đơn hàng...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#4a5568' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>📦</div>
          <div style={{ fontSize: '14px' }}>Chưa có đơn hàng nào</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map(order => (
            <div key={order.id} style={{
              background: '#0d1117', border: '1px solid #1e2d3d',
              borderRadius: '10px', overflow: 'hidden'
            }}>
              {/* Order header */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 16px', borderBottom: '1px solid #1e2d3d',
                background: '#111827'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '13px', color: '#a0aec0' }}>Mã đơn #{order.id}</span>
                  <span style={{ fontSize: '12px', color: '#4a5568' }}>· {fmtDate(order.orderDate)}</span>
                </div>
                <span style={{
                  fontSize: '12px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px',
                  color: STATUS_COLOR[order.status] || '#a0aec0',
                  background: STATUS_BG[order.status] || '#1a2332'
                }}>{order.statusLabel}</span>
              </div>

              {/* Items */}
              <div style={{ padding: '12px 16px' }}>
                {(order.items || []).map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    paddingBottom: i < order.items.length - 1 ? '10px' : 0,
                    marginBottom: i < order.items.length - 1 ? '10px' : 0,
                    borderBottom: i < order.items.length - 1 ? '1px solid #1a2332' : 'none'
                  }}>
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl.startsWith('http') ? item.imageUrl : `${IMG}${item.imageUrl}`}
                        alt={item.productName}
                        style={{ width: '52px', height: '52px', objectFit: 'contain', borderRadius: '6px', background: '#1e2d3d', flexShrink: 0 }}
                      />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', color: '#e2e8f0', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.productName}
                      </div>
                      <div style={{ fontSize: '12px', color: '#718096', marginTop: '2px' }}>x{item.quantity}</div>
                    </div>
                    <div style={{ fontSize: '13px', color: '#f6ad55', fontWeight: 700, flexShrink: 0 }}>
                      {fmt(item.unitPrice * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div style={{
                display: 'flex', justifyContent: 'flex-end', alignItems: 'center',
                padding: '10px 16px', borderTop: '1px solid #1e2d3d', background: '#111827', gap: '8px'
              }}>
                <span style={{ fontSize: '13px', color: '#718096' }}>Thành tiền:</span>
                <span style={{ fontSize: '16px', fontWeight: 800, color: '#f6ad55' }}>{fmt(order.totalAmount)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ──── HELPERS ─────────────────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '16px' }}>
      <label style={{ width: '140px', flexShrink: 0, color: '#718096', fontSize: '14px', paddingTop: '10px', textAlign: 'right' }}>
        {label}
      </label>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}

function maskEmail(email) {
  if (!email) return '';
  const [user, domain] = email.split('@');
  if (!user || !domain) return email;
  const visible = user.slice(0, 2);
  return `${visible}${'*'.repeat(Math.max(user.length - 2, 3))}@${domain}`;
}

const inputStyle = {
  width: '100%', padding: '9px 12px', background: '#1e2d3d', color: '#e2e8f0',
  border: '1px solid #2d3748', borderRadius: '7px', fontSize: '14px', outline: 'none',
  boxSizing: 'border-box'
};

function UserIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
}
function MapPinIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
}
function LockIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
}
function ShoppingBagIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>;
}
function EditIcon() {
  return <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
}

// ──── PAGE ROOT ────────────────────────────────────────────────────────────────
export default function AccountPage() {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(() => {
    try { return JSON.parse(localStorage.getItem('customer') || 'null'); } catch { return null; }
  });
  const [active, setActive] = useState('profile');

  useEffect(() => {
    const sync = () => {
      try { setCustomer(JSON.parse(localStorage.getItem('customer') || 'null')); } catch { setCustomer(null); }
    };
    window.addEventListener('customerChanged', sync);
    return () => window.removeEventListener('customerChanged', sync);
  }, []);

  // Redirect nếu chưa đăng nhập
  useEffect(() => {
    if (customer === null) navigate('/login');
  }, [customer, navigate]);

  if (!customer) return null;

  const renderContent = () => {
    if (active === 'profile')  return <ProfileTab  customer={customer} />;
    if (active === 'address')  return <AddressTab  customer={customer} />;
    if (active === 'password') return <PasswordTab customer={customer} />;
    if (active === 'orders')   return <OrdersTab   customer={customer} />;
    return null;
  };

  return (
    <div style={{ background: '#0d1117', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 28px', display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
        <Sidebar customer={customer} active={active} onSelect={setActive} />
        <main style={{
          flex: 1, background: '#111827', borderRadius: '12px',
          padding: '32px', border: '1px solid #1e2d3d', minHeight: '400px'
        }}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
