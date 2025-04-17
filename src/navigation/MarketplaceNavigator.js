import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ErrorBoundary from '../components/ErrorBoundary';
import StoreScreen from '../screens/StoreScreen';

const Stack = createStackNavigator();

const MarketplaceNavigator = () => (
  <ErrorBoundary>
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#eee',
        },
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerTintColor: '#333',
      }}
    >
      <Stack.Screen
        name="Store"
        component={StoreScreen}
        options={{ title: 'Boutique' }}
      />
    </Stack.Navigator>
  </ErrorBoundary>
);

export default MarketplaceNavigator;
