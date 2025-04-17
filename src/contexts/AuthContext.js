import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import supabase from '../config/supabase';
import { logError, logInfo } from '../utils/errorUtils';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Vérifier la session au démarrage
  useEffect(() => {
    checkUser();
    
    // Écouter les changements d'auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Vérifier l'utilisateur actuel
  const checkUser = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;

      setSession(session);
      setUser(session?.user ?? null);
    } catch (error) {
      logError('Erreur vérification utilisateur:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Connexion avec email/mot de passe
  const signIn = async ({ email, password }) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      logInfo('Connexion réussie:', { userId: data.user.id });
      return data;
    } catch (error) {
      logError('Erreur connexion:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Inscription avec email/mot de passe
  const signUp = async ({ email, password, username }) => {
    try {
      setLoading(true);
      setError(null);

      // Créer l'utilisateur
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });

      if (error) throw error;

      // Créer le profil utilisateur
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            username,
            email,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);

      if (profileError) throw profileError;

      logInfo('Inscription réussie:', { userId: data.user.id });
      return data;
    } catch (error) {
      logError('Erreur inscription:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Déconnexion
  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Nettoyer le stockage local
      await AsyncStorage.multiRemove([
        '@user_settings',
        '@cached_conversations',
        '@cached_messages',
      ]);

      logInfo('Déconnexion réussie');
    } catch (error) {
      logError('Erreur déconnexion:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Réinitialisation du mot de passe
  const resetPassword = async (email) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'chatma://reset-password',
      });

      if (error) throw error;

      logInfo('Email de réinitialisation envoyé:', { email });
    } catch (error) {
      logError('Erreur réinitialisation mot de passe:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Mise à jour du mot de passe
  const updatePassword = async (newPassword) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      logInfo('Mot de passe mis à jour');
    } catch (error) {
      logError('Erreur mise à jour mot de passe:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Mise à jour du profil
  const updateProfile = async (updates) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      // Mettre à jour le contexte
      setUser(prev => ({
        ...prev,
        user_metadata: {
          ...prev.user_metadata,
          ...updates,
        },
      }));

      logInfo('Profil mis à jour');
    } catch (error) {
      logError('Erreur mise à jour profil:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
