import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'lb_cart';

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  /**
   * addItem — shade-aware
   * The same product in two different shades is treated as two separate cart lines.
   * cartKey = `{productId}__{shadeName}` if a shade is selected, else just `{productId}`.
   */
  const addItem = (product, qty = 1, shade = null) => {
    const cartKey = shade ? `${product._id}__${shade.name}` : product._id;
    setItems(prev => {
      const existing = prev.find(i => i.cartKey === cartKey);
      if (existing) {
        return prev.map(i =>
          i.cartKey === cartKey ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [...prev, { ...product, quantity: qty, cartKey, shade: shade?.name || null }];
    });
  };

  const removeItem = (cartKey) => setItems(prev => prev.filter(i => i.cartKey !== cartKey));

  const updateQty = (cartKey, qty) => {
    if (qty < 1) return removeItem(cartKey);
    setItems(prev => prev.map(i => i.cartKey === cartKey ? { ...i, quantity: qty } : i));
  };

  const clearCart = () => setItems([]);

  const subtotal   = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, subtotal, totalItems }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
