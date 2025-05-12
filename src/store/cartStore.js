import { create } from 'zustand';

const useCartStore = create((set) => ({
  cartItems: [],
  addToCart: (item) => set((state) => {
    const existingItem = state.cartItems.find((i) => i.id === item.id);
    if (existingItem) {
      return {
        cartItems: state.cartItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        ),
      };
    }
    return { cartItems: [...state.cartItems, { ...item, quantity: 1 }] };
  }),
  removeFromCart: (itemId) => set((state) => ({
    cartItems: state.cartItems.filter((item) => item.id !== itemId),
  })),
  updateQuantity: (itemId, quantity) => set((state) => ({
    cartItems: state.cartItems.map((item) =>
      item.id === itemId ? { ...item, quantity: Math.max(1, quantity) } : item
    ),
  })),
}));

export default useCartStore;