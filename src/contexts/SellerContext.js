import React, { createContext, useState, useContext, useEffect } from 'react';
import supabase from '../config/supabase';

const SellerContext = createContext();

export const useSeller = () => {
  return useContext(SellerContext);
};

export const SellerProvider = ({ children }) => {
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les informations du vendeur
  const loadSellerInfo = async (userId) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('sellers')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Aucun vendeur trouvé
          setSeller(null);
        } else {
          throw error;
        }
      } else {
        setSeller(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Devenir vendeur
  const becomeSeller = async (userData) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('sellers')
        .insert([{
          user_id: userData.userId,
          shop_name: userData.shopName,
          description: userData.description,
          contact_email: userData.contactEmail,
          phone_number: userData.phoneNumber,
          address: userData.address,
          status: 'pending', // pending, approved, rejected
          created_at: new Date()
        }])
        .select()
        .single();

      if (error) throw error;
      setSeller(data);
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour le profil vendeur
  const updateSellerProfile = async (updates) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('sellers')
        .update(updates)
        .eq('user_id', seller.user_id)
        .select()
        .single();

      if (error) throw error;
      setSeller(data);
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Vérifier si l'utilisateur est un vendeur
  const checkSellerStatus = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('sellers')
        .select('status')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return { isSeller: false };
        }
        throw error;
      }

      return {
        isSeller: true,
        status: data.status
      };
    } catch (err) {
      setError(err.message);
      return { isSeller: false, error: err.message };
    }
  };

  // Obtenir les statistiques du vendeur
  const getSellerStats = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('seller_stats')
        .select('*')
        .eq('seller_id', userId)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await loadSellerInfo(session.user.id);
      }
    };
    loadInitialData();
  }, []);

  // Écouter les changements d'authentification
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await loadSellerInfo(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setSeller(null);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const value = {
    seller,
    loading,
    error,
    becomeSeller,
    updateSellerProfile,
    checkSellerStatus,
    getSellerStats,
    loadSellerInfo
  };

  return (
    <SellerContext.Provider value={value}>
      {children}
    </SellerContext.Provider>
  );
};
