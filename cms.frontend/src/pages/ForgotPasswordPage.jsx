import { useState } from 'react';
import { Link } from 'react-router-dom';

const API = process.env.REACT_APP_API_BASE_URL || 'https://localhost:7094/api';

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

const cardBase = {
  background: 'linear-gradient(145deg, #1a2332, #111827)',
  borderRadius: '20px', padding: '40px', width: '100%', maxWidth: '440px',
  boxShadow: `0 0 0 1px rgba(246,173,85,0.25), 4px 4px 0 rgba(246,173,85,0.12), 8px 8px 0 rgba(246,173,85,0.06), 0 24px 60px rgba(0,0,0,0.6)`,
};

export default function ForgotPasswordPage() {
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', newPassword: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [focused, setFocused] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleChange = e => { setForm(f => ({ ...f, [e.target.name]: e.target.value })); setError(''); };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (form.newPassword !== form.confirm) { setError('Mật khẩu xác nhận không khớp.'); return; }
    if (form.newPassword.length < 6) { setError('Mật khẩu phải có ít nhất 6 ký tự.'); return; }

    setLoading(true);
    try {
      const res = await fetch(`${API}/customers/forgot-password/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          newPassword: form.newPassword,
        })
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Gửi yêu cầu thất bại.'); return; }
      setSubmitted(true);
    } catch {
      setError('Không kết nối được server. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a0f18 0%, #111827 40%, #1a2332 70%, #0d1520 100%)',
      padding: '40px 20px', overflow: 'hidden', position: 'relative'
    }}>
      <div style={{
        position: 'absolute', top: '-80px', left: '50%', transform: 'translateX(-50%)',
        width: '500px', height: '250px',
        background: 'radial-gradient(ellipse, rgba(246,173,85,0.05) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div style={cardBase}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <Link to="/" style={{ fontSize: '22px', fontWeight: 900, color: '#f6ad55', textDecoration: 'none', display: 'block', marginBottom: '6px' }}>
            TruongMobile
          </Link>
          <h1 style={{ fontSize: '19px', fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>Quên mật khẩu</h1>
          <p style={{ fontSize: '12.5px', color: '#718096' }}>
            Điền đầy đủ thông tin, admin sẽ xem xét và duyệt yêu cầu
          </p>
        </div>

        {/* Thành công */}
        {submitted ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'rgba(56,161,105,0.15)', border: '2px solid rgba(56,161,105,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px', fontSize: '28px'
            }}>
              ✓
            </div>
            <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#68d391', margin: '0 0 10px' }}>Yêu cầu đã được gửi!</h2>
            <p style={{ fontSize: '13.5px', color: '#a0aec0', lineHeight: 1.7, margin: '0 0 28px' }}>
              Admin sẽ xem xét thông tin của bạn và xử lý yêu cầu đổi mật khẩu trong thời gian sớm nhất.
            </p>
            <Link to="/login" style={{
              display: 'block', padding: '13px',
              background: 'linear-gradient(135deg, #f6ad55, #ed8936)',
              color: '#111827', fontWeight: 800, fontSize: '14px', borderRadius: '10px',
              textDecoration: 'none', textAlign: 'center'
            }}>
              Quay lại Đăng nhập
            </Link>
          </div>
        ) : (
          <>
            {/* Alerts */}
            {error && (
              <div style={{ padding: '10px 14px', background: 'rgba(229,62,62,0.12)', border: '1px solid rgba(229,62,62,0.3)', borderRadius: '9px', color: '#fc8181', fontSize: '13px', marginBottom: '16px' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#a0aec0', display: 'block', marginBottom: '7px' }}>
                  Họ và tên <span style={{ color: '#f6ad55' }}>*</span>
                </label>
                <input name="fullName" placeholder="Nguyễn Văn A" value={form.fullName} onChange={handleChange} required
                  onFocus={() => setFocused('fullName')} onBlur={() => setFocused('')}
                  style={{ ...inputStyle, ...focusStyle(focused === 'fullName') }} />
              </div>

              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#a0aec0', display: 'block', marginBottom: '7px' }}>
                  Email đã đăng ký <span style={{ color: '#f6ad55' }}>*</span>
                </label>
                <input name="email" type="email" placeholder="example@gmail.com" value={form.email} onChange={handleChange} required
                  onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
                  style={{ ...inputStyle, ...focusStyle(focused === 'email') }} />
              </div>

              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#a0aec0', display: 'block', marginBottom: '7px' }}>
                  Số điện thoại <span style={{ color: '#f6ad55' }}>*</span>
                </label>
                <input name="phone" type="tel" placeholder="0901 234 567" value={form.phone} onChange={handleChange} required
                  onFocus={() => setFocused('phone')} onBlur={() => setFocused('')}
                  style={{ ...inputStyle, ...focusStyle(focused === 'phone') }} />
              </div>

              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#a0aec0', display: 'block', marginBottom: '7px' }}>
                  Mật khẩu mới <span style={{ color: '#f6ad55' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input name="newPassword" type={showPw ? 'text' : 'password'} placeholder="Tối thiểu 6 ký tự"
                    value={form.newPassword} onChange={handleChange} required
                    onFocus={() => setFocused('newPassword')} onBlur={() => setFocused('')}
                    style={{ ...inputStyle, paddingRight: '44px', ...focusStyle(focused === 'newPassword') }} />
                  <button type="button" onClick={() => setShowPw(s => !s)} style={{
                    position: 'absolute', right: '13px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#718096', padding: '4px'
                  }}>
                    {showPw
                      ? <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#a0aec0', display: 'block', marginBottom: '7px' }}>
                  Xác nhận mật khẩu mới <span style={{ color: '#f6ad55' }}>*</span>
                </label>
                <input name="confirm" type="password" placeholder="Nhập lại mật khẩu"
                  value={form.confirm} onChange={handleChange} required
                  onFocus={() => setFocused('confirm')} onBlur={() => setFocused('')}
                  style={{
                    ...inputStyle,
                    borderColor: form.confirm && form.confirm !== form.newPassword ? '#e53e3e' : focused === 'confirm' ? '#f6ad55' : 'rgba(246,173,85,0.2)',
                    boxShadow: focused === 'confirm' ? '0 0 0 3px rgba(246,173,85,0.12)' : 'none'
                  }} />
                {form.confirm && form.confirm !== form.newPassword && (
                  <div style={{ fontSize: '12px', color: '#fc8181', marginTop: '5px' }}>Mật khẩu không khớp</div>
                )}
              </div>

              <div style={{
                padding: '12px 14px', background: 'rgba(246,173,85,0.06)',
                border: '1px solid rgba(246,173,85,0.2)', borderRadius: '10px',
                fontSize: '12.5px', color: '#a0aec0', lineHeight: 1.6
              }}>
                Sau khi gửi, admin sẽ xác minh thông tin và cập nhật mật khẩu mới cho bạn.
              </div>

              <button type="submit" disabled={loading} style={{
                padding: '14px', background: loading ? '#4a5568' : 'linear-gradient(135deg, #f6ad55, #ed8936)',
                color: '#111827', fontWeight: 800, fontSize: '15px', borderRadius: '10px',
                border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 16px rgba(246,173,85,0.3)', letterSpacing: '0.5px', marginTop: '4px'
              }}>
                {loading ? 'Đang gửi...' : 'GỬI YÊU CẦU'}
              </button>
            </form>
          </>
        )}

        {!submitted && (
          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13.5px', color: '#718096' }}>
            <Link to="/login" style={{ color: '#f6ad55', fontWeight: 700 }}>← Quay lại Đăng nhập</Link>
          </div>
        )}
      </div>
    </main>
  );
}
