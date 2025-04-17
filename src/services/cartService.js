import { supabase } from './supabase';

class CartService {
  async addToCart(userId, productId, quantity = 1) {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .upsert({
          user_id: userId,
          product_id: productId,
          quantity
        })
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }
}

export const cartService = new CartService();