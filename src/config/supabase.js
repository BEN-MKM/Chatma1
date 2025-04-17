import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const supabaseUrl = 'https://dqituzmkfamsbiuxdauv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxaXR1em1rZmFtc2JpdXhkYXV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3MDI5MjcsImV4cCI6MjA2MDI3ODkyN30.sF-c8vCwdvXKkIx66em2ThV3HMFvWUXEPQ2wrM8yrkQ';

const supabaseOptions = {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    debug: __DEV__,
  },
  realtime: {
    timeout: 20000,
    params: {
      eventsPerSecond: 10,
    },
    heartbeat: {
      interval: 15000,
      timeout: 30000,
    },
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
};

// Ajouter des options spécifiques à la plateforme
if (Platform.OS === 'web') {
  // Options spécifiques au web si nécessaire
} else {
  // Options spécifiques au mobile
  supabaseOptions.auth = {
    ...supabaseOptions.auth,
    flowType: 'pkce',
    detectSessionInUrl: false,
  };
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, supabaseOptions);

// Fonction utilitaire pour tester la connexion
export const testConnection = async () => {
  try {
    // Vérifier d'abord la connexion Internet
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      throw new Error('Pas de connexion Internet');
    }

    // Vérifier la connexion à Supabase
    console.log('Test de connexion à Supabase...');
    const { data, error } = await supabase.from('profiles').select('count');
    
    if (error) {
      console.error('Erreur Supabase:', error);
      throw error;
    }

    console.log('Connexion Supabase OK');
    return true;
  } catch (error) {
    console.error('Erreur de connexion:', error);
    throw error;
  }
};

// Fonction pour vérifier et rétablir la connexion si nécessaire
export const checkAndReconnect = async () => {
  try {
    await testConnection();
  } catch (error) {
    console.error('Erreur de reconnexion:', error);
    // Implémenter ici la logique de reconnexion si nécessaire
  }
};

// Configurer un écouteur de connexion réseau
NetInfo.addEventListener(state => {
  if (state.isConnected) {
    checkAndReconnect();
  }
});

export default supabase;
