import 'react-native-url-polyfill/auto';
import supabase from './supabase';

export const initializeSupabase = async () => {
  try {
    // Vérifier si les tables nécessaires existent
    const { error: schemaError } = await supabase
      .from('schema_version')
      .select('version')
      .single();

    if (schemaError) {
      console.warn('Schema non initialisé ou erreur:', schemaError);
      // La gestion de la migration initiale devrait être faite ici si nécessaire
    }

    // Configurer les souscriptions en temps réel
    const channels = [
      // Canal pour les conversations
      supabase.channel('conversations')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'conversations'
        }, payload => {
          console.log('Changement conversation:', payload);
        }),

      // Canal pour les messages
      supabase.channel('messages')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'messages'
        }, payload => {
          console.log('Nouveau message:', payload);
        }),

      // Canal pour les présences
      supabase.channel('online-users')
        .on('presence', { event: 'sync' }, () => {
          console.log('Sync présence');
        })
        .on('presence', { event: 'join' }, ({ key, currentPresences }) => {
          console.log('Utilisateur connecté:', key);
        })
        .on('presence', { event: 'leave' }, ({ key }) => {
          console.log('Utilisateur déconnecté:', key);
        })
    ];

    // Souscrire à tous les canaux
    await Promise.all(channels.map(channel => channel.subscribe()));

    // Configurer les politiques de reconnexion
    supabase.realtime.setAuth({
      retryInterval: 1000,
      maxRetries: 10
    });

    console.log('Initialisation Supabase réussie');
    return true;
  } catch (error) {
    console.error('Erreur initialisation Supabase:', error);
    throw error;
  }
};

export const cleanupSupabase = async () => {
  try {
    // Se désabonner de tous les canaux
    const channels = supabase.getChannels();
    await Promise.all(channels.map(channel => channel.unsubscribe()));

    // Nettoyer la session si nécessaire
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    console.log('Nettoyage Supabase réussi');
  } catch (error) {
    console.error('Erreur nettoyage Supabase:', error);
    throw error;
  }
};

// Configuration des écouteurs d'état de connexion
supabase.realtime.on('connected', () => {
  console.log('Connecté à Supabase Realtime');
});

supabase.realtime.on('disconnected', () => {
  console.log('Déconnecté de Supabase Realtime');
});

supabase.realtime.on('error', (error) => {
  console.error('Erreur Supabase Realtime:', error);
});

export default {
  initializeSupabase,
  cleanupSupabase
};
