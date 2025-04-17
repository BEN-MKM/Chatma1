import { supabase } from './supabase';

class MessageService {
  async getConversations(userId) {
    try {
      const { data, error } = await supabase
        .from('Conversations')
        .select(`
          *,
          Messages (*)
        `)
        .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return [];
    }
  }
}

export const messageService = new MessageService();