import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import PetCard from '../components/PetCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';
import useCartStore from '../store/CartStore';
import usePetStore from '../store/PetStore';
import { fetchRandomDogImage } from '../services/api';

const PetListingScreen = ({ navigation }) => {
  const [toast, setToast] = useState({ visible: false, message: '', type: '' });
  
  const { pets, isLoading, initPets, addRandomPet } = usePetStore();
  const { addToCart, cartItems } = useCartStore();

  useEffect(() => {
    initPets();
    useCartStore.getState().initCart();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      initPets(); 
    });

    return unsubscribe;
  }, [navigation]);

  const handleAddRandomPet = async () => {
    const result = await fetchRandomDogImage();
    
    if (result.success) {
      const randomPetData = {
        name: `Dog ${pets.length + 1}`,
        breed: 'Mixed Breed',
        age: Math.floor(Math.random() * 10) + 1,
        price: Math.floor(Math.random() * 1000) + 500,
        image: result.data,
      };
      
      const addResult = await addRandomPet(randomPetData);
      if (addResult.success) {
        showToast('New random pet added!', 'success');
      }
    } else {
      showToast(result.message, 'error');
    }
  };

  const handleAddToCart = (pet) => {
    addToCart(pet);
    showToast(`${pet.name} added to cart!`, 'success');
  };

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast({ visible: false, message: '', type: '' });
    }, 3000);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('PetUpload')}
      >
        <Icon name="add" size={24} color="#FFF" />
        <Text style={styles.addButtonText}>Add New Pet</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.randomButton}
        onPress={handleAddRandomPet}
        disabled={isLoading}
      >
        <Icon name="casino" size={24} color="#FFF" />
        <Text style={styles.randomButtonText}>Add Random Pet</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cartButton}
        onPress={() => navigation.navigate('Cart')}
      >
        <Icon name="shopping-cart" size={24} color="#3498db" />
        {cartItems.length > 0 && (
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );

  if (isLoading && pets.length === 0) {
    return <LoadingSpinner message="Loading pets..." />;
  }

  return (
    <View style={styles.container}>
      {toast.visible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onHide={() => setToast({ visible: false, message: '', type: '' })}
        />
      )}

      <FlatList
        data={pets}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => (
          <PetCard
            pet={item}
            onAddToCart={handleAddToCart}
            onPress={(pet) => {
              console.log('Pet pressed:', pet);
            }}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="pets" size={80} color="#ccc" />
            <Text style={styles.emptyText}>No pets available</Text>
            <Text style={styles.emptySubText}>Add some pets to get started!</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: '#2ecc71',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    justifyContent: 'center',
  },
  randomButton: {
    backgroundColor: '#e67e22',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#FFF',
    marginLeft: 4,
    fontWeight: '600',
  },
  randomButtonText: {
    color: '#FFF',
    marginLeft: 4,
    fontWeight: '600',
  },
  cartButton: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 8,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#e74c3c',
    borderRadius: 12,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
});

export default PetListingScreen;