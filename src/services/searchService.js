import supabase from '../config/supabase';

class SearchService {
  async searchUsers(query, limit = 20) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, username, avatar_url, status')
        .or(`username.ilike.%${query}%,full_name.ilike.%${query}%`)
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la recherche des utilisateurs:', error);
      throw error;
    }
  }

  async searchProducts(query, filters = {}, limit = 20) {
    try {
      let queryBuilder = supabase
        .from('products')
        .select(`
          *,
          seller:user_id(id, username, avatar_url),
          categories(id, name)
        `)
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`);

      // Appliquer les filtres
      if (filters.minPrice) {
        queryBuilder = queryBuilder.gte('price', filters.minPrice);
      }
      if (filters.maxPrice) {
        queryBuilder = queryBuilder.lte('price', filters.maxPrice);
      }
      if (filters.category) {
        queryBuilder = queryBuilder.eq('category_id', filters.category);
      }
      if (filters.condition) {
        queryBuilder = queryBuilder.eq('condition', filters.condition);
      }

      const { data, error } = await queryBuilder
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la recherche des produits:', error);
      throw error;
    }
  }

  async searchMessages(query, roomId = null, limit = 20) {
    try {
      let queryBuilder = supabase
        .from('messages')
        .select(`
          *,
          sender:user_id(id, username, avatar_url)
        `)
        .textSearch('content', query);

      if (roomId) {
        queryBuilder = queryBuilder.eq('room_id', roomId);
      }

      const { data, error } = await queryBuilder
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la recherche des messages:', error);
      throw error;
    }
  }

  async searchGlobal(query, limit = 20) {
    try {
      const [users, products, messages] = await Promise.all([
        this.searchUsers(query, limit),
        this.searchProducts(query, {}, limit),
        this.searchMessages(query, null, limit)
      ]);

      return {
        users,
        products,
        messages
      };
    } catch (error) {
      console.error('Erreur lors de la recherche globale:', error);
      throw error;
    }
  }
}

export default new SearchService();
