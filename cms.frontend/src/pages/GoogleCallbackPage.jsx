import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API = process.env.REACT_APP_API_BASE_URL || process.env.REACT_APP_API_URL || 'https://localhost:7094/api';

export default function GoogleCallbackPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Đang xác thực với Google...');

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    if (!code) {
      setStatus('Không nhận được mã từ Google. Đang chuyển hướng...');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    const redirectUri = window.location.origin + '/auth/google/callback';

    fetch(`${API}/customers/google-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, redirectUri })
    })
      .then(res => res.json().then(data => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) {
          setStatus(data.message || 'Đăng nhập Google thất bại.');
          setTimeout(() => navigate('/login'), 2500);
          return;
        }
        localStorage.setItem('customer', JSON.stringify(data));
        window.dispatchEvent(new Event('customerChanged'));
        navigate('/');
      })
      .catch(() => {
        setStatus('Lỗi kết nối server. Đang chuyển hướng...');
        setTimeout(() => navigate('/login'), 2500);
      });
  }, [navigate]);

  return (
    <main style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a0f18 0%, #111827 50%, #1a2332 100%)'
    }}>
      <div style={{ textAlign: 'center', color: '#a0aec0' }}>
        <div style={{
          width: '48px', height: '48px', border: '4px solid #f6ad55',
          borderTop: '4px solid transparent', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite', margin: '0 auto 20px'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ fontSize: '15px', color: '#cbd5e0' }}>{status}</p>
      </div>
    </main>
  );
}
