import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API = process.env.REACT_APP_API_BASE_URL || process.env.REACT_APP_API_URL || 'https://localhost:7094/api';

const inputStyle = {
  width: '100%', padding: '13px 16px', fontSize: '14px',
  background: '#0f1923', border: '1px solid rgba(246,173,85,0.2)',
  borderRadius: '10px', color: '#e2e8f0', outline: 'none',
  fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color .2s, box-shadow .2s'
};

function focusStyle(active) {
  return {
    borderColor: active ? '#f6ad55' : 'rgba(246,173,85,0.2)',
    boxShadow: active ? '0 0 0 3px rgba(246,173,85,0.12)' : 'none'
  };
}

function PasswordStrength({ password }) {
  if (!password) return null;
  const score = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;
  const labels = ['', 'Yếu', 'Trung bình', 'Mạnh', 'Rất mạnh'];
  const colors = ['', '#e53e3e', '#ed8936', '#38a169', '#2b6cb0'];
  return (
    <div style={{ marginTop: '8px' }}>
      <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{
            flex: 1, height: '4px', borderRadius: '2px',
            background: i <= score ? colors[score] : 'rgba(255,255,255,0.08)',
            transition: 'background .3s'
          }} />
        ))}
      </div>
      <span style={{ fontSize: '11.5px', color: colors[score] || '#718096' }}>{labels[score]}</span>
    </div>
  );
}

