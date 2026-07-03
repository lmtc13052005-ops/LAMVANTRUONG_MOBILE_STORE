import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useApi, imgUrl } from '../hooks/useApi';

// Slide tĩnh dùng làm fallback khi API chưa có dữ liệu
const FALLBACK_SLIDES = [
  {
    id: 0,
    title: 'TruongMobile',
    subtitle: 'Thiết bị điện tử chính hãng — Giá tốt nhất',
    category: 'KHAI TRƯƠNG',
    imageUrl: null,
    bg: 'linear-gradient(135deg, #0f1923 0%, #1a2d40 60%, #0d1520 100%)',
    link: '/shop',
  },
];

function Slide({ slide, index, current }) {
  const bg = slide.imageUrl
    ? `linear-gradient(135deg, rgba(10,15,25,0.82) 0%, rgba(10,15,25,0.6) 100%)`
    : 'linear-gradient(135deg, #0f1923 0%, #1a2d40 60%, #0d1520 100%)';

  return (
    <div style={{
      position: 'absolute', inset: 0,
      opacity: index === current ? 1 : 0,
      transition: 'opacity 0.6s ease',
      pointerEvents: index === current ? 'auto' : 'none',
    }}>
      {/* Background image */}
      {slide.imageUrl && (
        <img
          src={imgUrl(slide.imageUrl)}
          alt={slide.title}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          onError={e => { e.target.style.display = 'none'; }}
        />
      )}

      {/* Overlay gradient */}
      <div style={{ position: 'absolute', inset: 0, background: bg }} />

      {/* Glow accent */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 70% 50%, rgba(246,173,85,0.08) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 1,
        maxWidth: '1380px', margin: '0 auto', padding: '0 80px',
        display: 'flex', alignItems: 'center', height: '100%'
      }}>
        <div style={{ maxWidth: '600px' }}>
          <div style={{
            display: 'inline-block',
            background: '#f6ad55', color: '#111827',
            padding: '5px 14px', borderRadius: '6px',
            fontSize: '12px', fontWeight: 800, letterSpacing: '1px', marginBottom: '22px'
          }}>
            {slide.category || 'BÀI VIẾT'}
          </div>

          <h1 style={{
            fontSize: '46px', fontWeight: 800, color: '#fff',
            lineHeight: 1.15, marginBottom: '16px', letterSpacing: '-0.5px'
          }}>
            {slide.title}
          </h1>

          {slide.subtitle && (
            <p style={{ fontSize: '18px', color: '#a0aec0', marginBottom: '32px', lineHeight: 1.65 }}>
              {slide.subtitle}
            </p>
          )}

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <Link to={slide.link || `/blog/${slide.id}`} style={{
              padding: '14px 34px', background: '#f6ad55', color: '#111827',
              fontWeight: 800, fontSize: '15px', borderRadius: '9px', display: 'inline-block'
            }}>
              {slide.id === 0 ? 'Khám phá ngay' : 'Đọc bài viết'}
            </Link>
            <Link to="/shop" style={{
              padding: '14px 34px', background: 'transparent', color: '#fff',
              fontWeight: 600, fontSize: '15px', borderRadius: '9px',
              border: '2px solid rgba(255,255,255,0.25)', display: 'inline-block'
            }}>
              Cửa hàng
            </Link>
          </div>

          {slide.createdDate && (
            <div style={{ marginTop: '24px', fontSize: '13px', color: '#718096' }}>
              {new Date(slide.createdDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function HeroBanner() {
  const { data: posts } = useApi('/posts/latest');
  const [current, setCurrent] = useState(0);

  const slides = (posts && posts.length > 0)
    ? posts.map(p => ({
        id: p.id,
        title: p.title,
        subtitle: null,
        category: p.category,
        imageUrl: p.imageUrl,
        createdDate: p.createdDate,
        link: `/blog/${p.id}`,
      }))
    : FALLBACK_SLIDES;

  const next = useCallback(() => setCurrent(c => (c + 1) % slides.length), [slides.length]);
  const prev = () => setCurrent(c => (c - 1 + slides.length) % slides.length);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  // Reset khi slides thay đổi (từ fallback sang API data)
  useEffect(() => { setCurrent(0); }, [slides.length]);

  return (
    <div style={{ position: 'relative', height: '460px', overflow: 'hidden', background: '#0f1923' }}>
      {slides.map((slide, i) => (
        <Slide key={slide.id} slide={slide} index={i} current={current} />
      ))}

      {/* Prev / Next */}
      {slides.length > 1 && (
        <>
          <button onClick={prev} className="hero-btn-prev" style={{
            position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
            color: '#fff', width: '46px', height: '46px', borderRadius: '50%',
            cursor: 'pointer', fontSize: '24px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', zIndex: 10, transition: 'background .2s, border-color .2s'
          }}>‹</button>
          <button onClick={next} className="hero-btn-next" style={{
            position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
            color: '#fff', width: '46px', height: '46px', borderRadius: '50%',
            cursor: 'pointer', fontSize: '24px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', zIndex: 10, transition: 'background .2s, border-color .2s'
          }}>›</button>
        </>
      )}

      {/* Dots */}
      <div style={{
        position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: '8px', zIndex: 10
      }}>
        {slides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} style={{
            width: i === current ? '28px' : '8px', height: '8px',
            borderRadius: '4px',
            background: i === current ? '#f6ad55' : 'rgba(255,255,255,0.35)',
            border: 'none', cursor: 'pointer',
            transition: 'all 0.35s ease', padding: 0
          }} />
        ))}
      </div>
    </div>
  );
}
