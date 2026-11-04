import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { MOCK_MEDICINES } from '../data/mockData';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const farmerId = user?.id || 'usr-farmer-01';

  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem(`cropcare_cart_${farmerId}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return [
      { medicine: MOCK_MEDICINES[0], quantity: 2 },
      { medicine: MOCK_MEDICINES[1], quantity: 1 }
    ];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Sync with Backend for current farmer
  const fetchCartFromBackend = useCallback(async () => {
    if (!farmerId) return;
    setLoading(true);
    try {
      const data = await api.cart.get(farmerId);
      if (data && data.items) {
        setCartItems(data.items);
      }
    } catch (err) {
      console.warn('Backend cart fetch failed, using local cart:', err.message);
    } finally {
      setLoading(false);
    }
  }, [farmerId]);

  useEffect(() => {
    fetchCartFromBackend();
  }, [fetchCartFromBackend]);

  useEffect(() => {
    localStorage.setItem(`cropcare_cart_${farmerId}`, JSON.stringify(cartItems));
  }, [cartItems, farmerId]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const addToCart = async (medicine, qty = 1) => {
    // Optimistic UI update
    setCartItems(prev => {
      const existing = prev.find(item => item.medicine.id === medicine.id);
      if (existing) {
        return prev.map(item =>
          item.medicine.id === medicine.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { medicine, quantity: qty }];
    });
    showToast(`Added "${medicine.name}" to cart!`);

    // Persist to backend
    try {
      await api.cart.addItem(farmerId, medicine.id, qty);
    } catch (err) {
      console.warn('Could not persist cart addition to server:', err.message);
    }
  };

  const removeFromCart = async (medicineId) => {
    setCartItems(prev => prev.filter(item => item.medicine.id !== medicineId));
    showToast('Item removed from cart');

    try {
      await api.cart.removeItem(farmerId, medicineId);
    } catch (err) {
      console.warn('Could not persist item removal to server:', err.message);
    }
  };

  const updateQuantity = async (medicineId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(medicineId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.medicine.id === medicineId ? { ...item, quantity: newQty } : item
      )
    );

    try {
      await api.cart.updateQuantity(farmerId, medicineId, newQty);
    } catch (err) {
      console.warn('Could not persist quantity update to server:', err.message);
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    try {
      await api.cart.clear(farmerId);
    } catch (err) {
      console.warn('Could not clear server cart:', err.message);
    }
  };

  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.medicine?.price || 0) * item.quantity,
    0
  );
  const shipping = subtotal > 799 || subtotal === 0 ? 0 : 60;
  const tax = Math.round(subtotal * 0.05); // 5% GST for bio-agri products
  const total = subtotal + shipping + tax;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        shipping,
        tax,
        total,
        toastMessage,
        loading,
        fetchCartFromBackend
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
