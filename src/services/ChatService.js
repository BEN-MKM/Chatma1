import supabase from '../config/supabase';
import { Platform } from 'react-native';

class ChatService {
  constructor() {
    this.subscriptions = new Map();
    this.messageQueue = new Map();
    this.retryAttempts = new Map();
    this.MAX_RETRIES = 3;
    this.userId = null;
  }

  async init(userId) {
    this.userId = userId;
    await this.setupMessageSync();
  }

  async setupMessageSync() {
    if (!this.userId) return;
    await this.syncPendingMessages();
  }

  async syncPendingMessages() {
    for (const [tempId, message] of this.messageQueue.entries()) {
      try {
        await this.sendMessage(
          message.conversation_id,
          message.content,
          message.type,
          message.attachments
        );
        this.messageQueue.delete(tempId);
      } catch (error) {
        console.error(`Erreur sync message ${tempId}:`, error);
      }
    }
  }

  subscribeToUpdates({ 
    onNewConversation, 
    onConversationUpdate, 
    onConversationDelete, 
    onUnreadCountUpdate,
    onPresenceSync 
  }) {
    if (!this.userId) return () => {};

    // Souscription aux changements de conversations
    const conversationsSubscription = supabase
      .channel('conversations_changes')
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `participants=cs.{${this.userId}}`
        },
        (payload) => {
          switch (payload.eventType) {
            case 'INSERT':
              onNewConversation?.(payload.new);
              break;
            case 'UPDATE':
              onConversationUpdate?.(payload.new);
              break;
            case 'DELETE':
              onConversationDelete?.(payload.old.id);
              break;
          }
        }
      )
      .subscribe();

    // Souscription aux changements de messages non lus
    const unreadSubscription = supabase
      .channel('unread_changes')
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversation_participants',
          filter: `user_id=eq.${this.userId}`
        },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            onUnreadCountUpdate?.(
              payload.new.conversation_id,
              payload.new.unread_count
            );
          }
        }
      )
      .subscribe();

    // Souscription à la présence
    const presenceSubscription = supabase
      .channel('online_users')
      .on('presence', { event: 'sync' }, () => {
        const state = presenceSubscription.presenceState();
        onPresenceSync?.(state);
      })
      .subscribe();

    // Retourner une fonction de nettoyage
    return () => {
      conversationsSubscription.unsubscribe();
      unreadSubscription.unsubscribe();
      presenceSubscription.unsubscribe();
    };
  }

  async createConversation(participants, type = 'private') {
    try {
      if (type === 'private' && participants.length === 2) {
        const { data: existingConv, error: searchError } = await supabase
          .from('conversations')
          .select('id, participants')
          .eq('type', 'private')
          .contains('participants', participants)
          .single();

        if (!searchError && existingConv) {
          return existingConv;
        }
      }

      const { data, error } = await supabase
        .from('conversations')
        .insert({
          type,
          participants,
          created_by: this.userId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      await Promise.all(
        participants.map(participantId =>
          supabase
            .from('conversation_participants')
            .insert({
              conversation_id: data.id,
              user_id: participantId,
              role: participantId === this.userId ? 'admin' : 'member',
              joined_at: new Date().toISOString()
            })
        )
      );

      return data;
    } catch (error) {
      console.error('Erreur création conversation:', error);
      throw error;
    }
  }

  async sendMessage(conversationId, content, type = 'text', attachments = []) {
    try {
      const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const timestamp = new Date().toISOString();

      const message = {
        id: tempId,
        conversation_id: conversationId,
        sender_id: this.userId,
        content,
        type,
        attachments,
        status: 'sending',
        created_at: timestamp,
        updated_at: timestamp
      };

      // Ajouter à la file d'attente si hors ligne
      if (!navigator.onLine && Platform.OS === 'web') {
        this.messageQueue.set(tempId, message);
        return message;
      }

      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: this.userId,
          content,
          type,
          attachments,
          created_at: timestamp,
          updated_at: timestamp
        })
        .select()
        .single();

      if (error) throw error;

      // Mettre à jour la conversation
      await supabase
        .from('conversations')
        .update({
          last_message: content,
          last_message_at: timestamp,
          updated_at: timestamp
        })
        .eq('id', conversationId);

      // Mettre à jour les compteurs de messages non lus
      await supabase.rpc('increment_unread_count', {
        p_conversation_id: conversationId,
        p_user_id: this.userId
      });

      return data;
    } catch (error) {
      console.error('Erreur envoi message:', error);
      throw error;
    }
  }

  async getUserConversations() {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          participants:conversation_participants(
            user_id,
            role,
            joined_at,
            last_read_at
          ),
          last_message:messages(
            id,
            content,
            type,
            created_at,
            sender:sender_id(
              id,
              username
            )
          )
        `)
        .contains('participants', [this.userId])
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur récupération conversations:', error);
      throw error;
    }
  }

  async getConversationMessages(conversationId, limit = 50, before = null) {
    try {
      let query = supabase
        .from('messages')
        .select(`
          *,
          sender:sender_id(
            id,
            username,
            avatar_url
          )
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (before) {
        query = query.lt('created_at', before);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data.reverse();
    } catch (error) {
      console.error('Erreur récupération messages:', error);
      throw error;
    }
  }

  async markConversationAsRead(conversationId) {
    try {
      const { error } = await supabase
        .from('conversation_participants')
        .update({
          last_read_at: new Date().toISOString(),
          unread_count: 0
        })
        .eq('conversation_id', conversationId)
        .eq('user_id', this.userId);

      if (error) throw error;
    } catch (error) {
      console.error('Erreur marquage conversation comme lue:', error);
      throw error;
    }
  }

  async getUnreadCounts() {
    try {
      const { data, error } = await supabase
        .from('conversation_participants')
        .select('conversation_id, unread_count')
        .eq('user_id', this.userId);

      if (error) throw error;

      return data.reduce((acc, item) => {
        acc[item.conversation_id] = item.unread_count;
        return acc;
      }, {});
    } catch (error) {
      console.error('Erreur récupération compteurs non lus:', error);
      throw error;
    }
  }

  cleanup() {
    this.userId = null;
    this.messageQueue.clear();
    this.retryAttempts.clear();
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions.clear();
  }
}

const chatService = new ChatService();

export { chatService };
