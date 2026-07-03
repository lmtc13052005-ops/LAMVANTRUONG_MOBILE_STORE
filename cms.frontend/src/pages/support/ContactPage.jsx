import { useState } from 'react';
import { Link } from 'react-router-dom';

const API = process.env.REACT_APP_API_BASE_URL || 'https://localhost:7094/api';

const sectionStyle = {
  background: 'linear-gradient(145deg, #1a2332, #111827)',
  border: '1px solid rgba(246,173,85,0.15)',
  borderRadius: '16px',
  padding: '28px 32px',
  marginBottom: '20px',
};

const headingStyle = {
  fontSize: '15px', fontWeight: 800, color: '#f6ad55',
  marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px',
};

const inputStyle = {
  width: '100%', padding: '12px 15px', fontSize: '14px',
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

function Icon({ children }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f6ad55" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      {children}
    </svg>
  );
}

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [focused, setFocused] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => { setForm(f => ({ ...f, [e.target.name]: e.target.value })); setError(''); };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Gửi thất bại. Vui lòng thử lại.');
        return;
      }
      setSuccess(true);
    } catch {
      setError('Không kết nối được server. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0f18 0%, #111827 50%, #0d1520 100%)',
      padding: '48px 20px 80px',
    }}>
      <div style={{ maxWidth: '920px', margin: '0 auto' }}>

        {/* Breadcrumb */}
        <div style={{ fontSize: '13px', color: '#4a5568', marginBottom: '28px', display: 'flex', gap: '6px', alignItems: 'center' }}>
          <Link to="/" style={{ color: '#718096', textDecoration: 'none' }}>Trang chủ</Link>
          <span>/</span>
          <span style={{ color: '#f6ad55' }}>Liên hệ hỗ trợ</span>
        </div>

        <div style={{ marginBottom: '36px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#fff', margin: '0 0 8px' }}>Liên hệ hỗ trợ</h1>
          <p style={{ fontSize: '14px', color: '#718096' }}>
            Đội ngũ TruongMobile luôn sẵn sàng hỗ trợ bạn từ 8:00 – 21:00 mỗi ngày.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '20px', alignItems: 'start' }}>

          {/* Thông tin liên hệ */}
          <div>
            {/* Kênh hỗ trợ */}
            <div style={sectionStyle}>
              <div style={headingStyle}>
                <Icon><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.54a16 16 0 0 0 6.29 6.29l1.63-1.63a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></Icon>
                Kênh hỗ trợ
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { icon: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.54a16 16 0 0 0 6.29 6.29l1.63-1.63a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>, label: 'Hotline', value: '0901 234 567', sub: 'T2–CN: 8:00 – 21:00' },
                  { icon: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>, label: 'Email', value: 'info@truongmobile.vn', sub: 'Phản hồi trong 2–4 giờ làm việc' },
                  { icon: <><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></>, label: 'Facebook / Instagram', value: '@TruongMobile', sub: 'Tin nhắn fanpage' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(246,173,85,0.1)', border: '1px solid rgba(246,173,85,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f6ad55" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{item.icon}</svg>
                    </div>
                    <div>
                      <div style={{ fontSize: '11.5px', color: '#718096', marginBottom: '2px' }}>{item.label}</div>
                      <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#e2e8f0', marginBottom: '1px' }}>{item.value}</div>
                      <div style={{ fontSize: '12px', color: '#4a5568' }}>{item.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Địa chỉ */}
            <div style={sectionStyle}>
              <div style={headingStyle}>
                <Icon><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></Icon>
                Cửa hàng
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { city: 'TP. Hồ Chí Minh', addr: '123 Đường Nguyễn Huệ, Quận 1', time: 'T2–CN: 8:00–21:00' },
                  { city: 'Hà Nội', addr: '456 Phố Huế, Q. Hai Bà Trưng', time: 'T2–CN: 8:00–21:00' },
                ].map(c => (
                  <div key={c.city} style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontWeight: 700, color: '#f6ad55', fontSize: '13px', marginBottom: '4px' }}>{c.city}</div>
                    <div style={{ fontSize: '13px', color: '#a0aec0', marginBottom: '3px' }}>{c.addr}</div>
                    <div style={{ fontSize: '12px', color: '#4a5568' }}>{c.time}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Giờ làm việc */}
            <div style={{ ...sectionStyle, marginBottom: 0 }}>
              <div style={headingStyle}>
                <Icon><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></Icon>
                Giờ làm việc
              </div>
              {[
                ['Thứ 2 – Thứ 6', '8:00 – 21:00'],
                ['Thứ 7', '8:00 – 21:00'],
                ['Chủ nhật', '9:00 – 18:00'],
                ['Ngày lễ', 'Theo thông báo'],
              ].map(([day, time]) => (
                <div key={day} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '13.5px' }}>
                  <span style={{ color: '#a0aec0' }}>{day}</span>
                  <span style={{ color: '#f6ad55', fontWeight: 600 }}>{time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form liên hệ */}
          <div style={sectionStyle}>
            <div style={headingStyle}>
              <Icon><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></Icon>
              Gửi tin nhắn cho chúng tôi
            </div>

            {success ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(104,211,145,0.15)', border: '2px solid rgba(104,211,145,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '24px', color: '#68d391' }}>✓</div>
                <div style={{ fontWeight: 800, color: '#68d391', fontSize: '16px', marginBottom: '8px' }}>Đã gửi thành công!</div>
                <div style={{ fontSize: '13.5px', color: '#718096', lineHeight: 1.7 }}>
                  Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong vòng 2–4 giờ làm việc.
                </div>
                <button onClick={() => { setSuccess(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }}
                  style={{ marginTop: '20px', padding: '10px 22px', background: 'transparent', border: '1px solid rgba(246,173,85,0.3)', color: '#f6ad55', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                  Gửi tin nhắn khác
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {error && (
                  <div style={{ padding: '10px 14px', background: 'rgba(229,62,62,0.12)', border: '1px solid rgba(229,62,62,0.3)', borderRadius: '8px', color: '#fc8181', fontSize: '13px' }}>
                    {error}
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#a0aec0', display: 'block', marginBottom: '6px' }}>Họ và tên <span style={{ color: '#f6ad55' }}>*</span></label>
                    <input name="name" placeholder="Nguyễn Văn A" value={form.name} onChange={handleChange} required
                      onFocus={() => setFocused('name')} onBlur={() => setFocused('')}
                      style={{ ...inputStyle, ...focusStyle(focused === 'name') }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#a0aec0', display: 'block', marginBottom: '6px' }}>Số điện thoại</label>
                    <input name="phone" type="tel" placeholder="0901 234 567" value={form.phone} onChange={handleChange}
                      onFocus={() => setFocused('phone')} onBlur={() => setFocused('')}
                      style={{ ...inputStyle, ...focusStyle(focused === 'phone') }} />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#a0aec0', display: 'block', marginBottom: '6px' }}>Email <span style={{ color: '#f6ad55' }}>*</span></label>
                  <input name="email" type="email" placeholder="example@gmail.com" value={form.email} onChange={handleChange} required
                    onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
                    style={{ ...inputStyle, ...focusStyle(focused === 'email') }} />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#a0aec0', display: 'block', marginBottom: '6px' }}>Chủ đề <span style={{ color: '#f6ad55' }}>*</span></label>
                  <select name="subject" value={form.subject} onChange={handleChange} required
                    onFocus={() => setFocused('subject')} onBlur={() => setFocused('')}
                    style={{ ...inputStyle, ...focusStyle(focused === 'subject'), cursor: 'pointer' }}>
                    <option value="">-- Chọn chủ đề --</option>
                    <option value="order">Hỏi về đơn hàng</option>
                    <option value="shipping">Giao hàng & vận chuyển</option>
                    <option value="warranty">Bảo hành & sửa chữa</option>
                    <option value="return">Đổi trả sản phẩm</option>
                    <option value="product">Tư vấn sản phẩm</option>
                    <option value="payment">Thanh toán & hóa đơn</option>
                    <option value="other">Khác</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#a0aec0', display: 'block', marginBottom: '6px' }}>Nội dung <span style={{ color: '#f6ad55' }}>*</span></label>
                  <textarea name="message" placeholder="Mô tả chi tiết vấn đề bạn cần hỗ trợ..." value={form.message} onChange={handleChange} required rows={5}
                    onFocus={() => setFocused('message')} onBlur={() => setFocused('')}
                    style={{ ...inputStyle, resize: 'vertical', minHeight: '110px', ...focusStyle(focused === 'message') }} />
                </div>

                <button type="submit" disabled={loading} style={{
                  padding: '13px', background: loading ? '#4a5568' : 'linear-gradient(135deg, #f6ad55, #ed8936)',
                  color: '#111827', fontWeight: 800, fontSize: '14px', borderRadius: '10px',
                  border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 16px rgba(246,173,85,0.3)', transition: 'all .25s'
                }}>
                  {loading ? 'Đang gửi...' : 'GỬI TIN NHẮN'}
                </button>

                <p style={{ fontSize: '12px', color: '#4a5568', textAlign: 'center', margin: 0 }}>
                  Hoặc gọi ngay <a href="tel:0901234567" style={{ color: '#f6ad55', fontWeight: 700, textDecoration: 'none' }}>0901 234 567</a> để được hỗ trợ nhanh nhất
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