const cardStyle = {
  background: 'linear-gradient(145deg, #1a2332, #111827)',
  borderRadius: '20px', padding: '40px', width: '100%', maxWidth: '460px',
  boxShadow: '0 0 0 1px rgba(246,173,85,0.25), 4px 4px 0 rgba(246,173,85,0.12), 0 24px 60px rgba(0,0,0,0.6)',
};

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [focused, setFocused] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = e => { setForm(f => ({ ...f, [e.target.name]: e.target.value })); setError(''); };

  const handleRegister = async e => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Mật khẩu xác nhận không khớp.'); return; }
    if (form.password.length < 6) { setError('Mật khẩu phải có ít nhất 6 ký tự.'); return; }
    if (!agreed) { setError('Vui lòng đồng ý với Điều khoản dịch vụ.'); return; }

    setLoading(true);
    try {
      const res = await fetch(`${API}/customers/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          password: form.password,
        })
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Đăng ký thất bại.'); return; }
      setSuccess('Đăng ký thành công! Đang chuyển về trang đăng nhập...');
      setTimeout(() => navigate('/login'), 2000);
    } catch {
      setError('Không kết nối được server. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const EyeBtn = ({ show, toggle }) => (
    <button type="button" onClick={toggle} style={{
      position: 'absolute', right: '13px', top: '50%', transform: 'translateY(-50%)',
      background: 'none', border: 'none', cursor: 'pointer', color: '#718096', padding: '4px'
    }}>
      {show ? (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
          <line x1="1" y1="1" x2="23" y2="23"/>
        </svg>
      ) : (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      )}
    </button>
  );

  return (
    <main style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a0f18 0%, #111827 40%, #1a2332 70%, #0d1520 100%)',
      padding: '40px 20px'
    }}>
      <div style={cardStyle}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <Link to="/" style={{ fontSize: '22px', fontWeight: 900, color: '#f6ad55', textDecoration: 'none', display: 'block', marginBottom: '6px' }}>
            TruongMobile
          </Link>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', margin: 0 }}>Tạo tài khoản mới</h1>
          <p style={{ fontSize: '13px', color: '#718096', marginTop: '6px' }}>Miễn phí, đăng ký ngay hôm nay!</p>
        </div>

        {/* Alerts */}
        {error && (
          <div style={{ padding: '11px 14px', background: 'rgba(229,62,62,0.12)', border: '1px solid rgba(229,62,62,0.3)', borderRadius: '9px', color: '#fc8181', fontSize: '13px', marginBottom: '16px' }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ padding: '11px 14px', background: 'rgba(56,161,105,0.12)', border: '1px solid rgba(56,161,105,0.3)', borderRadius: '9px', color: '#68d391', fontSize: '13px', marginBottom: '16px' }}>
            ✓ {success}
          </div>
        )}

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#a0aec0', display: 'block', marginBottom: '7px' }}>Họ và tên <span style={{ color: '#f6ad55' }}>*</span></label>
            <input name="fullName" placeholder="Nguyễn Văn A" value={form.fullName} onChange={handleChange} required
              onFocus={() => setFocused('fullName')} onBlur={() => setFocused('')}
              style={{ ...inputStyle, ...focusStyle(focused === 'fullName') }} />
          </div>

          <div>
            <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#a0aec0', display: 'block', marginBottom: '7px' }}>Email <span style={{ color: '#f6ad55' }}>*</span></label>
            <input name="email" type="email" placeholder="example@gmail.com" value={form.email} onChange={handleChange} required
              onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
              style={{ ...inputStyle, ...focusStyle(focused === 'email') }} />
          </div>

          <div>
            <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#a0aec0', display: 'block', marginBottom: '7px' }}>Số điện thoại</label>
            <input name="phone" type="tel" placeholder="0901 234 567" value={form.phone} onChange={handleChange}
              onFocus={() => setFocused('phone')} onBlur={() => setFocused('')}
              style={{ ...inputStyle, ...focusStyle(focused === 'phone') }} />
          </div>

          <div>
            <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#a0aec0', display: 'block', marginBottom: '7px' }}>Mật khẩu <span style={{ color: '#f6ad55' }}>*</span></label>
            <div style={{ position: 'relative' }}>
              <input name="password" type={showPw ? 'text' : 'password'} placeholder="Tối thiểu 6 ký tự"
                value={form.password} onChange={handleChange} required
                onFocus={() => setFocused('password')} onBlur={() => setFocused('')}
                style={{ ...inputStyle, paddingRight: '44px', ...focusStyle(focused === 'password') }} />
              <EyeBtn show={showPw} toggle={() => setShowPw(s => !s)} />
            </div>
            <PasswordStrength password={form.password} />
          </div>

          <div>
            <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#a0aec0', display: 'block', marginBottom: '7px' }}>Xác nhận mật khẩu <span style={{ color: '#f6ad55' }}>*</span></label>
            <div style={{ position: 'relative' }}>
              <input name="confirm" type={showConfirm ? 'text' : 'password'} placeholder="Nhập lại mật khẩu"
                value={form.confirm} onChange={handleChange} required
                onFocus={() => setFocused('confirm')} onBlur={() => setFocused('')}
                style={{
                  ...inputStyle, paddingRight: '44px',
                  borderColor: form.confirm && form.confirm !== form.password ? '#e53e3e' : focused === 'confirm' ? '#f6ad55' : 'rgba(246,173,85,0.2)',
                  boxShadow: focused === 'confirm' ? '0 0 0 3px rgba(246,173,85,0.12)' : 'none'
                }} />
              <EyeBtn show={showConfirm} toggle={() => setShowConfirm(s => !s)} />
            </div>
            {form.confirm && form.confirm !== form.password && (
              <div style={{ fontSize: '12px', color: '#fc8181', marginTop: '5px' }}>Mật khẩu không khớp</div>
            )}
          </div>

          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
            <div style={{ position: 'relative', marginTop: '2px', flexShrink: 0 }}>
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                style={{ opacity: 0, position: 'absolute', width: '18px', height: '18px', cursor: 'pointer', margin: 0 }} />
              <div style={{
                width: '18px', height: '18px', borderRadius: '5px',
                border: `2px solid ${agreed ? '#f6ad55' : 'rgba(246,173,85,0.3)'}`,
                background: agreed ? '#f6ad55' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .2s'
              }}>
                {agreed && <svg width="11" height="11" viewBox="0 0 12 10" fill="none"><polyline points="1,5 4,9 11,1" stroke="#111827" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
            </div>
            <span style={{ fontSize: '12.5px', color: '#a0aec0', lineHeight: 1.5 }}>
              Tôi đồng ý với <span style={{ color: '#f6ad55', fontWeight: 600 }}>Điều khoản dịch vụ</span> &amp; <span style={{ color: '#f6ad55', fontWeight: 600 }}>Chính sách bảo mật</span> của TruongMobile.
            </span>
          </label>

          <button type="submit" disabled={loading} style={{
            padding: '14px', background: loading ? '#4a5568' : 'linear-gradient(135deg, #f6ad55, #ed8936)',
            color: '#111827', fontWeight: 800, fontSize: '15px', borderRadius: '10px',
            border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 16px rgba(246,173,85,0.35)', marginTop: '4px', transition: 'all .25s'
          }}>
            {loading ? 'Đang xử lý...' : 'ĐĂNG KÝ'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13.5px', color: '#718096' }}>
          Đã có tài khoản?{' '}
          <Link to="/login" style={{ color: '#f6ad55', fontWeight: 700 }}>Đăng nhập</Link>
        </div>
      </div>
    </main>
  );
}
