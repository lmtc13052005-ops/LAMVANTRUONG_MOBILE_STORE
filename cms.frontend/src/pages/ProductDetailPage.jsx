import { useState, useEffect, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useApi, imgUrl, formatPrice } from '../hooks/useApi';
import { useCart } from '../context/CartContext';

const API = process.env.REACT_APP_API_BASE_URL || 'https://localhost:7094/api';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { data: product, loading, error } = useApi(id ? `/products/${id}` : null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [related, setRelated] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedStorage, setSelectedStorage] = useState(null);

  // Sản phẩm liên quan cùng danh mục
  useEffect(() => {
    if (!product?.categoryProductId) return;
    fetch(`${API}/products?categoryId=${product.categoryProductId}&pageSize=4`)
      .then(r => r.json())
      .then(data => setRelated((data.items || []).filter(p => p.id !== product.id).slice(0, 4)))
      .catch(() => {});
  }, [product]);

  // Khi load sản phẩm mới, reset lựa chọn
  useEffect(() => {
    setSelectedColor(null);
    setSelectedStorage(null);
    setQty(1);
  }, [id]);

  // Tính danh sách màu và storage duy nhất từ variants
  const variants = product?.variants || [];
  const hasVariants = variants.length > 0;

  const uniqueColors = useMemo(() => {
    if (!hasVariants) return [];
    const seen = new Set();
    return variants
      .filter(v => v.color)
      .filter(v => { if (seen.has(v.color)) return false; seen.add(v.color); return true; })
      .map(v => ({ color: v.color, colorCode: v.colorCode }));
  }, [variants, hasVariants]);

  // Storages khả dụng dựa theo màu đã chọn
  const availableStorages = useMemo(() => {
    if (!hasVariants) return [];
    const filtered = selectedColor
      ? variants.filter(v => v.color === selectedColor)
      : variants;
    const seen = new Set();
    return filtered
      .filter(v => v.storage)
      .filter(v => { if (seen.has(v.storage)) return false; seen.add(v.storage); return true; })
      .map(v => v.storage);
  }, [variants, selectedColor, hasVariants]);

  // Variant được chọn (khớp màu + storage, hoặc một trong hai nếu variant chỉ có 1 dimension)
  const selectedVariant = useMemo(() => {
    if (!hasVariants) return null;
    return variants.find(v => {
      const colorMatch = !v.color || v.color === selectedColor;
      const storageMatch = !v.storage || v.storage === selectedStorage;
      return colorMatch && storageMatch && (v.color === selectedColor || v.storage === selectedStorage);
    }) || null;
  }, [variants, selectedColor, selectedStorage, hasVariants]);

  if (loading) {
    return (
      <main style={{ background: '#f0f2f5', minHeight: '60vh' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 28px', display: 'flex', gap: '40px' }}>
          <div style={{ width: '460px', flexShrink: 0, aspectRatio: '1', background: '#e8ecf0', borderRadius: '14px' }} />
          <div style={{ flex: 1 }}>
            {[60, 40, 20, 80, 50].map((w, i) => (
              <div key={i} style={{ height: i === 0 ? '36px' : '14px', background: '#e8ecf0', borderRadius: '6px', marginBottom: '18px', width: `${w}%` }} />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main style={{ background: '#f0f2f5', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '60px 28px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>📦</div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#1a202c', marginBottom: '8px' }}>Không tìm thấy sản phẩm</div>
          <Link to="/shop" style={{ display: 'inline-block', marginTop: '16px', padding: '12px 28px', background: '#f6ad55', color: '#111827', borderRadius: '8px', fontWeight: 700, fontSize: '14px' }}>← Quay lại Cửa hàng</Link>
        </div>
      </main>
    );
  }

  // Giá và tồn kho: ưu tiên từ variant được chọn
  const basePrice = Number(product.price);
  const variantPriceAdj = selectedVariant ? Number(selectedVariant.priceAdjust) : 0;
  const price = basePrice + variantPriceAdj;
  const originalPrice = Math.round(basePrice * 1.15) + variantPriceAdj;
  const discountPct = Math.round((1 - price / originalPrice) * 100);
  const stockQty = selectedVariant ? selectedVariant.stockQuantity : product.stockQuantity;
  const inStock = stockQty > 0;
  const src = imgUrl(product.imageUrl);
  const soldCount = (product.id * 47 + 113) % 800 + 100;

  // Cần chọn variant chưa? (nếu có variant nhưng chưa chọn đủ)
  const variantRequired = hasVariants && !selectedVariant;

  // Tên variant hiển thị khi thêm vào giỏ
  const variantLabel = [selectedColor, selectedStorage].filter(Boolean).join(' / ');

  const handleAddToCart = () => {
    if (variantRequired) return;
    const cartProduct = {
      ...product,
      price,
      stockQuantity: stockQty,
      variantLabel,
      variantId: selectedVariant?.id,
    };
    addItem(cartProduct, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const handleBuyNow = () => {
    if (variantRequired) return;
    const cartProduct = {
      ...product,
      price,
      stockQuantity: stockQty,
      variantLabel,
      variantId: selectedVariant?.id,
    };
    addItem(cartProduct, qty);
    navigate('/checkout');
  };

  return (
    <main style={{ background: '#f0f2f5', minHeight: '60vh' }}>
      {/* Breadcrumb */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '11px 28px', display: 'flex', alignItems: 'center', gap: '7px', fontSize: '13px', color: '#718096' }}>
          <Link to="/" className="nav-link" style={{ color: '#718096' }}>Trang chủ</Link>
          <span>›</span>
          <Link to="/shop" className="nav-link" style={{ color: '#718096' }}>Cửa hàng</Link>
          {product.category && (
            <>
              <span>›</span>
              <Link to={`/shop?categoryId=${product.categoryProductId}`} className="nav-link" style={{ color: '#718096' }}>{product.category}</Link>
            </>
          )}
          <span>›</span>
          <span style={{ color: '#1a202c', fontWeight: 600 }}>
            {product.name.length > 40 ? product.name.substring(0, 40) + '…' : product.name}
          </span>
        </div>
      </div>

      {/* Main detail */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '28px 28px 0' }}>
        <div style={{ background: '#fff', borderRadius: '14px', padding: '28px', boxShadow: '0 2px 16px rgba(0,0,0,.08)', display: 'flex', gap: '36px', alignItems: 'flex-start' }}>

          {/* ===== ẢNH — zoom khi hover ===== */}
          <div style={{ width: '440px', flexShrink: 0 }}>
            <div
              style={{
                position: 'relative', borderRadius: '12px', overflow: 'hidden',
                aspectRatio: '1', background: '#f7f9fc', cursor: zoomed ? 'zoom-out' : 'zoom-in',
                border: '1px solid #f0f2f5'
              }}
              onMouseEnter={() => setZoomed(true)}
              onMouseLeave={() => setZoomed(false)}
            >
              {src ? (
                <img src={src} alt={product.name}
                  style={{
                    width: '100%', height: '100%', objectFit: 'contain',
                    transition: 'transform .4s cubic-bezier(.25,.8,.25,1)',
                    transform: zoomed ? 'scale(1.35)' : 'scale(1)'
                  }}
                  onError={e => { e.target.style.display = 'none'; }}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px', color: '#a0aec0' }}>
                  <span style={{ fontSize: '56px' }}>📦</span>
                  <span style={{ fontSize: '13px' }}>Chưa có ảnh</span>
                </div>
              )}
              {src && !zoomed && (
                <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,.45)', color: '#fff', fontSize: '11px', padding: '4px 9px', borderRadius: '5px', pointerEvents: 'none' }}>
                  🔍 Di chuột để phóng to
                </div>
              )}
            </div>

            {/* Thumbnails (UI only) */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              {[0, 1, 2, 3].map(i => (
                <div key={i} style={{ width: '70px', height: '70px', borderRadius: '8px', overflow: 'hidden', border: i === 0 ? '2px solid #f6ad55' : '2px solid #e2e8f0', background: '#f7f9fc', cursor: 'pointer', flexShrink: 0 }}>
                  {i === 0 && src && <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                </div>
              ))}
            </div>
          </div>

          {/* ===== THÔNG TIN SẢN PHẨM ===== */}
          <div style={{ flex: 1 }}>
            {/* Category + Hot */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', color: '#f6ad55', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.7px' }}>{product.category}</span>
              {product.isHot && <span style={{ background: '#f6ad55', color: '#111827', fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '5px' }}>HOT</span>}
            </div>

            <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#1a202c', lineHeight: 1.35, marginBottom: '10px' }}>{product.name}</h1>

            {/* Rating + sold */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '18px', paddingBottom: '18px', borderBottom: '1px solid #f0f2f5' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ color: '#f6ad55', fontSize: '15px' }}>★★★★★</span>
                <span style={{ fontSize: '13px', color: '#f6ad55', fontWeight: 700, borderBottom: '1px solid #f6ad55' }}>4.8</span>
              </div>
              <div style={{ width: '1px', height: '16px', background: '#e2e8f0' }} />
              <span style={{ fontSize: '13px', color: '#4a5568' }}><strong style={{ color: '#1a202c' }}>1.243</strong> đánh giá</span>
              <div style={{ width: '1px', height: '16px', background: '#e2e8f0' }} />
              <span style={{ fontSize: '13px', color: '#4a5568' }}>Đã bán <strong style={{ color: '#1a202c' }}>{soldCount.toLocaleString('vi-VN')}</strong></span>
            </div>

            {/* Price */}
            <div style={{ background: 'linear-gradient(135deg, #fef3e8, #fff9f2)', borderRadius: '10px', padding: '18px 20px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px' }}>
                <span style={{ fontSize: '34px', fontWeight: 900, color: '#e53e3e' }}>{formatPrice(price)}</span>
                <span style={{ fontSize: '16px', color: '#a0aec0', textDecoration: 'line-through' }}>{formatPrice(originalPrice)}</span>
                <span style={{ background: '#e53e3e', color: '#fff', fontSize: '13px', fontWeight: 700, padding: '4px 10px', borderRadius: '5px' }}>-{discountPct}%</span>
              </div>
              <div style={{ fontSize: '13px', color: '#38a169', fontWeight: 600, marginTop: '6px' }}>
                Tiết kiệm {formatPrice(originalPrice - price)} · Giá đã bao gồm VAT
              </div>
            </div>

            {/* ===== VARIANT SELECTOR ===== */}
            {hasVariants && (
              <div style={{ marginBottom: '18px', paddingBottom: '18px', borderBottom: '1px solid #f0f2f5' }}>
                {/* Chọn màu */}
                {uniqueColors.length > 0 && (
                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#4a5568', marginBottom: '9px' }}>
                      Màu sắc: <span style={{ color: '#1a202c', fontWeight: 700 }}>{selectedColor || 'Chưa chọn'}</span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '9px' }}>
                      {uniqueColors.map(({ color, colorCode }) => {
                        const active = selectedColor === color;
                        return (
                          <button key={color} onClick={() => {
                            setSelectedColor(active ? null : color);
                            setSelectedStorage(null);
                          }} style={{
                            display: 'flex', alignItems: 'center', gap: '7px',
                            padding: '7px 14px', borderRadius: '22px', cursor: 'pointer',
                            border: `2px solid ${active ? '#f6ad55' : '#e2e8f0'}`,
                            background: active ? '#fff8ee' : '#fff',
                            fontWeight: active ? 700 : 500,
                            fontSize: '13px', color: '#1a202c',
                            transition: 'all .18s'
                          }}>
                            {colorCode && (
                              <span style={{ width: '16px', height: '16px', borderRadius: '50%', background: colorCode, border: '1px solid rgba(0,0,0,.15)', flexShrink: 0 }} />
                            )}
                            {color}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Chọn storage/RAM */}
                {availableStorages.length > 0 && (
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#4a5568', marginBottom: '9px' }}>
                      Phiên bản: <span style={{ color: '#1a202c', fontWeight: 700 }}>{selectedStorage || 'Chưa chọn'}</span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '9px' }}>
                      {availableStorages.map(storage => {
                        const active = selectedStorage === storage;
                        return (
                          <button key={storage} onClick={() => setSelectedStorage(active ? null : storage)} style={{
                            padding: '7px 16px', borderRadius: '8px', cursor: 'pointer',
                            border: `2px solid ${active ? '#f6ad55' : '#e2e8f0'}`,
                            background: active ? '#fff8ee' : '#fff',
                            fontWeight: active ? 700 : 500,
                            fontSize: '13px', color: '#1a202c',
                            transition: 'all .18s'
                          }}>
                            {storage}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Nhắc nhở chọn */}
                {variantRequired && (
                  <div style={{ marginTop: '10px', fontSize: '12.5px', color: '#e53e3e', fontWeight: 600 }}>
                    ⚠ Vui lòng chọn {uniqueColors.length > 0 && !selectedColor ? 'màu sắc' : ''}{uniqueColors.length > 0 && !selectedColor && availableStorages.length > 0 ? ' và ' : ''}{availableStorages.length > 0 && !selectedStorage ? 'phiên bản' : ''} trước khi thêm vào giỏ.
                  </div>
                )}
              </div>
            )}

            {/* Stock */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: inStock ? '#38a169' : '#e53e3e', flexShrink: 0 }} />
              <span style={{ fontSize: '14px', fontWeight: 600, color: inStock ? '#38a169' : '#e53e3e' }}>
                {inStock ? `Còn hàng — ${stockQty} sản phẩm` : 'Hết hàng'}
              </span>
            </div>

            {/* Số lượng + Buttons */}
            {inStock ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
                  <span style={{ fontSize: '13.5px', color: '#718096', minWidth: '70px' }}>Số lượng</span>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: '9px', overflow: 'hidden' }}>
                    <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: '40px', height: '44px', background: '#f0f2f5', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#1a202c' }}>−</button>
                    <span style={{ width: '52px', textAlign: 'center', fontSize: '16px', fontWeight: 700 }}>{qty}</span>
                    <button onClick={() => setQty(q => Math.min(stockQty, q + 1))} style={{ width: '40px', height: '44px', background: '#f0f2f5', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#1a202c' }}>+</button>
                  </div>
                  <span style={{ fontSize: '13px', color: '#a0aec0' }}>{stockQty} sản phẩm có sẵn</span>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                  <button onClick={handleAddToCart} disabled={variantRequired} style={{
                    flex: 1, padding: '14px',
                    background: added ? '#38a169' : variantRequired ? '#e2e8f0' : 'rgba(246,173,85,0.1)',
                    color: added ? '#fff' : variantRequired ? '#a0aec0' : '#f6ad55',
                    border: `1.5px solid ${added ? '#38a169' : variantRequired ? '#e2e8f0' : '#f6ad55'}`,
                    fontWeight: 800, fontSize: '15px', borderRadius: '9px',
                    cursor: variantRequired ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '9px', transition: 'all .25s'
                  }}>
                    {added ? '✓ Đã thêm vào giỏ' : (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                        Thêm vào giỏ
                      </>
                    )}
                  </button>

                  <button onClick={handleBuyNow} disabled={variantRequired} style={{
                    flex: 1, padding: '14px',
                    background: variantRequired ? '#e2e8f0' : 'linear-gradient(135deg, #e53e3e, #c62828)',
                    color: variantRequired ? '#a0aec0' : '#fff',
                    border: 'none', fontWeight: 800, fontSize: '15px', borderRadius: '9px',
                    cursor: variantRequired ? 'not-allowed' : 'pointer',
                    boxShadow: variantRequired ? 'none' : '0 4px 16px rgba(229,62,62,.35)', transition: 'all .2s'
                  }}>
                    ⚡ Mua ngay
                  </button>
                </div>
              </>
            ) : (
              <div style={{ padding: '16px 18px', background: 'rgba(229,62,62,0.06)', border: '1px solid rgba(229,62,62,0.2)', borderRadius: '9px', color: '#e53e3e', fontSize: '14px', fontWeight: 600, marginBottom: '20px' }}>
                ⚠️ Sản phẩm này hiện đã hết hàng.
              </div>
            )}

            {/* Trust badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', paddingTop: '18px', borderTop: '1px solid #f0f2f5' }}>
              {[
                { icon: '🛡️', text: 'Bảo hành 12 tháng' },
                { icon: '🔄', text: 'Đổi trả 30 ngày' },
                { icon: '🚚', text: 'Giao hàng miễn phí' },
                { icon: '✅', text: 'Hàng chính hãng' },
              ].map(b => (
                <div key={b.text} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: '#4a5568', fontWeight: 500 }}>
                  <span>{b.icon}</span>{b.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mô tả */}
        {product.description && (
          <div style={{ background: '#fff', borderRadius: '14px', padding: '28px 36px', boxShadow: '0 2px 16px rgba(0,0,0,.08)', marginTop: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#1a202c', marginBottom: '20px', marginTop: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '4px', height: '22px', background: '#f6ad55', borderRadius: '2px' }} />
              Mô tả sản phẩm
            </h2>
            <div className="ck-content" dangerouslySetInnerHTML={{ __html: product.description }} style={{ fontSize: '15px', lineHeight: 1.85, color: '#2d3748' }} />
          </div>
        )}

        {/* Sản phẩm liên quan */}
        {related.length > 0 && (
          <div style={{ marginTop: '24px', marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '4px', height: '24px', background: '#f6ad55', borderRadius: '2px' }} />
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#1a202c', margin: 0 }}>Sản phẩm liên quan</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
              {related.map(p => {
                const rPrice = Number(p.price);
                const rSrc = imgUrl(p.imageUrl);
                return (
                  <Link key={p.id} to={`/product/${p.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,.07)', transition: 'transform .2s', cursor: 'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                      onMouseLeave={e => e.currentTarget.style.transform = ''}>
                      <div style={{ aspectRatio: '1', overflow: 'hidden', background: '#f7f9fc' }}>
                        {rSrc ? <img src={rSrc} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .35s' }} onError={e => { e.target.style.display = 'none'; }} />
                          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5', fontSize: '36px' }}>📦</div>
                        }
                      </div>
                      <div style={{ padding: '12px' }}>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#1a202c', marginBottom: '6px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '40px' }}>{p.name}</div>
                        <div style={{ fontSize: '15px', fontWeight: 800, color: '#1a202c' }}>{formatPrice(rPrice)}</div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
