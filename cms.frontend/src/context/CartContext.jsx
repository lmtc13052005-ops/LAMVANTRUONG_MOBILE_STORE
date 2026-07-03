import { createContext, useContext, useState, useEffect } from 'react';

export const CartContext = createContext(null);

function loadFromStorage() {
  try { return JSON.parse(localStorage.getItem('cart') || '[]'); }
  catch { return []; }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadFromStorage);

  // Đồng bộ vào localStorage mỗi khi items thay đổi (#41)
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
    window.dispatchEvent(new Event('cartChanged'));
  }, [items]);

  const addItem = (product, qty = 1) => {
    setItems(prev => {
      const found = prev.find(i => i.id === product.id);
      if (found) {
        return prev.map(i => i.id === product.id
          ? { ...i, quantity: Math.min(i.quantity + qty, product.stockQuantity) }
          : i);
      }
      return [...prev, {
        id: product.id,
        name: product.name,
        price: Number(product.price),
        imageUrl: product.imageUrl,
        stockQuantity: product.stockQuantity,
        category: product.category || '',
        quantity: Math.min(qty, product.stockQuantity)
      }];
    });
  };

  const removeItem = (id) => setItems(prev => prev.filter(i => i.id !== id));

  const updateQty = (id, qty) => {
    if (qty <= 0) { removeItem(id); return; }
    setItems(prev => prev.map(i => i.id === id
      ? { ...i, quantity: Math.min(qty, i.stockQuantity) }
      : i));
  };

  const clearCart = () => setItems([]);

  const count = items.reduce((s, i) => s + i.quantity, 0);
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, count, total }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
