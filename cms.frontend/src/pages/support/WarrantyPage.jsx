import { Link } from 'react-router-dom';

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

const textStyle = { fontSize: '13.5px', color: '#a0aec0', lineHeight: 1.8 };

function Icon({ children }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f6ad55" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      {children}
    </svg>
  );
}

const warrantyTable = [
  ['Điện thoại nguyên hãng', '12 tháng', '24 tháng (hãng)', 'Apple, Samsung, Xiaomi…'],
  ['Laptop', '12 tháng', '24 tháng (hãng)', 'Dell, HP, Lenovo, Asus…'],
  ['Máy tính bảng', '12 tháng', '12–24 tháng (hãng)', 'iPad, Samsung Tab…'],
  ['Đồng hồ thông minh', '12 tháng', '12 tháng (hãng)', 'Apple Watch, Galaxy Watch…'],
  ['Tai nghe không dây', '6 tháng', '12 tháng (hãng)', 'AirPods, Galaxy Buds…'],
  ['Loa bluetooth', '6 tháng', '12 tháng (hãng)', 'JBL, Sony, Harman…'],
  ['Cáp sạc, ốp lưng, kính cường lực', '1 tháng', '—', 'Phụ kiện tiêu hao'],
];

export default function WarrantyPage() {
  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0f18 0%, #111827 50%, #0d1520 100%)',
      padding: '48px 20px 80px',
    }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>

        {/* Breadcrumb */}
        <div style={{ fontSize: '13px', color: '#4a5568', marginBottom: '28px', display: 'flex', gap: '6px', alignItems: 'center' }}>
          <Link to="/" style={{ color: '#718096', textDecoration: 'none' }}>Trang chủ</Link>
          <span>/</span>
          <span style={{ color: '#f6ad55' }}>Bảo hành sản phẩm</span>
        </div>

        <div style={{ marginBottom: '36px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#fff', margin: '0 0 8px' }}>Bảo hành sản phẩm</h1>
          <p style={{ fontSize: '14px', color: '#718096' }}>
            Tất cả sản phẩm tại TruongMobile đều là hàng chính hãng, có bảo hành chính thức từ nhà sản xuất.
          </p>
        </div>

        {/* Thống kê nhanh */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '14px', marginBottom: '20px' }}>
          {[
            { icon: '🛡️', title: '12–24 tháng', desc: 'Bảo hành tối đa' },
            { icon: '🔧', title: 'Miễn phí', desc: 'Sửa chữa lỗi kỹ thuật' },
            { icon: '📦', title: '1 đổi 1', desc: '30 ngày đầu nếu lỗi' },
          ].map(item => (
            <div key={item.title} style={{ ...sectionStyle, marginBottom: 0, textAlign: 'center', padding: '22px 16px' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{item.icon}</div>
              <div style={{ fontWeight: 800, color: '#f6ad55', fontSize: '15px', marginBottom: '4px' }}>{item.title}</div>
              <div style={{ fontSize: '12.5px', color: '#718096' }}>{item.desc}</div>
            </div>
          ))}
        </div>

        {/* Bảng thời hạn bảo hành */}
        <div style={sectionStyle}>
          <div style={headingStyle}>
            <Icon><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></Icon>
            Thời hạn bảo hành theo danh mục
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', color: '#a0aec0' }}>
              <thead>
                <tr>
                  {['Danh mục sản phẩm', 'BH TruongMobile', 'BH hãng', 'Ví dụ'].map(h => (
                    <th key={h} style={{ padding: '11px 14px', background: 'rgba(246,173,85,0.08)', color: '#f6ad55', fontWeight: 700, textAlign: 'left', borderBottom: '1px solid rgba(246,173,85,0.15)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {warrantyTable.map(([cat, tm, th, ex], i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                    <td style={{ padding: '11px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#e2e8f0', fontWeight: 600 }}>{cat}</td>
                    <td style={{ padding: '11px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#68d391', fontWeight: 600 }}>{tm}</td>
                    <td style={{ padding: '11px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{th}</td>
                    <td style={{ padding: '11px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#4a5568', fontSize: '12px' }}>{ex}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Phạm vi bảo hành */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div style={{ ...sectionStyle, marginBottom: 0 }}>
            <div style={{ ...headingStyle, color: '#68d391' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#68d391" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
              Được bảo hành
            </div>
            <ul style={{ ...textStyle, paddingLeft: '16px', margin: 0 }}>
              {[
                'Lỗi kỹ thuật từ nhà sản xuất',
                'Màn hình chết điểm ảnh',
                'Lỗi phần mềm gốc không cập nhật được',
                'Pin chai trong điều kiện sử dụng bình thường',
                'Camera mờ, lỗi cảm biến',
                'Lỗi âm thanh, mic không hoạt động',
              ].map(t => <li key={t} style={{ marginBottom: '7px' }}>{t}</li>)}
            </ul>
          </div>

          <div style={{ ...sectionStyle, marginBottom: 0 }}>
            <div style={{ ...headingStyle, color: '#fc8181' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fc8181" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              Không được bảo hành
            </div>
            <ul style={{ ...textStyle, paddingLeft: '16px', margin: 0 }}>
              {[
                'Vỡ màn hình, trầy xước do va đập',
                'Vào nước, ẩm ướt (ngoài khả năng chống nước)',
                'Tự ý tháo máy, can thiệp bên trong',
                'Cháy nổ do sử dụng sạc không chính hãng',
                'Hết hạn bảo hành',
                'Mất/sai thông tin tem bảo hành',
              ].map(t => <li key={t} style={{ marginBottom: '7px' }}>{t}</li>)}
            </ul>
          </div>
        </div>

        {/* Quy trình bảo hành */}
        <div style={sectionStyle}>
          <div style={headingStyle}>
            <Icon><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></Icon>
            Quy trình bảo hành
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { n: '01', t: 'Liên hệ TruongMobile', d: 'Gọi hotline hoặc đến trực tiếp cửa hàng. Mang theo sản phẩm, hóa đơn mua hàng và phiếu bảo hành (nếu có).' },
              { n: '02', t: 'Kiểm tra & tiếp nhận', d: 'Kỹ thuật viên kiểm tra tình trạng máy, xác định lỗi và xác nhận có thuộc diện bảo hành hay không.' },
              { n: '03', t: 'Sửa chữa / thay thế', d: 'Tiến hành sửa chữa hoặc thay linh kiện. Thời gian xử lý từ 1–7 ngày tùy mức độ hỏng và linh kiện có sẵn.' },
              { n: '04', t: 'Trả máy & kiểm tra', d: 'Khách hàng nhận máy, kiểm tra lại đầy đủ trước khi về. Thời hạn bảo hành được cộng thêm số ngày bảo hành.' },
            ].map(s => (
              <div key={s.n} style={{ display: 'flex', gap: '16px', padding: '14px', background: 'rgba(246,173,85,0.04)', border: '1px solid rgba(246,173,85,0.1)', borderRadius: '10px' }}>
                <div style={{ fontSize: '22px', fontWeight: 900, color: 'rgba(246,173,85,0.3)', flexShrink: 0, minWidth: '36px' }}>{s.n}</div>
                <div>
                  <div style={{ fontWeight: 700, color: '#e2e8f0', fontSize: '14px', marginBottom: '5px' }}>{s.t}</div>
                  <div style={textStyle}>{s.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trung tâm bảo hành */}
        <div style={{ ...sectionStyle, background: 'rgba(246,173,85,0.05)', border: '1px solid rgba(246,173,85,0.2)' }}>
          <div style={headingStyle}>
            <Icon><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></Icon>
            Trung tâm bảo hành TruongMobile
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
            {[
              { city: 'TP. Hồ Chí Minh', addr: '123 Đường Nguyễn Huệ, Q.1', time: 'T2–T7: 8:00–21:00 | CN: 9:00–18:00' },
              { city: 'Hà Nội', addr: '456 Phố Huế, Q. Hai Bà Trưng', time: 'T2–T7: 8:00–21:00 | CN: 9:00–18:00' },
            ].map(c => (
              <div key={c.city} style={{ padding: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                <div style={{ fontWeight: 700, color: '#f6ad55', marginBottom: '6px', fontSize: '14px' }}>{c.city}</div>
                <div style={{ fontSize: '13px', color: '#a0aec0', marginBottom: '4px' }}>{c.addr}</div>
                <div style={{ fontSize: '12.5px', color: '#718096' }}>{c.time}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <p style={{ fontSize: '13.5px', color: '#718096', marginBottom: '14px' }}>Cần hỗ trợ bảo hành?</p>
          <Link to="/ho-tro/lien-he" style={{
            display: 'inline-block', padding: '12px 28px',
            background: 'linear-gradient(135deg, #f6ad55, #ed8936)',
            color: '#111827', fontWeight: 800, fontSize: '14px',
            borderRadius: '10px', textDecoration: 'none'
          }}>
            Liên hệ hỗ trợ
          </Link>
        </div>
      </div>
    </main>
  );
}
