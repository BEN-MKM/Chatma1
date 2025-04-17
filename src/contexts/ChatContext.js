import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { useAuth } from './AuthContext';
import { chatService } from '../services/ChatService';

const ChatContext = createContext({});

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [activeConversations, setActiveConversations] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Charger les conversations actives
  useEffect(() => {
    if (!user) {
      setActiveConversations([]);
      setUnreadCounts({});
      setOnlineUsers(new Set());
      setIsLoading(false);
      return;
    }

    const loadConversations = async () => {
      try {
        const conversations = await chatService.getUserConversations();
        setActiveConversations(conversations);

        // Charger les compteurs de messages non lus
        const counts = await chatService.getUnreadCounts();
        setUnreadCounts(counts);
      } catch (error) {
        console.error('Erreur chargement conversations:', error);
        Alert.alert('Erreur', 'Impossible de charger les conversations');
      } finally {
        setIsLoading(false);
      }
    };

    loadConversations();
  }, [user]);

  // Souscription aux mises à jour en temps réel
  useEffect(() => {
    if (!user) return;

    const unsubscribe = chatService.subscribeToUpdates({
      onNewConversation: (conversation) => {
        setActiveConversations(prev => [conversation, ...prev]);
      },
      onConversationUpdate: (conversation) => {
        setActiveConversations(prev =>
          prev.map(conv => conv.id === conversation.id ? conversation : conv)
        );
      },
      onConversationDelete: (conversationId) => {
        setActiveConversations(prev =>
          prev.filter(conv => conv.id !== conversationId)
        );
      },
      onUnreadCountUpdate: (conversationId, count) => {
        setUnreadCounts(prev => ({
          ...prev,
          [conversationId]: count
        }));
      },
      onPresenceSync: (presenceState) => {
        const presentUsers = new Set(
          Object.values(presenceState)
            .flat()
            .map(presence => presence.user_id)
        );
        setOnlineUsers(presentUsers);
      }
    });

    return () => unsubscribe();
  }, [user]);

  // Créer une nouvelle conversation
  const createConversation = useCallback(async (participants, type = 'private') => {
    try {
      const conversation = await chatService.createConversation(participants, type);
      setActiveConversations(prev => [conversation, ...prev]);
      return conversation;
    } catch (error) {
      console.error('Erreur création conversation:', error);
      throw error;
    }
  }, []);

  // Marquer une conversation comme lue
  const markConversationAsRead = useCallback(async (conversationId) => {
    try {
      await chatService.markConversationAsRead(conversationId);
      setUnreadCounts(prev => ({
        ...prev,
        [conversationId]: 0
      }));
    } catch (error) {
      console.error('Erreur marquage conversation comme lue:', error);
    }
  }, []);

  // Archiver une conversation
  const archiveConversation = useCallback(async (conversationId) => {
    try {
      await chatService.archiveConversation(conversationId);
      setActiveConversations(prev =>
        prev.filter(conv => conv.id !== conversationId)
      );
    } catch (error) {
      console.error('Erreur archivage conversation:', error);
      throw error;
    }
  }, []);

  // Quitter un groupe
  const leaveGroup = useCallback(async (conversationId) => {
    try {
      await chatService.leaveConversation(conversationId);
      setActiveConversations(prev =>
        prev.filter(conv => conv.id !== conversationId)
      );
    } catch (error) {
      console.error('Erreur sortie du groupe:', error);
      throw error;
    }
  }, []);

  const value = {
    activeConversations,
    unreadCounts,
    onlineUsers,
    isLoading,
    createConversation,
    markConversationAsRead,
    archiveConversation,
    leaveGroup,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export default ChatContext;
