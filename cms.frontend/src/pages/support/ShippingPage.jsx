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

const tableStyle = {
  width: '100%', borderCollapse: 'collapse', fontSize: '13.5px', color: '#a0aec0',
};

const thStyle = {
  padding: '11px 14px', background: 'rgba(246,173,85,0.08)',
  color: '#f6ad55', fontWeight: 700, textAlign: 'left',
  borderBottom: '1px solid rgba(246,173,85,0.15)',
};

const tdStyle = {
  padding: '11px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)',
};

function Icon({ d, extra }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f6ad55" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d={d} />{extra}
    </svg>
  );
}

export default function ShippingPage() {
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
          <span style={{ color: '#f6ad55' }}>Thông tin giao hàng</span>
        </div>

        {/* Title */}
        <div style={{ marginBottom: '36px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#fff', margin: '0 0 8px' }}>
            Thông tin giao hàng
          </h1>
          <p style={{ fontSize: '14px', color: '#718096' }}>
            TruongMobile cam kết giao hàng nhanh chóng, an toàn trên toàn quốc.
          </p>
        </div>

        {/* Phương thức giao hàng */}
        <div style={sectionStyle}>
          <div style={headingStyle}>
            <Icon d="M16 3h5v5M21 3l-7 7M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5" />
            Phương thức giao hàng
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { title: 'Giao hàng tiêu chuẩn', desc: 'Áp dụng toàn quốc. Thời gian 3–5 ngày làm việc với các tỉnh thành xa trung tâm.', fee: 'Miễn phí đơn từ 500.000đ / 30.000đ nếu dưới mức này' },
              { title: 'Giao hàng nhanh (Express)', desc: 'Giao trong 1–2 ngày làm việc. Áp dụng cho TP.HCM, Hà Nội và các thành phố lớn.', fee: '50.000đ (miễn phí đơn từ 2.000.000đ)' },
              { title: 'Giao trong ngày (Same-day)', desc: 'Giao trong 4 giờ kể từ khi xác nhận đơn. Chỉ áp dụng nội thành TP.HCM & Hà Nội, đặt trước 14:00.', fee: '80.000đ' },
              { title: 'Nhận tại cửa hàng', desc: 'Đặt online, nhận hàng trực tiếp tại 123 Nguyễn Huệ, Q.1, TP.HCM.', fee: 'Miễn phí' },
            ].map(item => (
              <div key={item.title} style={{ display: 'flex', gap: '14px', padding: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f6ad55', marginTop: '6px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 700, color: '#e2e8f0', fontSize: '14px', marginBottom: '4px' }}>{item.title}</div>
                  <div style={{ ...textStyle, marginBottom: '6px' }}>{item.desc}</div>
                  <div style={{ fontSize: '12.5px', color: '#f6ad55', fontWeight: 600 }}>Phí: {item.fee}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Thời gian giao hàng theo khu vực */}
        <div style={sectionStyle}>
          <div style={headingStyle}>
            <Icon d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z" extra={<polyline points="12 6 12 12 16 14" />} />
            Thời gian giao hàng theo khu vực
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Khu vực</th>
                  <th style={thStyle}>Giao tiêu chuẩn</th>
                  <th style={thStyle}>Giao nhanh</th>
                  <th style={thStyle}>Giao trong ngày</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['TP. Hồ Chí Minh', '1–2 ngày', '4–8 giờ', '✓ (nội thành)'],
                  ['Hà Nội', '2–3 ngày', '1 ngày', '✓ (nội thành)'],
                  ['Đà Nẵng, Cần Thơ', '2–3 ngày', '1–2 ngày', '—'],
                  ['Các tỉnh thành khác', '3–5 ngày', '2–3 ngày', '—'],
                  ['Vùng sâu, vùng xa', '5–7 ngày', '3–5 ngày', '—'],
                ].map(([area, std, fast, same], i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                    <td style={{ ...tdStyle, color: '#e2e8f0', fontWeight: 600 }}>{area}</td>
                    <td style={tdStyle}>{std}</td>
                    <td style={tdStyle}>{fast}</td>
                    <td style={{ ...tdStyle, color: same.startsWith('✓') ? '#68d391' : '#4a5568' }}>{same}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ ...textStyle, marginTop: '12px', fontSize: '12.5px', color: '#4a5568' }}>
            * Thời gian trên tính từ khi đơn hàng được xác nhận và không bao gồm ngày lễ, Tết.
          </p>
        </div>

        {/* Quy trình đóng gói */}
        <div style={sectionStyle}>
          <div style={headingStyle}>
            <Icon d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            Quy trình đóng gói & vận chuyển
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
            {[
              { step: '01', title: 'Xác nhận đơn hàng', desc: 'Hệ thống gửi email/SMS xác nhận ngay sau khi đặt hàng thành công.' },
              { step: '02', title: 'Kiểm tra & đóng gói', desc: 'Sản phẩm được kiểm tra kỹ, đóng gói chắc chắn, có seal nguyên vẹn.' },
              { step: '03', title: 'Bàn giao vận chuyển', desc: 'Đơn hàng được bàn giao cho đối tác vận chuyển (GHN, GHTK, VNPost…).' },
              { step: '04', title: 'Theo dõi đơn hàng', desc: 'Mã vận đơn được gửi qua email/SMS để bạn theo dõi trạng thái.' },
            ].map(item => (
              <div key={item.step} style={{ padding: '16px', background: 'rgba(246,173,85,0.05)', border: '1px solid rgba(246,173,85,0.12)', borderRadius: '12px' }}>
                <div style={{ fontSize: '24px', fontWeight: 900, color: 'rgba(246,173,85,0.25)', marginBottom: '8px' }}>{item.step}</div>
                <div style={{ fontWeight: 700, color: '#e2e8f0', fontSize: '13.5px', marginBottom: '6px' }}>{item.title}</div>
                <div style={{ fontSize: '12.5px', color: '#718096', lineHeight: 1.7 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Lưu ý */}
        <div style={{ ...sectionStyle, background: 'rgba(246,173,85,0.05)', border: '1px solid rgba(246,173,85,0.2)' }}>
          <div style={headingStyle}>
            <Icon d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" extra={<><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>} />
            Lưu ý quan trọng
          </div>
          <ul style={{ ...textStyle, paddingLeft: '18px', margin: 0 }}>
            <li style={{ marginBottom: '8px' }}>Vui lòng kiểm tra hàng trước khi thanh toán cho shipper. Nếu phát hiện hư hỏng, từ chối nhận và liên hệ ngay với TruongMobile.</li>
            <li style={{ marginBottom: '8px' }}>Địa chỉ giao hàng cần chính xác. Trường hợp giao sai địa chỉ do khách hàng cung cấp sai, phí giao lại sẽ do khách hàng chịu.</li>
            <li style={{ marginBottom: '8px' }}>Đơn hàng sau 3 lần giao không thành công sẽ bị hủy và hoàn tiền về tài khoản khách hàng.</li>
            <li>Trong trường hợp bất khả kháng (thiên tai, dịch bệnh…), thời gian giao hàng có thể bị kéo dài.</li>
          </ul>
        </div>

        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <p style={{ fontSize: '13.5px', color: '#718096', marginBottom: '14px' }}>Cần hỗ trợ thêm về giao hàng?</p>
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
