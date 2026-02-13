import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const usePetStore = create((set, get) => ({
  pets: [],
  isLoading: false,
  error: null,

  initPets: async () => {
    try {
      set({ isLoading: true });
      const savedPets = await AsyncStorage.getItem('pets');
      
      if (savedPets) {
        set({ pets: JSON.parse(savedPets), isLoading: false });
      } else {
        const initialPets = [
          {
            id: '1',
            name: 'Max',
            breed: 'Golden Retriever',
            age: 2,
            price: 1200,
            image: 'https://images.dog.ceo/breeds/retriever-golden/n02099601_100.jpg',
          },
          {
            id: '2',
            name: 'Bella',
            breed: 'German Shepherd',
            age: 3,
            price: 1500,
            image: 'https://images.dog.ceo/breeds/germanshepherd/n02106662_1331.jpg',
          },
          {
            id: '3',
            name: 'Charlie',
            breed: 'Labrador',
            age: 1,
            price: 1100,
            image: 'https://images.dog.ceo/breeds/labrador/n02099712_3723.jpg',
          },
        ];
        await AsyncStorage.setItem('pets', JSON.stringify(initialPets));
        set({ pets: initialPets, isLoading: false });
      }
    } catch (error) {
      console.error('Failed to load pets:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  addPet: async (petData) => {
    try {
      set({ isLoading: true });
      const newPet = {
        id: Date.now().toString(),
        ...petData,
        createdAt: new Date().toISOString()
      };
      
      const currentPets = get().pets;
      const updatedPets = [newPet, ...currentPets];
      
      await AsyncStorage.setItem('pets', JSON.stringify(updatedPets));
      set({ pets: updatedPets, isLoading: false });
      
      return { success: true, pet: newPet };
    } catch (error) {
      console.error('Failed to add pet:', error);
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  addRandomPet: async (randomPetData) => {
    try {
      set({ isLoading: true });
      const newPet = {
        id: Date.now().toString(),
        ...randomPetData,
        createdAt: new Date().toISOString()
      };
      
      const currentPets = get().pets;
      const updatedPets = [newPet, ...currentPets];
      
      await AsyncStorage.setItem('pets', JSON.stringify(updatedPets));
      set({ pets: updatedPets, isLoading: false });
      
      return { success: true, pet: newPet };
    } catch (error) {
      console.error('Failed to add random pet:', error);
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  clearPets: async () => {
    try {
      await AsyncStorage.removeItem('pets');
      set({ pets: [], isLoading: false });
    } catch (error) {
      console.error('Failed to clear pets:', error);
    }
  },
}));

export default usePetStore;