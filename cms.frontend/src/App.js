import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import PostListPage from './pages/PostListPage';
import PostDetailPage from './pages/PostDetailPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ShopPage from './pages/ShopPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import FlashSalePage from './pages/FlashSalePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import GoogleCallbackPage from './pages/GoogleCallbackPage';
import AccountPage from './pages/AccountPage';
import { CartProvider } from './context/CartContext';
import ShippingPage from './pages/support/ShippingPage';
import ReturnPolicyPage from './pages/support/ReturnPolicyPage';
import WarrantyPage from './pages/support/WarrantyPage';
import FAQPage from './pages/support/FAQPage';
import ContactPage from './pages/support/ContactPage';

const AUTH_PATHS = ['/login', '/register', '/forgot-password', '/auth/google/callback'];

const Placeholder = ({ text }) => (
  <div style={{ padding: '80px 28px', maxWidth: '1380px', margin: '0 auto', textAlign: 'center', color: '#718096' }}>
    <div style={{ fontSize: '48px', marginBottom: '14px' }}>🚧</div>
    <div style={{ fontSize: '18px', fontWeight: 600, color: '#1a202c', marginBottom: '8px' }}>{text}</div>
    <div style={{ fontSize: '14px' }}>Tính năng này sẽ được hoàn thiện ở các buổi tiếp theo.</div>
  </div>
);

function Layout() {
  const location = useLocation();
  const isAuth = AUTH_PATHS.includes(location.pathname);
  return (
    <>
      {!isAuth && <Header />}
      <Routes>
        {/* Trang chủ (Buổi 7-8) */}
        <Route path="/" element={<HomePage />} />

        {/* Blog: danh sách + chi tiết (Buổi 8-9 — tiêu chí #25, #27, #44) */}
        <Route path="/blog" element={<PostListPage />} />
        <Route path="/blog/:id" element={<PostDetailPage />} />

        {/* Chi tiết sản phẩm (Buổi 9 — tiêu chí #27) */}
        <Route path="/product/:id" element={<ProductDetailPage />} />

        {/* Cửa hàng (#39, #40, #43) */}
        <Route path="/shop" element={<ShopPage />} />

        {/* Giỏ hàng + Thanh toán (#28, #29, #30) */}
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />

        {/* Tài khoản — Buổi 10 */}
        <Route path="/account" element={<AccountPage />} />
        <Route path="/flash-sale" element={<FlashSalePage />} />

        {/* Auth pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />

        {/* Hỗ trợ */}
        <Route path="/ho-tro/giao-hang" element={<ShippingPage />} />
        <Route path="/ho-tro/doi-tra" element={<ReturnPolicyPage />} />
        <Route path="/ho-tro/bao-hanh" element={<WarrantyPage />} />
        <Route path="/ho-tro/faq" element={<FAQPage />} />
        <Route path="/ho-tro/lien-he" element={<ContactPage />} />

        {/* 404 */}
        <Route path="*" element={
          <div style={{ padding: '80px 28px', textAlign: 'center', color: '#718096' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>404</div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#1a202c' }}>Trang không tồn tại</div>
          </div>
        } />
      </Routes>
      {!isAuth && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Layout />
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
