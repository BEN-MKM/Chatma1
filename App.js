import React, { useState, useEffect, useCallback } from 'react';
import { View, ActivityIndicator, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { initStripe, StripeProvider } from '@stripe/stripe-react-native';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';

import { AuthProvider } from './src/contexts/AuthContext';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { ChatProvider } from './src/contexts/ChatContext';
import { NotificationProvider } from './src/contexts/NotificationContext';
import { ProductProvider } from './src/contexts/ProductContext';
import { SellerProvider } from './src/contexts/SellerContext';
import AppNavigator from './src/navigation/AppNavigator';
import AppInitializer from './src/utils/AppInitializer';

// Ignorer les avertissements spécifiques
LogBox.ignoreLogs([
  'Setting a timer',
  'AsyncStorage has been extracted',
  'Non-serializable values were found in the navigation state',
]);

const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
    <ActivityIndicator size="large" color="#007AFF" />
  </View>
);

const App = () => {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        // Chargement des polices si nécessaire
        await Font.loadAsync({});
        
        // Initialize Stripe avec gestion d'erreur
        try {
          await initStripe({
            publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
            merchantIdentifier: 'merchant.com.chatma',
            urlScheme: 'chatma',
          });
        } catch (stripeError) {
          console.warn('Erreur d\'initialisation Stripe:', stripeError);
          // Continue l'exécution même si Stripe échoue
        }
        
        // Initialiser l'application
        const success = await AppInitializer.initialize();
        if (!success) {
          console.warn('Erreur lors de l\'initialisation de l\'application');
        }
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return <LoadingScreen />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <SafeAreaProvider>
        <NavigationContainer>
          <AuthProvider>
            <ThemeProvider>
              <ChatProvider>
                <NotificationProvider>
                  <ProductProvider>
                    <SellerProvider>
                      <StripeProvider>
                        <AppNavigator />
                      </StripeProvider>
                    </SellerProvider>
                  </ProductProvider>
                </NotificationProvider>
              </ChatProvider>
            </ThemeProvider>
          </AuthProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
