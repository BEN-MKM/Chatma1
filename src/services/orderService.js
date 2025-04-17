import { supabase } from './supabase';

class OrderService {
  async getUserOrders(userId) {
    try {
      const { data, error } = await supabase
        .from('ordres')
        .select(`
          *,
          order_items (
            *,
            product:Produits(*)
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  }
}

export const orderService = new OrderService();