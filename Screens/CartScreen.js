import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getProductDatas, setProductDatas } from '../Middileware/Middileware';

const CartScreen = () => {
    const [totalAmount, setTotalAmount] = useState([]);
    const [cartData, setCartData] = useState([]);
    const [visibleItems, setVisibleItems] = useState(2);

    useEffect(() => {
        const data = getProductDatas();
        setCartData(data);
    }, []);

    useEffect(() => {
        const getTotalAmount = async () => {
            const totalAmount = cartData.reduce((total, product) => {
                return total + product.price * product.qty;
            }, 0);
            setTotalAmount(totalAmount);
        };
        getTotalAmount();
    }, [cartData]);

    const handleIncrease = (index) => {
        const updatedData = [...cartData];
        updatedData[index] = {
            ...updatedData[index],
            qty: updatedData[index].qty + 1,
        };
        setCartData(updatedData);
        setProductDatas(updatedData);
    };

    const handleDecrease = (index) => {
        const updatedData = [...cartData];
        if (updatedData[index].qty > 0) {
            updatedData[index] = {
                ...updatedData[index],
                qty: updatedData[index].qty - 1,
            };
            setCartData(updatedData);
            setProductDatas(updatedData);
        }
    };

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
                            onPress={() => handleDecrease(index)}
                        >
                            <Text style={styles.counterButtonText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.qtyText}>{item.qty}</Text>
                        <TouchableOpacity
                            style={styles.counterButton}
                            onPress={() => handleIncrease(index)}
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

    const handleShowMore = () => {
        setVisibleItems(cartData.length);
    };


    return (
        <View style={{ flex: 1 }}>
            <ScrollView>
                <View style={styles.blackView}>
                    <View style={styles.myCartContainer} >
                        <Text style={styles.myCartText}>
                            My Cart
                        </Text>
                    </View>
                    <View style={styles.whiteView}>
                        <Text style={styles.amountText}>Total Cost</Text>
                        <Text style={styles.amount}>Rs. {totalAmount}</Text>
                    </View>
                </View>

                <View>
                    <Text style={styles.reviewOrderTextStle}>
                        Review Orders
                    </Text>
                </View>

                <View style={styles.flatListStyle}>
                    <FlatList
                        data={cartData.filter(item => item.qty !== 0).slice(0, visibleItems)}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        contentContainerStyle={{ flexGrow: 1 }}
                    />
                </View>
                {cartData.filter(item => item.qty > 0).length > 2 && visibleItems < cartData.length && (
                    <View>
                        <TouchableOpacity onPress={handleShowMore}>
                            <Text style={styles.showMoreText}>Show More</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
            <View style={styles.placeOrderLayout}>
                <TouchableOpacity style={styles.placeOrderButton}>
                    <Text style={styles.placeOrderText}>PLACE ORDER</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    viewCartLayout: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    button: {
        backgroundColor: 'blue',
        padding: 15,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    itemContainer: {
        marginBottom: 20,
        paddingBottom: 10,
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
        paddingVertical:1,
        right:15 
    },
    counterButton: {
        marginHorizontal: 10,  
    borderRadius: 5,
    },
    counterButtonText: {
        color: 'black',
        fontSize: 18,
    },
    qtyText: {
        fontSize: 16,
        marginHorizontal: 10,
        right: 5,
    },
    blackView: {
        width: '100%',
        height: 175,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    whiteView: {
        backgroundColor: 'white',
        paddingHorizontal: 33,
        paddingVertical: 10,
        marginTop: 33,
        borderRadius: 10,
    },
    amountText: {
        color: '#daa520',
        fontSize: 17,
    },
    amount: {
        color: 'black',
        fontSize: 19,
        marginTop: 5,
    },
    myCartText: {
        color: 'white',
        fontSize: 19,
        marginTop: 5,
        marginLeft: 10
    },
    myCartContainer: {
        position: 'absolute',
        left: 10,
        top: 5,
    },
    flatListStyle: {
        paddingHorizontal: 10,
        paddingVertical: 15,
    },
    reviewOrderTextStle: {
        left: 10,
        fontSize: 16,
        marginTop: 15,
    },
    placeOrderLayout: {
        marginTop: 7,
        marginBottom: 7,
    },
    placeOrderButton: {
        backgroundColor: 'black',
        paddingVertical: 11,
        paddingHorizontal: 20,
        width: '100%',
        textAlign: 'center',
        alignItems: 'center'
    },
    placeOrderText: {
        color: 'white',
        fontSize: 16,
    },
    showMoreText: {
        color: 'blue',
        textAlign: 'center',
        marginTop: 10,
    },
});

export default CartScreen;
