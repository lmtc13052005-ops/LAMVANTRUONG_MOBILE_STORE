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

const conditions = [
  { ok: true, label: 'Sản phẩm còn nguyên vẹn, chưa qua sử dụng, đủ phụ kiện, hộp và tem niêm phong.' },
  { ok: true, label: 'Sản phẩm bị lỗi kỹ thuật do nhà sản xuất (màn hình chết điểm, lỗi phần mềm gốc, pin chai nhanh…).' },
  { ok: true, label: 'Giao sai sản phẩm so với đơn đặt hàng (sai màu, sai dung lượng, sai model).' },
  { ok: true, label: 'Sản phẩm bị hỏng trong quá trình vận chuyển (kèm hình ảnh/video chứng minh).' },
  { ok: false, label: 'Sản phẩm đã qua sử dụng, có dấu hiệu trầy xước, vỡ màn hình hoặc hư hỏng do người dùng.' },
  { ok: false, label: 'Hết thời hạn đổi trả (sau 30 ngày kể từ ngày nhận hàng).' },
  { ok: false, label: 'Mất tem niêm phong, hộp bị rách nát hoặc thiếu phụ kiện đi kèm.' },
  { ok: false, label: 'Sản phẩm trong danh mục không áp dụng đổi trả (phụ kiện tiêu hao: tai nghe dây, cáp sạc…).' },
];

export default function ReturnPolicyPage() {
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
          <span style={{ color: '#f6ad55' }}>Chính sách đổi trả</span>
        </div>

        <div style={{ marginBottom: '36px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#fff', margin: '0 0 8px' }}>Chính sách đổi trả</h1>
          <p style={{ fontSize: '14px', color: '#718096' }}>
            TruongMobile áp dụng chính sách đổi trả 30 ngày — không cần lý do với sản phẩm lỗi.
          </p>
        </div>

        {/* Thời hạn */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '14px', marginBottom: '20px' }}>
          {[
            { num: '30', unit: 'ngày', label: 'Đổi trả sản phẩm lỗi', color: '#f6ad55' },
            { num: '7', unit: 'ngày', label: 'Đổi màu / dung lượng', color: '#68d391' },
            { num: '1', unit: 'đổi', label: 'Tối đa 1 lần đổi / đơn hàng', color: '#63b3ed' },
          ].map(item => (
            <div key={item.label} style={{ ...sectionStyle, marginBottom: 0, textAlign: 'center', padding: '24px 20px' }}>
              <div style={{ fontSize: '36px', fontWeight: 900, color: item.color, lineHeight: 1 }}>{item.num}</div>
              <div style={{ fontSize: '13px', color: '#718096', marginTop: '2px' }}>{item.unit}</div>
              <div style={{ fontSize: '13px', color: '#a0aec0', marginTop: '10px', fontWeight: 600 }}>{item.label}</div>
            </div>
          ))}
        </div>

        {/* Điều kiện */}
        <div style={sectionStyle}>
          <div style={headingStyle}>
            <Icon><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></Icon>
            Điều kiện áp dụng
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {conditions.map((c, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0, marginTop: '1px',
                  background: c.ok ? 'rgba(104,211,145,0.15)' : 'rgba(252,129,129,0.12)',
                  border: `1px solid ${c.ok ? 'rgba(104,211,145,0.3)' : 'rgba(252,129,129,0.3)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', color: c.ok ? '#68d391' : '#fc8181'
                }}>
                  {c.ok ? '✓' : '✕'}
                </div>
                <span style={{ ...textStyle, color: c.ok ? '#a0aec0' : '#718096' }}>{c.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quy trình */}
        <div style={sectionStyle}>
          <div style={headingStyle}>
            <Icon><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/></Icon>
            Quy trình đổi trả
          </div>
          <div style={{ position: 'relative', paddingLeft: '28px' }}>
            <div style={{ position: 'absolute', left: '9px', top: '8px', bottom: '8px', width: '2px', background: 'rgba(246,173,85,0.15)' }} />
            {[
              { title: 'Bước 1 — Liên hệ TruongMobile', desc: 'Gọi hotline 0901 234 567 hoặc chat trực tuyến trong vòng 30 ngày kể từ ngày nhận hàng. Cung cấp mã đơn hàng và mô tả vấn đề.' },
              { title: 'Bước 2 — Xác nhận yêu cầu', desc: 'Nhân viên hỗ trợ xem xét và xác nhận yêu cầu trong 1–2 giờ làm việc. Trường hợp cần kiểm tra, bạn có thể gửi video/ảnh mô tả lỗi.' },
              { title: 'Bước 3 — Gửi sản phẩm về', desc: 'TruongMobile hỗ trợ 1 chiều phí ship thu hồi. Đóng gói sản phẩm cẩn thận kèm đầy đủ phụ kiện và hộp gốc.' },
              { title: 'Bước 4 — Kiểm tra & xử lý', desc: 'Sau khi nhận hàng, TruongMobile kiểm tra trong 1–3 ngày làm việc. Nếu đủ điều kiện, tiến hành đổi sản phẩm mới hoặc hoàn tiền.' },
              { title: 'Bước 5 — Nhận hàng mới / hoàn tiền', desc: 'Sản phẩm mới được giao miễn phí. Hoàn tiền xử lý trong 3–5 ngày làm việc qua phương thức thanh toán ban đầu.' },
            ].map((s, i) => (
              <div key={i} style={{ position: 'relative', marginBottom: '20px', paddingBottom: '4px' }}>
                <div style={{
                  position: 'absolute', left: '-24px', top: '2px',
                  width: '18px', height: '18px', borderRadius: '50%',
                  background: '#f6ad55', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '10px', fontWeight: 800, color: '#111827'
                }}>{i + 1}</div>
                <div style={{ fontWeight: 700, color: '#e2e8f0', fontSize: '14px', marginBottom: '5px' }}>{s.title}</div>
                <div style={textStyle}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Hoàn tiền */}
        <div style={sectionStyle}>
          <div style={headingStyle}>
            <Icon><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></Icon>
            Chính sách hoàn tiền
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px', color: '#a0aec0' }}>
              <thead>
                <tr>
                  <th style={{ padding: '11px 14px', background: 'rgba(246,173,85,0.08)', color: '#f6ad55', fontWeight: 700, textAlign: 'left', borderBottom: '1px solid rgba(246,173,85,0.15)' }}>Hình thức thanh toán</th>
                  <th style={{ padding: '11px 14px', background: 'rgba(246,173,85,0.08)', color: '#f6ad55', fontWeight: 700, textAlign: 'left', borderBottom: '1px solid rgba(246,173,85,0.15)' }}>Thời gian hoàn tiền</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Tiền mặt (COD)', '1–2 ngày làm việc (chuyển khoản lại)'],
                  ['Thẻ ngân hàng (ATM/Visa/Master)', '3–7 ngày làm việc'],
                  ['Ví điện tử (Momo, ZaloPay)', '1–3 ngày làm việc'],
                  ['Chuyển khoản ngân hàng', '1–3 ngày làm việc'],
                ].map(([method, time], i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                    <td style={{ padding: '11px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#e2e8f0', fontWeight: 600 }}>{method}</td>
                    <td style={{ padding: '11px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <p style={{ fontSize: '13.5px', color: '#718096', marginBottom: '14px' }}>Cần hỗ trợ về đổi trả?</p>
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
