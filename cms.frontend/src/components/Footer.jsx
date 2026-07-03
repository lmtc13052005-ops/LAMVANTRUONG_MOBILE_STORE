import { useState } from 'react';
import { Link } from 'react-router-dom';

const TRUST_ITEMS = [
  {
    label: 'Giao hàng miễn phí', sub: 'Đơn từ 500.000đ',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f6ad55" strokeWidth="1.8" strokeLinecap="round">
        <rect x="1" y="3" width="15" height="13" rx="1"/>
        <path d="M16 8h4l3 5v3h-7V8z"/>
        <circle cx="5.5" cy="18.5" r="2.5"/>
        <circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    )
  },
  {
    label: 'Hỗ trợ 24/7', sub: 'Tư vấn miễn phí',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f6ad55" strokeWidth="1.8" strokeLinecap="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.54a16 16 0 0 0 6.29 6.29l1.63-1.63a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    )
  },
  {
    label: 'Thanh toán an toàn', sub: 'Nhiều hình thức',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f6ad55" strokeWidth="1.8" strokeLinecap="round">
        <rect x="1" y="4" width="22" height="16" rx="2"/>
        <line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    )
  },
  {
    label: 'Bảo hành chính hãng', sub: '12 – 24 tháng',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f6ad55" strokeWidth="1.8" strokeLinecap="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    )
  },
  {
    label: 'Đổi trả 30 ngày', sub: 'Không cần lý do',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f6ad55" strokeWidth="1.8" strokeLinecap="round">
        <polyline points="1 4 1 10 7 10"/>
        <path d="M3.51 15a9 9 0 1 0 .49-4.5"/>
      </svg>
    )
  },
];

