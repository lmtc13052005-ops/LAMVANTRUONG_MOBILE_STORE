import HeroBanner from '../components/HeroBanner';
import CategorySection from '../components/CategorySection';
import ProductSection from '../components/ProductSection';

export default function HomePage() {
  return (
    <main>
      {/* HeroBanner: dữ liệu từ /api/posts/latest (tiêu chí #26) */}
      <HeroBanner />

      {/* Danh mục: dữ liệu từ /api/categories/products (tiêu chí #38) */}
      <CategorySection />

      {/* 3 sản phẩm mới nhất (tiêu chí #36) */}
      <ProductSection
        title="Sản phẩm mới nhất"
        apiPath="/products/new?count=3"
        viewAllLink="/shop?sort=newest"
      />

      {/* 3 sản phẩm bán chạy (tiêu chí #37) */}
      <ProductSection
        title="Sản phẩm bán chạy"
        apiPath="/products/hot?count=3"
        viewAllLink="/shop?sort=hot"
      />

      <div style={{ height: '48px' }} />
    </main>
  );
}
