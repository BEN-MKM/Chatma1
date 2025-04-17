import supabase from '../config/supabase';

export const messageService = {
  async sendMessage(roomId, senderId, content, type = 'text', fileUrl = null) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            room_id: roomId,
            sender_id: senderId,
            content,
            type,
            file_url: fileUrl,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      throw error;
    }
  },

  async getMessages(roomId, limit = 50, startFrom = null) {
    try {
      let query = supabase
        .from('messages')
        .select(`
          *,
          sender:users(id, username, avatar_url),
          status:message_status(user_id, status)
        `)
        .eq('room_id', roomId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (startFrom) {
        query = query.lt('created_at', startFrom);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des messages:', error);
      throw error;
    }
  },

  async updateMessageStatus(messageId, userId, status) {
    try {
      const { data, error } = await supabase
        .from('message_status')
        .upsert([
          {
            message_id: messageId,
            user_id: userId,
            status,
          },
        ]);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      throw error;
    }
  },

  subscribeToNewMessages(roomId, callback) {
    return supabase
      .channel(`room:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => callback(payload.new)
      )
      .subscribe();
  },

  subscribeToMessageStatus(messageIds, callback) {
    return supabase
      .channel('message_status')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'message_status',
          filter: `message_id=in.(${messageIds.join(',')})`,
        },
        (payload) => callback(payload.new)
      )
      .subscribe();
  },
};

export const roomService = {
  async createRoom(name, type, createdBy, participants) {
    try {
      const { data: room, error: roomError } = await supabase
        .from('rooms')
        .insert([
          {
            name,
            type,
            created_by: createdBy,
          },
        ])
        .select()
        .single();

      if (roomError) throw roomError;

      const participantsData = [
        { room_id: room.id, user_id: createdBy },
        ...participants.map((userId) => ({
          room_id: room.id,
          user_id: userId,
        })),
      ];

      const { error: participantsError } = await supabase
        .from('room_participants')
        .insert(participantsData);

      if (participantsError) throw participantsError;

      return room;
    } catch (error) {
      console.error('Erreur lors de la création de la salle:', error);
      throw error;
    }
  },

  async getRooms(userId) {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select(`
          *,
          participants:room_participants(user_id, last_read_at),
          last_message:messages(
            id,
            content,
            type,
            created_at,
            sender:users(username)
          )
        `)
        .eq('room_participants.user_id', userId)
        .order('last_message.created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des salles:', error);
      throw error;
    }
  },

  async updateLastRead(roomId, userId) {
    try {
      const { error } = await supabase
        .from('room_participants')
        .update({ last_read_at: new Date().toISOString() })
        .eq('room_id', roomId)
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de last_read:', error);
      throw error;
    }
  },

  subscribeToRoomUpdates(roomId, callback) {
    return supabase
      .channel(`room:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'room_participants',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => callback(payload)
      )
      .subscribe();
  },
};

export const userService = {
  async updateProfile(userId, updates) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      throw error;
    }
  },

  async updatePresence(userId, status) {
    try {
      const { error } = await supabase
        .from('users')
        .update({ status, last_seen: new Date().toISOString() })
        .eq('id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la présence:', error);
      throw error;
    }
  },

  subscribeToUserPresence(userIds, callback) {
    return supabase
      .channel('user_presence')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'users',
          filter: `id=in.(${userIds.join(',')})`,
        },
        (payload) => callback(payload.new)
      )
      .subscribe();
  },

  async getAllUsers() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, username, avatar_url, status, last_seen')
        .order('username');

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      throw error;
    }
  },
};
