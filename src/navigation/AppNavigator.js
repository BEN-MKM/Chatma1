import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { TransitionPresets } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';  // Correction du chemin d'importation

// Écrans d'authentification
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';

// Écrans principaux
import ChatListScreen from '../screens/ChatListScreen';
import ChatRoomScreen from '../screens/ChatRoomScreen';
import FeedScreen from '../screens/FeedScreen';
import MarketScreen from '../screens/MarketScreen';
import MyShopScreen from '../screens/MyShopScreen';
import AddProductScreen from '../screens/AddProductScreen';
import EditProductScreen from '../screens/EditProductScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import CartScreen from '../screens/CartScreen';
import MarketChatScreen from '../screens/MarketChatScreen';
import BecomeSellerScreen from '../screens/BecomeSellerScreen';

// Écrans du profil
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import GeneralSettingsScreen from '../screens/GeneralSettingsScreen';
import ChatmaPayScreen from '../screens/ChatmaPayScreen';
import SettingsScreen from '../screens/SettingsScreen';
import BlockedUsersScreen from '../screens/BlockedUsersScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import GlobalSearchScreen from '../screens/GlobalSearchScreen';
import PaymentScreen from '../screens/PaymentScreen';
import StatsScreen from '../screens/StatsScreen';
import AddPaymentMethodScreen from '../screens/AddPaymentMethodScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Stack de navigation pour le chat
const ChatStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen 
      name="ChatList" 
      component={ChatListScreen}
      options={{
        headerShown: true,
        title: 'Messages',
        headerStyle: {
          backgroundColor: '#fff',
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    />
    <Stack.Screen name="ChatRoom" component={ChatRoomScreen} />
  </Stack.Navigator>
);

// Stack de navigation pour le feed
const FeedStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Feed" component={FeedScreen} />
  </Stack.Navigator>
);

// Stack de navigation pour le marché
const MarketStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      ...TransitionPresets.SlideFromRightIOS,
    }}
  >
    <Stack.Screen name="Market" component={MarketScreen} />
    <Stack.Screen 
      name="MyShop" 
      component={MyShopScreen}
      options={{
        headerShown: true,
        title: 'Ma Boutique',
        headerStyle: {
          backgroundColor: '#fff',
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    />
    <Stack.Screen 
      name="AddProduct" 
      component={AddProductScreen}
      options={{
        headerShown: true,
        title: 'Ajouter un produit',
        headerStyle: {
          backgroundColor: '#fff',
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    />
    <Stack.Screen 
      name="EditProduct" 
      component={EditProductScreen}
      options={{
        headerShown: true,
        title: 'Modifier le produit',
        headerStyle: {
          backgroundColor: '#fff',
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    />
    <Stack.Screen 
      name="ProductDetails" 
      component={ProductDetailsScreen}
      options={{
        headerShown: true,
        title: 'Détails du produit',
        headerStyle: {
          backgroundColor: '#fff',
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    />
    <Stack.Screen 
      name="Cart" 
      component={CartScreen}
      options={{
        headerShown: true,
        title: 'Panier',
        headerStyle: {
          backgroundColor: '#fff',
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    />
    <Stack.Screen 
      name="MarketChat" 
      component={MarketChatScreen}
      options={{
        headerShown: true,
        title: 'Discussion',
        headerStyle: {
          backgroundColor: '#fff',
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    />
    <Stack.Screen 
      name="BecomeSeller" 
      component={BecomeSellerScreen}
      options={{
        headerShown: true,
        title: 'Devenir vendeur',
        headerStyle: {
          backgroundColor: '#fff',
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    />
  </Stack.Navigator>
);

// Stack de navigation pour le profil
const ProfileStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      ...TransitionPresets.SlideFromRightIOS,
    }}
  >
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen
      name="EditProfile"
      component={EditProfileScreen}
      options={{
        headerShown: true,
        title: 'Modifier le profil',
        headerStyle: {
          backgroundColor: '#fff',
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    />
    <Stack.Screen
      name="Settings"
      component={SettingsScreen}
      options={{
        headerShown: true,
        title: 'Paramètres',
        headerStyle: {
          backgroundColor: '#fff',
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    />
    <Stack.Screen
      name="GeneralSettings"
      component={GeneralSettingsScreen}
      options={{
        headerShown: true,
        title: 'Paramètres généraux',
        headerStyle: {
          backgroundColor: '#fff',
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    />
    <Stack.Screen
      name="ChatmaPay"
      component={ChatmaPayScreen}
      options={{
        headerShown: true,
        title: 'ChatMa Pay',
        headerStyle: {
          backgroundColor: '#fff',
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    />
    <Stack.Screen
      name="BlockedUsers"
      component={BlockedUsersScreen}
      options={{
        headerShown: true,
        title: 'Utilisateurs bloqués',
        headerStyle: {
          backgroundColor: '#fff',
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    />
    <Stack.Screen
      name="Notifications"
      component={NotificationsScreen}
      options={{
        headerShown: true,
        title: 'Notifications',
        headerStyle: {
          backgroundColor: '#fff',
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    />
    <Stack.Screen
      name="GlobalSearch"
      component={GlobalSearchScreen}
      options={{
        headerShown: true,
        title: 'Recherche',
        headerStyle: {
          backgroundColor: '#fff',
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    />
    <Stack.Screen
      name="Payment"
      component={PaymentScreen}
      options={{
        headerShown: true,
        title: 'Paiement',
        headerStyle: {
          backgroundColor: '#fff',
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    />
    <Stack.Screen
      name="AddPaymentMethod"
      component={AddPaymentMethodScreen}
      options={{
        headerShown: true,
        title: 'Ajouter une méthode de paiement',
        headerStyle: {
          backgroundColor: '#fff',
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    />
    <Stack.Screen
      name="Stats"
      component={StatsScreen}
      options={{
        headerShown: true,
        title: 'Statistiques',
        headerStyle: {
          backgroundColor: '#fff',
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    />
  </Stack.Navigator>
);

// Stack de navigation pour l'authentification
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </Stack.Navigator>
);

// Navigation principale avec TabNavigator
const MainStack = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        switch (route.name) {
          case 'Messages':
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
            break;
          case 'Feed':
            iconName = focused ? 'newspaper' : 'newspaper-outline';
            break;
          case 'Market':
            iconName = focused ? 'cart' : 'cart-outline';
            break;
          case 'Search':
            iconName = focused ? 'search' : 'search-outline';
            break;
          case 'ProfileStack':
            iconName = focused ? 'person' : 'person-outline';
            break;
          default:
            iconName = 'ellipsis-horizontal';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#007AFF',
      tabBarInactiveTintColor: 'gray',
      headerShown: false,
    })}
  >
    <Tab.Screen
      name="Messages"
      component={ChatStack}
      options={{ tabBarLabel: 'Messages' }}
    />
    <Tab.Screen
      name="Feed"
      component={FeedStack}
      options={{ tabBarLabel: 'Actualités' }}
    />
    <Tab.Screen
      name="Market"
      component={MarketStack}
      options={{ tabBarLabel: 'Marché' }}
    />
    <Tab.Screen
      name="Search"
      component={GlobalSearchScreen}
      options={{ tabBarLabel: 'Recherche' }}
    />
    <Tab.Screen
      name="ProfileStack"
      component={ProfileStack}
      options={{ tabBarLabel: 'Profil' }}
    />
  </Tab.Navigator>
);

// Navigateur principal qui gère l'état d'authentification
const AppNavigator = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="Main" component={MainStack} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
