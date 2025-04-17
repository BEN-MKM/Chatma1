import supabase from '../config/supabase';

class StatsService {
  async getUserStats(userId) {
    try {
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  }

  async getMessageStats(userId, period = 'week') {
    try {
      let timeFilter;
      const now = new Date();

      switch (period) {
        case 'day':
          timeFilter = now.setDate(now.getDate() - 1);
          break;
        case 'week':
          timeFilter = now.setDate(now.getDate() - 7);
          break;
        case 'month':
          timeFilter = now.setMonth(now.getMonth() - 1);
          break;
        default:
          timeFilter = now.setDate(now.getDate() - 7);
      }

      const { data, error } = await supabase
        .from('messages')
        .select('created_at')
        .eq('user_id', userId)
        .gte('created_at', new Date(timeFilter).toISOString());

      if (error) throw error;

      // Grouper par jour
      const messagesByDay = data.reduce((acc, message) => {
        const date = new Date(message.created_at).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(messagesByDay).map(([date, count]) => ({
        date,
        count,
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques de messages:', error);
      throw error;
    }
  }

  async getProductStats(userId) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          created_at,
          status,
          price,
          views_count,
          likes_count,
          comments_count
        `)
        .eq('user_id', userId);

      if (error) throw error;

      const stats = {
        totalProducts: data.length,
        totalViews: data.reduce((sum, product) => sum + (product.views_count || 0), 0),
        totalLikes: data.reduce((sum, product) => sum + (product.likes_count || 0), 0),
        totalComments: data.reduce((sum, product) => sum + (product.comments_count || 0), 0),
        averagePrice: data.length > 0
          ? data.reduce((sum, product) => sum + product.price, 0) / data.length
          : 0,
        productsByStatus: data.reduce((acc, product) => {
          acc[product.status] = (acc[product.status] || 0) + 1;
          return acc;
        }, {}),
      };

      return stats;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques de produits:', error);
      throw error;
    }
  }

  async getTransactionStats(userId, period = 'month') {
    try {
      let timeFilter;
      const now = new Date();

      switch (period) {
        case 'week':
          timeFilter = now.setDate(now.getDate() - 7);
          break;
        case 'month':
          timeFilter = now.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          timeFilter = now.setFullYear(now.getFullYear() - 1);
          break;
        default:
          timeFilter = now.setMonth(now.getMonth() - 1);
      }

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'completed')
        .gte('created_at', new Date(timeFilter).toISOString());

      if (error) throw error;

      const stats = {
        totalTransactions: data.length,
        totalAmount: data.reduce((sum, transaction) => sum + transaction.amount, 0),
        transactionsByDay: {},
        averageTransactionAmount: data.length > 0
          ? data.reduce((sum, transaction) => sum + transaction.amount, 0) / data.length
          : 0,
      };

      // Grouper les transactions par jour
      data.forEach(transaction => {
        const date = new Date(transaction.created_at).toLocaleDateString();
        if (!stats.transactionsByDay[date]) {
          stats.transactionsByDay[date] = {
            count: 0,
            amount: 0,
          };
        }
        stats.transactionsByDay[date].count++;
        stats.transactionsByDay[date].amount += transaction.amount;
      });

      return stats;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques de transactions:', error);
      throw error;
    }
  }

  async subscribeToStats(userId, callback) {
    try {
      const subscription = supabase
        .channel('user_stats')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'user_stats',
          filter: `user_id=eq.${userId}`,
        }, payload => {
          callback(payload.new);
        })
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    } catch (error) {
      console.error('Erreur lors de la souscription aux statistiques:', error);
      throw error;
    }
  }
}

export default new StatsService();
