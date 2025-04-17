import { supabase } from './supabase';

class ProductService {
  async getProducts(options = {}) {
    try {
      let query = supabase.from('Produits').select('*');
      
      if (options.page && options.limit) {
        const from = (options.page - 1) * options.limit;
        query = query.range(from, from + options.limit - 1);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }
}

export const productService = new ProductService();