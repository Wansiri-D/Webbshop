import { create } from 'zustand';

const useCartStore = create((set, get) => {
  const initialState = {
    cartItems: [],
    totalItems: 0,
    uniqueItemTypes: 0,
    totalPrice: 0,
  };

  // ดีบัก: ตรวจสอบว่า initialState ถูกสร้างถูกต้อง
  console.log('Initial useCartStore state:', initialState);

  return {
    ...initialState,

    addToCart: (item) => set((state) => {
      // ดีบัก: แสดงข้อมูล item ที่ส่งเข้ามา
      console.log('Adding to cart:', item);

      // ตรวจสอบว่า item มี docId หรือไม่
      if (!item.docId) {
        console.error('Item does not have a docId:', item);
        return state; // ไม่เพิ่มสินค้าถ้าไม่มี docId
      }

      const existingItem = state.cartItems.find((i) => i.docId === item.docId);
      let updatedCart;

      if (existingItem) {
        updatedCart = state.cartItems.map((i) =>
          i.docId === item.docId ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        updatedCart = [...state.cartItems, { ...item, quantity: 1 }];
      }

      // ดีบัก: ตรวจสอบ docId ของสินค้าทั้งหมดในตะกร้า
      const docIds = updatedCart.map(i => i.docId);
      console.log('docIds after adding to cart:', docIds);
      const hasDuplicateDocIds = new Set(docIds).size !== docIds.length;
      if (hasDuplicateDocIds) {
        console.warn('Duplicate docIds found after adding to cart:', docIds);
      }

      // คำนวณยอดรวมหลังจากอัพเดต cartItems
      const totalItems = updatedCart.reduce((total, i) => total + i.quantity, 0);
      const uniqueItemTypes = new Set(updatedCart.map(i => i.docId)).size;
      const totalPrice = updatedCart.reduce((total, i) => total + i.price * i.quantity, 0);

      return {
        cartItems: updatedCart,
        totalItems,
        uniqueItemTypes,
        totalPrice,
      };
    }),

    removeFromCart: (itemDocId) => set((state) => {
      const updatedCart = state.cartItems.filter((item) => item.docId !== itemDocId);

      // ดีบัก: ตรวจสอบ docId หลังจากลบสินค้า
      const docIds = updatedCart.map(i => i.docId);
      console.log('docIds after removing from cart:', docIds);

      // คำนวณยอดรวมหลังจากลบสินค้า
      const totalItems = updatedCart.reduce((total, i) => total + i.quantity, 0);
      const uniqueItemTypes = new Set(updatedCart.map(i => i.docId)).size;
      const totalPrice = updatedCart.reduce((total, i) => total + i.price * i.quantity, 0);

      return {
        cartItems: updatedCart,
        totalItems,
        uniqueItemTypes,
        totalPrice,
      };
    }),

    updateQuantity: (itemDocId, quantity) => set((state) => {
      const updatedCart = state.cartItems.map((item) =>
        item.docId === itemDocId ? { ...item, quantity: Math.max(1, quantity) } : item
      );

      // ดีบัก: ตรวจสอบ docId หลังจากอัพเดต quantity
      const docIds = updatedCart.map(i => i.docId);
      console.log('docIds after updating quantity:', docIds);

      // คำนวณยอดรวมหลังจากอัพเดต quantity
      const totalItems = updatedCart.reduce((total, i) => total + i.quantity, 0);
      const uniqueItemTypes = new Set(updatedCart.map(i => i.docId)).size;
      const totalPrice = updatedCart.reduce((total, i) => total + i.price * i.quantity, 0);

      return {
        cartItems: updatedCart,
        totalItems,
        uniqueItemTypes,
        totalPrice,
      };
    }),

    clearCart: () => set(() => ({
      cartItems: [],
      totalItems: 0,
      uniqueItemTypes: 0,
      totalPrice: 0,
    })),
  };
});

export default useCartStore;