export default function Footer() {
  const [email, setEmail] = useState('');

  return (
    <>
      {/* Trust bar */}
      <div style={{ background: '#1a2332', marginTop: '60px' }}>
        <div style={{
          maxWidth: '1380px', margin: '0 auto', padding: '0 28px',
          display: 'flex', alignItems: 'stretch',
          borderTop: '1px solid #2d3748', borderBottom: '1px solid #2d3748'
        }}>
          {TRUST_ITEMS.map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '13px',
              padding: '22px 20px', flex: 1,
              borderRight: i < TRUST_ITEMS.length - 1 ? '1px solid #2d3748' : 'none'
            }}>
              <div style={{
                width: '46px', height: '46px', borderRadius: '50%',
                background: 'rgba(246,173,85,0.1)',
                border: '1px solid rgba(246,173,85,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                {item.icon}
              </div>
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#fff', marginBottom: '2px' }}>
                  {item.label}
                </div>
                <div style={{ fontSize: '12px', color: '#718096' }}>{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer body */}
      <footer style={{ background: '#0b111a', padding: '48px 0 0' }}>
        <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '0 28px' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '2.2fr 1fr 1fr 1.2fr',
            gap: '48px', paddingBottom: '40px', borderBottom: '1px solid #1e2d3d'
          }}>
            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <div style={{
                  width: '36px', height: '36px', background: '#f6ad55',
                  borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"
                      stroke="#111827" strokeWidth="2" strokeLinejoin="round"/>
                    <line x1="3" y1="6" x2="21" y2="6" stroke="#111827" strokeWidth="2"/>
                    <path d="M16 10a4 4 0 0 1-8 0" stroke="#111827" strokeWidth="2"/>
                  </svg>
                </div>
                <span style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>
                  Truong<span style={{ color: '#f6ad55' }}>Mobile</span>
                </span>
              </div>
              <p style={{ fontSize: '13px', color: '#718096', lineHeight: 1.75, marginBottom: '18px', maxWidth: '320px' }}>
                Chuyên cung cấp thiết bị điện tử, điện thoại, laptop và phụ kiện chính hãng với giá tốt nhất thị trường Việt Nam.
              </p>
              <div style={{ fontSize: '12.5px', color: '#a0aec0', marginBottom: '10px', fontWeight: 600, letterSpacing: '0.5px' }}>
                ĐĂNG KÝ NHẬN ƯU ĐÃI 10%
              </div>
              <div style={{ display: 'flex', gap: '7px' }}>
                <input
                  type="email" placeholder="Email của bạn..."
                  value={email} onChange={e => setEmail(e.target.value)}
                  style={{
                    flex: 1, padding: '9px 13px', background: '#111827',
                    border: '1px solid #2d3748', borderRadius: '7px',
                    color: '#fff', fontSize: '13px', outline: 'none'
                  }}
                />
                <button style={{
                  padding: '9px 16px', background: '#f6ad55', color: '#111827',
                  fontWeight: 700, fontSize: '13px', borderRadius: '7px',
                  whiteSpace: 'nowrap', border: 'none', cursor: 'pointer'
                }}>Đăng ký</button>
              </div>
            </div>

            {/* Support */}
            <div>
              <h3 style={{ fontSize: '12px', fontWeight: 800, color: '#fff', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Hỗ trợ</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
                {[
                  ['Thông tin giao hàng', '/ho-tro/giao-hang'],
                  ['Chính sách đổi trả', '/ho-tro/doi-tra'],
                  ['Bảo hành sản phẩm', '/ho-tro/bao-hanh'],
                  ['Câu hỏi thường gặp', '/ho-tro/faq'],
                  ['Liên hệ hỗ trợ', '/ho-tro/lien-he'],
                ].map(([label, path]) => (
                  <Link key={label} to={path} className="footer-link" style={{ fontSize: '13.5px', color: '#718096', transition: 'color .2s' }}>{label}</Link>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 style={{ fontSize: '12px', fontWeight: 800, color: '#fff', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Danh mục</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
                {[
                  ['Điện thoại', '/shop?categoryId=1'],
                  ['Laptop & Máy tính', '/shop?categoryId=2'],
                  ['Máy tính bảng', '/shop?categoryId=3'],
                  ['Tai nghe & Loa', '/shop?categoryId=5'],
                  ['Đồng hồ thông minh', '/shop?categoryId=4'],
                  ['Phụ kiện', '/shop?categoryId=6'],
                ].map(([label, path]) => (
                  <Link key={label} to={path} className="footer-link" style={{ fontSize: '13.5px', color: '#718096', transition: 'color .2s' }}>{label}</Link>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 style={{ fontSize: '12px', fontWeight: 800, color: '#fff', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Liên hệ</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                {[
                  { icon: <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>, extra: <circle cx="12" cy="10" r="3"/>, text: '123 Đường Nguyễn Huệ, Q.1, TP. HCM' },
                  { icon: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.54a16 16 0 0 0 6.29 6.29l1.63-1.63a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>, text: '0901 234 567' },
                  { icon: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>, text: 'info@truongmobile.vn' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f6ad55" strokeWidth="2" style={{ marginTop: '2px', flexShrink: 0 }}>
                      {item.icon}{item.extra}
                    </svg>
                    <span style={{ fontSize: '13px', color: '#718096', lineHeight: 1.6 }}>{item.text}</span>
                  </div>
                ))}
              </div>

              {/* Social */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {[
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>,
                  <><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></>,
                  <><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></>,
                ].map((path, i) => (
                  <a key={i} href="#" className="social-btn" style={{
                    width: '34px', height: '34px', borderRadius: '7px',
                    background: '#111827', border: '1px solid #2d3748',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#718096', transition: 'border-color .2s, color .2s'
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{path}</svg>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '18px 0', flexWrap: 'wrap', gap: '12px'
          }}>
            <p style={{ fontSize: '13px', color: '#4a5568' }}>
              © 2025 TruongMobile. Bảo lưu mọi quyền.
            </p>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: '#4a5568' }}>Chấp nhận:</span>
              {['VISA', 'PayPal', 'Momo', 'ZaloPay', 'COD'].map(m => (
                <span key={m} style={{
                  padding: '3px 10px', background: '#111827', border: '1px solid #2d3748',
                  borderRadius: '5px', fontSize: '11px', fontWeight: 700, color: '#a0aec0'
                }}>{m}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
