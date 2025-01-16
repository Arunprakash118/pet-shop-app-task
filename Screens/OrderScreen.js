import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getProductDatas, setProductDatas } from '../Middileware/Middileware';

const OrderScreen = () => {

  const [productData, setProductData] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('https://678895e22c874e66b7d58e7f.mockapi.io/api/v1/menu');
        const productData = await response.json();
        setProductData(productData);
        setProductDatas(productData);
      } catch (error) {
        console.log('API response failed:', error.message);
      }
    };
    fetchMenuItems();
  }, []);

  const renderItem = ({ item, index }) => (
    <View style={styles.itemContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        {item.qty === 0 ? (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => handleAdd(index)}
          >
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.counterContainer}>
            <TouchableOpacity
              style={styles.counterButton}
              onPress={() => decreaseQuantity(index)}
            >
              <Text style={styles.counterButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.qtyText}>{item.qty}</Text>
            <TouchableOpacity
              style={styles.counterButton}
              onPress={() => increaseQuantity(index)}
            >
              <Text style={styles.counterButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <Text>{item.subtitle}</Text>
      <Text>Rs. {item.price}</Text>
    </View>
  );

  const handleAdd = (index) => {
    const updatedProducts = [...productData];
    updatedProducts[index].qty += 1;
    setProductData(updatedProducts);
  };

  const increaseQuantity = (index) => {
    const updatedProducts = [...productData];
    updatedProducts[index].qty += 1;
    setProductData(updatedProducts);
  };

  const decreaseQuantity = (index) => {
    const updatedProducts = [...productData];
    if (updatedProducts[index].qty > 0) {
      updatedProducts[index].qty -= 1;
    }
    setProductData(updatedProducts);
  };

  const getTotalSelectedItems = () => {
    return productData.reduce((total, product) => total + product.qty, 0);
  };

  const navigateToCart = () => {

    setProductDatas(productData);
    navigation.navigate('Cart');
  };

  const bookTable = async () => {

  };

  useFocusEffect(
    React.useCallback(() => {
      const data = getProductDatas();
      setProductData(data);
    }, [])
  );


  return (
    <View style={styles.container}>
      <ScrollView>
        <View>
          <Image
            source={require('../Assets/food_image.jpg')}
            style={styles.image}
          />
        </View>

        <View style={styles.card}>
          <View>
            <Text style={styles.titleText}>Inka Restaurant</Text>
          </View>

          <View style={styles.ratingLayout}>
            <View>
              <Image
                source={require('../Assets/star.png')}
                style={styles.ratingImage}
              />
            </View>
            <Text style={styles.cardText}>5.0 All days: 09:00 AM - 06.00 PM</Text>
          </View>

          <View style={styles.mobileLayout}>
            <View>
              <Image
                source={require('../Assets/mobile.png')}
                style={styles.ratingImage}
              />
            </View>
            <Text style={styles.cardText}>Reach as at: 6383667503</Text>
          </View>

          <View style={styles.bookTableLayout}>
            <TouchableOpacity style={styles.button} onPress={bookTable}>
              <Text style={styles.buttonText}>BOOK A TABLE</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.startTextLayout}>
          <Text style={styles.startText}>
            Starter
          </Text>
        </View>

        <View style={styles.flatListStyle}>
          <FlatList
            data={productData}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ flexGrow: 1 }}
          />
        </View>
      </ScrollView>

      <View style={styles.viewCartLayout}>
        <TouchableOpacity style={styles.viewCartButton} onPress={navigateToCart}>
          <Text style={styles.buttonText}>VIEW CART ({getTotalSelectedItems()} ITEMS)</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 200,
  },
  card: {
    position: 'absolute',
    top: 150,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    alignItems: 'center',
  },
  ratingLayout: {
    flexDirection: 'row'
  },
  mobileLayout: {
    flexDirection: 'row',
    top: 5
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  cardText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  ratingImage: {
    width: 15,
    height: 15,
    top: 3,
    right: 7
  },
  bookTableLayout: {
    marginTop: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'black',
    paddingVertical: 7,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  startTextLayout: {
    marginTop: 155,
  },
  startText: {
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 15
  },
  itemContainer: {
    marginBottom: 20,
    paddingBottom: 10,
  },
  itemTitle: {
    fontSize: 17,
  },
  addButton: {
    backgroundColor: 'black',
    paddingHorizontal: 11,
    paddingVertical: 3,
    borderRadius: 5,
    right: 15
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#daa520',
    borderRadius: 3,
    paddingHorizontal: 5,
    paddingVertical: 1,
    right: 15
  },
  counterButton: {
    marginHorizontal: 10,
    borderRadius: 5,
  },
  counterButtonText: {
    fontSize: 16,
    textAlign: 'center',
  },
  qtyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  flatListStyle: {
    right: 15,
    left: 10,
  },
  viewCartLayout: {
    marginTop: 7,
    marginBottom: 7,
  },
  viewCartButton: {
    backgroundColor: 'black',
    paddingVertical: 11,
    paddingHorizontal: 20,
    width: '100%',
    textAlign: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default OrderScreen;
