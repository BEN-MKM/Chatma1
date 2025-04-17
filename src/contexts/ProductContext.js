import React, { createContext, useState, useContext, useEffect } from 'react';
import supabase from '../config/supabase';

const ProductContext = createContext();

export const useProduct = () => {
  return useContext(ProductContext);
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les produits
  const loadProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*, sellers(shop_name)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data.map(product => ({
        ...product,
        sellerName: product.sellers?.shop_name
      })));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Ajouter un produit
  const addProduct = async (productData) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();

      if (error) throw error;
      setProducts(prev => [data, ...prev]);
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour un produit
  const updateProduct = async (id, updates) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setProducts(prev => prev.map(p => p.id === id ? data : p));
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Supprimer un produit
  const deleteProduct = async (id) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setProducts(prev => prev.filter(p => p.id !== id));
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Rechercher des produits
  const searchProducts = async (query) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*, sellers(shop_name)')
        .textSearch('name', query)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { 
        success: true, 
        data: data.map(product => ({
          ...product,
          sellerName: product.sellers?.shop_name
        }))
      };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const value = {
    products,
    loading,
    error,
    loadProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    searchProducts
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};
