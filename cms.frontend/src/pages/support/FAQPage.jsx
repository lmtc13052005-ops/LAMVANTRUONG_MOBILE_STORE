import { useState } from 'react';
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

const FAQS = [
  {
    category: 'Đặt hàng & Thanh toán',
    icon: '🛒',
    items: [
      {
        q: 'Tôi có thể đặt hàng bằng những cách nào?',
        a: 'Bạn có thể đặt hàng trực tiếp trên website TruongMobile, hoặc liên hệ hotline 0901 234 567 để được tư vấn và đặt hàng qua điện thoại. Ngoài ra, bạn cũng có thể đến trực tiếp cửa hàng tại 123 Nguyễn Huệ, Q.1, TP.HCM.'
      },
      {
        q: 'TruongMobile chấp nhận những hình thức thanh toán nào?',
        a: 'TruongMobile chấp nhận: Tiền mặt (khi nhận hàng - COD), Chuyển khoản ngân hàng, Thẻ tín dụng/ghi nợ (Visa, Mastercard, JCB), Ví điện tử (Momo, ZaloPay, VNPay), và Trả góp 0% qua thẻ tín dụng một số ngân hàng.'
      },
      {
        q: 'Đơn hàng của tôi có thể hủy sau khi đặt không?',
        a: 'Bạn có thể hủy đơn hàng trong vòng 2 giờ sau khi đặt (trước khi đơn chuyển sang trạng thái "Đang xử lý"). Sau thời gian này, vui lòng liên hệ hotline để được hỗ trợ.'
      },
      {
        q: 'Tôi có thể đặt hàng trả góp không?',
        a: 'Có. TruongMobile hỗ trợ trả góp 0% qua thẻ tín dụng của Vietcombank, Techcombank, VPBank, BIDV cho đơn hàng từ 3.000.000đ trở lên. Kỳ hạn từ 3–24 tháng.'
      },
    ]
  },
  {
    category: 'Giao hàng & Vận chuyển',
    icon: '🚚',
    items: [
      {
        q: 'TruongMobile giao hàng những tỉnh thành nào?',
        a: 'TruongMobile giao hàng toàn quốc 63 tỉnh thành. Đối tác vận chuyển bao gồm: GHN, GHTK, VNPost và J&T Express.'
      },
      {
        q: 'Làm sao để theo dõi đơn hàng của tôi?',
        a: 'Sau khi đơn hàng được giao cho đơn vị vận chuyển, bạn sẽ nhận được email/SMS chứa mã vận đơn. Bạn có thể tra cứu trực tiếp trên website của đơn vị vận chuyển hoặc trong mục "Đơn hàng của tôi" trên tài khoản.'
      },
      {
        q: 'Phí giao hàng được tính như thế nào?',
        a: 'Miễn phí giao hàng tiêu chuẩn cho đơn từ 500.000đ. Đơn dưới mức này phí 30.000đ. Giao nhanh Express phí 50.000đ (miễn phí đơn từ 2.000.000đ). Giao trong ngày phí 80.000đ.'
      },
    ]
  },
  {
    category: 'Sản phẩm & Bảo hành',
    icon: '📱',
    items: [
      {
        q: 'Sản phẩm tại TruongMobile có chính hãng không?',
        a: 'TruongMobile cam kết 100% sản phẩm chính hãng, có hóa đơn VAT và phiếu bảo hành chính thức từ nhà sản xuất. Chúng tôi là đại lý ủy quyền của Apple, Samsung, Xiaomi, Oppo và nhiều thương hiệu lớn.'
      },
      {
        q: 'Tôi phải làm gì nếu sản phẩm gặp lỗi ngay khi nhận hàng?',
        a: 'Trong vòng 30 ngày kể từ ngày nhận hàng, nếu sản phẩm bị lỗi kỹ thuật, bạn được đổi sản phẩm mới cùng loại (chính sách 1 đổi 1). Liên hệ ngay hotline 0901 234 567 để được hỗ trợ.'
      },
      {
        q: 'Bảo hành có bao gồm màn hình vỡ do va đập không?',
        a: 'Không. Bảo hành chỉ áp dụng cho lỗi kỹ thuật từ nhà sản xuất. Vỡ màn hình, trầy xước, hư hỏng do tác động ngoại lực không được bảo hành. Bạn có thể mua bảo hiểm thiết bị điện tử để được bảo vệ toàn diện hơn.'
      },
      {
        q: 'Tôi có thể kiểm tra hàng trước khi thanh toán không?',
        a: 'Hoàn toàn có thể. TruongMobile khuyến khích bạn kiểm tra kỹ sản phẩm trước khi thanh toán cho shipper. Nếu phát hiện bất kỳ vấn đề nào, hãy từ chối nhận và liên hệ với chúng tôi ngay lập tức.'
      },
    ]
  },
  {
    category: 'Tài khoản & Chương trình ưu đãi',
    icon: '👤',
    items: [
      {
        q: 'Đăng ký tài khoản có lợi ích gì?',
        a: 'Thành viên TruongMobile được hưởng: Tích lũy điểm thưởng mỗi lần mua hàng, nhận ưu đãi sinh nhật 10%, theo dõi đơn hàng dễ dàng, lưu địa chỉ giao hàng và nhận thông báo khuyến mãi độc quyền.'
      },
      {
        q: 'Tôi quên mật khẩu thì phải làm thế nào?',
        a: 'Bạn có thể vào trang "Quên mật khẩu" trên website, điền đầy đủ thông tin và gửi yêu cầu. Admin sẽ xem xét và cập nhật mật khẩu mới cho bạn trong vòng 1–2 giờ làm việc.'
      },
    ]
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      border: '1px solid rgba(246,173,85,0.12)',
      borderRadius: '10px',
      overflow: 'hidden',
      transition: 'border-color .2s',
      borderColor: open ? 'rgba(246,173,85,0.3)' : 'rgba(246,173,85,0.12)',
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', textAlign: 'left', padding: '15px 18px',
          background: open ? 'rgba(246,173,85,0.07)' : 'rgba(255,255,255,0.02)',
          border: 'none', cursor: 'pointer', color: '#e2e8f0',
          fontSize: '14px', fontWeight: 600,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px',
          transition: 'background .2s'
        }}
      >
        <span>{q}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f6ad55" strokeWidth="2.5" strokeLinecap="round"
          style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform .25s' }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      {open && (
        <div style={{ padding: '14px 18px 16px', fontSize: '13.5px', color: '#a0aec0', lineHeight: 1.8, borderTop: '1px solid rgba(246,173,85,0.1)' }}>
          {a}
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [search, setSearch] = useState('');

  const filtered = FAQS.map(cat => ({
    ...cat,
    items: cat.items.filter(item =>
      !search || item.q.toLowerCase().includes(search.toLowerCase()) || item.a.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(cat => cat.items.length > 0);

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
          <span style={{ color: '#f6ad55' }}>Câu hỏi thường gặp</span>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#fff', margin: '0 0 8px' }}>Câu hỏi thường gặp</h1>
          <p style={{ fontSize: '14px', color: '#718096', marginBottom: '20px' }}>
            Tìm câu trả lời nhanh cho các thắc mắc phổ biến nhất.
          </p>

          {/* Search */}
          <div style={{ position: 'relative' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#718096" strokeWidth="2" strokeLinecap="round"
              style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              placeholder="Tìm kiếm câu hỏi..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '12px 16px 12px 42px', fontSize: '14px',
                background: 'linear-gradient(145deg, #1a2332, #111827)',
                border: '1px solid rgba(246,173,85,0.2)', borderRadius: '10px',
                color: '#e2e8f0', outline: 'none', boxSizing: 'border-box',
                fontFamily: 'inherit', transition: 'border-color .2s'
              }}
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#718096' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</div>
            <div style={{ fontSize: '15px', fontWeight: 600 }}>Không tìm thấy câu hỏi phù hợp</div>
            <div style={{ fontSize: '13px', marginTop: '6px' }}>Hãy thử từ khóa khác hoặc liên hệ trực tiếp với chúng tôi.</div>
          </div>
        ) : (
          filtered.map(cat => (
            <div key={cat.category} style={sectionStyle}>
              <div style={{ ...headingStyle, fontSize: '14px' }}>
                <span style={{ fontSize: '18px' }}>{cat.icon}</span>
                {cat.category}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {cat.items.map(item => <FAQItem key={item.q} {...item} />)}
              </div>
            </div>
          ))
        )}

        {/* Không tìm được câu trả lời */}
        <div style={{ ...sectionStyle, background: 'rgba(246,173,85,0.05)', border: '1px solid rgba(246,173,85,0.2)', textAlign: 'center' }}>
          <div style={{ fontSize: '18px', marginBottom: '8px' }}>💬</div>
          <div style={{ fontWeight: 700, color: '#e2e8f0', fontSize: '15px', marginBottom: '6px' }}>Không tìm thấy câu trả lời?</div>
          <div style={{ fontSize: '13.5px', color: '#718096', marginBottom: '18px' }}>
            Đội ngũ hỗ trợ của TruongMobile sẵn sàng giải đáp mọi thắc mắc cho bạn.
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/ho-tro/lien-he" style={{
              padding: '11px 22px', background: 'linear-gradient(135deg, #f6ad55, #ed8936)',
              color: '#111827', fontWeight: 800, fontSize: '14px',
              borderRadius: '10px', textDecoration: 'none'
            }}>Liên hệ ngay</Link>
            <a href="tel:0901234567" style={{
              padding: '11px 22px', background: 'transparent',
              border: '1px solid rgba(246,173,85,0.3)',
              color: '#f6ad55', fontWeight: 700, fontSize: '14px',
              borderRadius: '10px', textDecoration: 'none'
            }}>0901 234 567</a>
          </div>
        </div>
      </div>
    </main>
  );
}
