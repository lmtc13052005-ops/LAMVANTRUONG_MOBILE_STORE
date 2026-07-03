import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API = process.env.REACT_APP_API_BASE_URL || 'https://localhost:7094/api';

// Hiệu ứng 3D card với nhiều lớp box-shadow
const cardStyle = {
  background: 'linear-gradient(145deg, #1a2332, #111827)',
  borderRadius: '20px',
  padding: '42px 40px',
  width: '100%',
  maxWidth: '440px',
  boxShadow: `
    0 0 0 1px rgba(246,173,85,0.25),
    4px 4px 0 rgba(246,173,85,0.12),
    8px 8px 0 rgba(246,173,85,0.06),
    0 24px 60px rgba(0,0,0,0.6),
    0 4px 16px rgba(0,0,0,0.4)
  `,
  position: 'relative',
  transform: 'perspective(1200px) rotateX(1.5deg)',
  transition: 'transform .3s, box-shadow .3s',
};

const inputStyle = {
  width: '100%', padding: '13px 16px', fontSize: '14px',
  background: '#0f1923', border: '1px solid rgba(246,173,85,0.2)',
  borderRadius: '10px', color: '#e2e8f0', outline: 'none',
  transition: 'border-color .2s, box-shadow .2s',
  fontFamily: 'inherit', boxSizing: 'border-box'
};

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [focused, setFocused] = useState('');
  const [cardHovered, setCardHovered] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!agreed) { setError('Vui lòng đồng ý với Điều khoản dịch vụ và Chính sách bảo mật.'); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}/customers/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password })
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Đăng nhập thất bại.'); return; }
      localStorage.setItem('customer', JSON.stringify(data));
      window.dispatchEvent(new Event('customerChanged'));
      navigate('/');
    } catch {
      setError('Không kết nối được server. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setError('Đăng nhập Google đang được cập nhật. Vui lòng sử dụng email/mật khẩu.');
      return;
    }
    const redirectUri = encodeURIComponent(window.location.origin + '/auth/google/callback');
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid%20email%20profile`;
  };

  return (
    <main style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a0f18 0%, #111827 40%, #1a2332 70%, #0d1520 100%)',
      padding: '40px 20px', position: 'relative', overflow: 'hidden'
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute', top: '-120px', left: '-120px', width: '400px', height: '400px',
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(246,173,85,0.06) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', bottom: '-80px', right: '-80px', width: '320px', height: '320px',
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(246,173,85,0.04) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div
        style={{
          ...cardStyle,
          transform: cardHovered
            ? 'perspective(1200px) rotateX(0deg) translateY(-4px)'
            : 'perspective(1200px) rotateX(1.5deg)',
          boxShadow: cardHovered
            ? `0 0 0 1px rgba(246,173,85,0.5), 6px 6px 0 rgba(246,173,85,0.18), 12px 12px 0 rgba(246,173,85,0.08), 0 32px 80px rgba(0,0,0,0.7)`
            : cardStyle.boxShadow,
        }}
        onMouseEnter={() => setCardHovered(true)}
        onMouseLeave={() => setCardHovered(false)}
      >
        {/* Logo + Title */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#f6ad55', letterSpacing: '-0.5px', marginBottom: '6px' }}>
            TruongMobile
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', margin: 0 }}>Đăng nhập</h1>
          <p style={{ fontSize: '13px', color: '#718096', marginTop: '6px' }}>Chào mừng bạn quay lại!</p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            padding: '11px 14px', background: 'rgba(229,62,62,0.12)',
            border: '1px solid rgba(229,62,62,0.3)', borderRadius: '9px',
            color: '#fc8181', fontSize: '13px', marginBottom: '18px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Email */}
          <div>
            <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#a0aec0', display: 'block', marginBottom: '7px' }}>
              Email / Số điện thoại
            </label>
            <input
              name="email" type="text" autoComplete="email"
              placeholder="Nhập email hoặc số điện thoại"
              value={form.email} onChange={handleChange} required
              onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
              style={{
                ...inputStyle,
                borderColor: focused === 'email' ? '#f6ad55' : 'rgba(246,173,85,0.2)',
                boxShadow: focused === 'email' ? '0 0 0 3px rgba(246,173,85,0.12)' : 'none'
              }}
            />
          </div>

          {/* Password */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '7px' }}>
              <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#a0aec0' }}>Mật khẩu</label>
              <Link to="/forgot-password" style={{ fontSize: '12.5px', color: '#f6ad55', fontWeight: 600 }}>
                Quên mật khẩu?
              </Link>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                name="password" type={showPw ? 'text' : 'password'} autoComplete="current-password"
                placeholder="Nhập mật khẩu"
                value={form.password} onChange={handleChange} required
                onFocus={() => setFocused('password')} onBlur={() => setFocused('')}
                style={{
                  ...inputStyle,
                  paddingRight: '44px',
                  borderColor: focused === 'password' ? '#f6ad55' : 'rgba(246,173,85,0.2)',
                  boxShadow: focused === 'password' ? '0 0 0 3px rgba(246,173,85,0.12)' : 'none'
                }}
              />
              <button type="button" onClick={() => setShowPw(s => !s)} style={{
                position: 'absolute', right: '13px', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: '#718096', padding: '4px'
              }}>
                {showPw ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Điều khoản */}
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
            <div style={{ position: 'relative', marginTop: '2px', flexShrink: 0 }}>
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                style={{ opacity: 0, position: 'absolute', width: '18px', height: '18px', cursor: 'pointer', margin: 0 }}
              />
              <div style={{
                width: '18px', height: '18px', borderRadius: '5px',
                border: `2px solid ${agreed ? '#f6ad55' : 'rgba(246,173,85,0.3)'}`,
                background: agreed ? '#f6ad55' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all .2s'
              }}>
                {agreed && (
                  <svg width="11" height="11" viewBox="0 0 12 10" fill="none">
                    <polyline points="1,5 4,9 11,1" stroke="#111827" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
            </div>
            <span style={{ fontSize: '12.5px', color: '#a0aec0', lineHeight: 1.5 }}>
              Bằng việc đăng nhập, tôi đồng ý với{' '}
              <span style={{ color: '#f6ad55', fontWeight: 600, cursor: 'pointer' }}>Điều khoản dịch vụ</span>
              {' '}&amp;{' '}
              <span style={{ color: '#f6ad55', fontWeight: 600, cursor: 'pointer' }}>Chính sách bảo mật</span>
              {' '}của TruongMobile.
            </span>
          </label>

          {/* Submit */}
          <button type="submit" disabled={loading} style={{
            padding: '14px', background: loading ? '#4a5568' : 'linear-gradient(135deg, #f6ad55, #ed8936)',
            color: '#111827', fontWeight: 800, fontSize: '15px', borderRadius: '10px',
            border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
            letterSpacing: '0.5px', marginTop: '4px',
            boxShadow: loading ? 'none' : '0 4px 16px rgba(246,173,85,0.35)',
            transition: 'all .25s'
          }}>
            {loading ? 'Đang đăng nhập...' : 'ĐĂNG NHẬP'}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', margin: '20px 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
          <span style={{ fontSize: '12px', color: '#4a5568', fontWeight: 600 }}>HOẶC</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
        </div>

        {/* Google */}
        <button onClick={handleGoogleLogin} style={{
          width: '100%', padding: '12px 20px', background: '#fff', border: 'none',
          borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: '12px', fontWeight: 700, fontSize: '14px', color: '#1a202c',
          boxShadow: '0 2px 8px rgba(0,0,0,0.25)', transition: 'transform .2s, box-shadow .2s'
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.3)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.25)'; }}
        >
          {/* Google SVG icon */}
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
          </svg>
          Đăng nhập với Google
        </button>

        {/* Register link */}
        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13.5px', color: '#718096' }}>
          Bạn chưa có tài khoản?{' '}
          <Link to="/register" style={{ color: '#f6ad55', fontWeight: 700 }}>Đăng ký ngay</Link>
        </div>
      </div>
    </main>
  );
}
