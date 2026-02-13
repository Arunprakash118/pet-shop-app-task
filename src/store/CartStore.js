import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useCartStore = create((set, get) => ({
  cartItems: [],
  totalPrice: 0,
  isLoading: false,
  error: null,

  initCart: async () => {
    try {
      const savedCart = await AsyncStorage.getItem('cart');
      if (savedCart) {
        const items = JSON.parse(savedCart);
        const total = items.reduce((sum, item) => sum + parseFloat(item.price), 0);
        set({ cartItems: items, totalPrice: total });
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
    }
  },

  addToCart: async (pet) => {
    set((state) => {
      const existingItem = state.cartItems.find(item => item.id === pet.id);
      
      let newCartItems;
      if (existingItem) {
        newCartItems = state.cartItems.map(item =>
          item.id === pet.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      } else {
        newCartItems = [...state.cartItems, { ...pet, quantity: 1 }];
      }
      
      const newTotal = newCartItems.reduce(
        (sum, item) => sum + (parseFloat(item.price) * (item.quantity || 1)), 
        0
      );
      
      AsyncStorage.setItem('cart', JSON.stringify(newCartItems));
      
      return { cartItems: newCartItems, totalPrice: newTotal };
    });
  },

  removeFromCart: async (petId) => {
    set((state) => {
      const newCartItems = state.cartItems.filter(item => item.id !== petId);
      const newTotal = newCartItems.reduce(
        (sum, item) => sum + (parseFloat(item.price) * (item.quantity || 1)), 
        0
      );
      
      AsyncStorage.setItem('cart', JSON.stringify(newCartItems));
      
      return { cartItems: newCartItems, totalPrice: newTotal };
    });
  },

  updateQuantity: async (petId, newQuantity) => {
    set((state) => {
      const newCartItems = state.cartItems.map(item =>
        item.id === petId
          ? { ...item, quantity: Math.max(1, newQuantity) }
          : item
      );
      
      const newTotal = newCartItems.reduce(
        (sum, item) => sum + (parseFloat(item.price) * (item.quantity || 1)), 
        0
      );
      
      AsyncStorage.setItem('cart', JSON.stringify(newCartItems));
      
      return { cartItems: newCartItems, totalPrice: newTotal };
    });
  },

  clearCart: async () => {
    await AsyncStorage.removeItem('cart');
    set({ cartItems: [], totalPrice: 0 });
  },
}));

export default useCartStore;