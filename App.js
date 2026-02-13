import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import PetUploadScreen from './src/screens/PetUploadScreen';
import PetListingScreen from './src/screens/PetListingScreen';
import CartScreen from './src/screens/CartScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="PetListing">
            <Stack.Screen 
              name="PetListing" 
              component={PetListingScreen} 
              options={{ title: 'Pets Available' }}
            />
            <Stack.Screen 
              name="PetUpload" 
              component={PetUploadScreen} 
              options={{ title: 'Add New Pet' }}
            />
            <Stack.Screen 
              name="Cart" 
              component={CartScreen} 
              options={{ title: 'Shopping Cart' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;