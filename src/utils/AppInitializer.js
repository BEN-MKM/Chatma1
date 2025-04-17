import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { Asset } from 'expo-asset';
import NetInfo from '@react-native-community/netinfo';
import { testConnection } from '../config/supabase';

// Maintenir l'écran de démarrage visible
SplashScreen.preventAutoHideAsync();

class AppInitializer {
  static async initialize() {
    try {
      // Charger les polices
      await Font.loadAsync({
        ...Ionicons.font,
      });

      // Vérifier la connexion réseau
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected) {
        console.warn('Pas de connexion Internet');
      }

      // Tester la connexion Supabase
      try {
        await testConnection();
      } catch (error) {
        console.warn('Erreur de connexion à Supabase:', error.message);
      }

      // Note: Les assets seront ajoutés une fois que nous aurons créé les fichiers
      // Pour l'instant, on retourne true pour permettre à l'app de démarrer
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'initialisation:', error);
      return false;
    }
  }

  static async hideLoadingScreen() {
    try {
      await SplashScreen.hideAsync();
    } catch (error) {
      console.warn('Erreur lors de la fermeture de l\'écran de chargement:', error);
    }
  }
}

export default AppInitializer;
