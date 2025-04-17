import { supabase } from './supabase';

export const marketService = {
  // Récupérer les produits
  async getProducts(page = 0, limit = 20, filters = {}) {
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          seller:profiles(username, avatar_url),
          group_buy_participants(count)
        `)
        .order('created_at', { ascending: false })
        .range(page * limit, (page + 1) * limit - 1);

      // Filtres optionnels
      if (filters.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }
      if (filters.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }
      if (filters.minPrice) {
        query = query.gte('price', filters.minPrice);
      }
      if (filters.maxPrice) {
        query = query.lte('price', filters.maxPrice);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erreur lors de la récupération des produits:', error);
        throw new Error('Impossible de charger les produits');
      }

      return data || [];
    } catch (error) {
      console.error('Erreur dans getProducts:', error);
      throw new Error('Erreur lors du chargement des produits');
    }
  },

  // Récupérer un produit par ID
  async getProductById(productId) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          seller:profiles(username, avatar_url),
          group_buy_participants(count)
        `)
        .eq('id', productId)
        .single();

      if (error) {
        console.error('Erreur lors de la récupération du produit:', error);
        throw new Error('Impossible de charger le produit');
      }

      return data;
    } catch (error) {
      console.error('Erreur dans getProductById:', error);
      throw new Error('Erreur lors du chargement du produit');
    }
  },

  // Ajouter au panier
  async addToCart(userId, productId, quantity = 1) {
    try {
      // Vérifier si le produit existe déjà dans le panier
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .single();

      if (existingItem) {
        // Mettre à jour la quantité
        const { data, error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id)
          .select();

        if (error) throw error;
        return data[0];
      }

      // Ajouter un nouvel item
      const { data, error } = await supabase
        .from('cart_items')
        .insert({
          user_id: userId,
          product_id: productId,
          quantity
        })
        .select();

      if (error) {
        console.error('Erreur lors de l\'ajout au panier:', error);
        throw new Error('Impossible d\'ajouter au panier');
      }

      return data[0];
    } catch (error) {
      console.error('Erreur dans addToCart:', error);
      throw new Error('Erreur lors de l\'ajout au panier');
    }
  },

  // Récupérer le panier de l'utilisateur
  async getUserCart(userId) {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          product:products(*)
        `)
        .eq('user_id', userId);

      if (error) {
        console.error('Erreur lors de la récupération du panier:', error);
        throw new Error('Impossible de charger le panier');
      }

      return data || [];
    } catch (error) {
      console.error('Erreur dans getUserCart:', error);
      throw new Error('Erreur lors du chargement du panier');
    }
  },

  // Mettre à jour la quantité dans le panier
  async updateCartItemQuantity(cartItemId, quantity) {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', cartItemId)
        .select();

      if (error) {
        console.error('Erreur lors de la mise à jour de la quantité:', error);
        throw new Error('Impossible de mettre à jour la quantité');
      }

      return data[0];
    } catch (error) {
      console.error('Erreur dans updateCartItemQuantity:', error);
      throw new Error('Erreur lors de la mise à jour de la quantité');
    }
  },

  // Supprimer un item du panier
  async removeFromCart(cartItemId) {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId);

      if (error) {
        console.error('Erreur lors de la suppression du panier:', error);
        throw new Error('Impossible de supprimer l\'article du panier');
      }

      return true;
    } catch (error) {
      console.error('Erreur dans removeFromCart:', error);
      throw new Error('Erreur lors de la suppression de l\'article');
    }
  }
};