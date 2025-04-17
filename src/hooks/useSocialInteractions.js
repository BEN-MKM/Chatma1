import { useState, useEffect, useCallback } from 'react';
import websocketService from '../services/websocketService';
import notificationService from '../services/notificationService';

const useSocialInteractions = (userId) => {
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [typing, setTyping] = useState({});
  const [reactions, setReactions] = useState({});
  const [notifications, setNotifications] = useState([]);

  const handlePresenceUpdate = useCallback((data) => {
    setOnlineUsers(prev => {
      const newSet = new Set(prev);
      if (data.status === 'online') {
        newSet.add(data.userId);
      } else {
        newSet.delete(data.userId);
      }
      return newSet;
    });
  }, []);

  const handleNewReaction = useCallback((data) => {
    setReactions(prev => ({
      ...prev,
      [data.postId]: {
        ...(prev[data.postId] || {}),
        [data.userId]: data.reaction
      }
    }));
  }, []);

  const handleNotification = useCallback((data) => {
    setNotifications(prev => [data, ...prev]);
  }, []);

  useEffect(() => {
    // Initialiser les services
    websocketService.connect(userId);
    notificationService.init();

    // Écouteurs WebSocket
    websocketService.on('presenceUpdate', handlePresenceUpdate);
    websocketService.on('newReaction', handleNewReaction);
    websocketService.on('notification', handleNotification);

    return () => {
      websocketService.disconnect();
      notificationService.cleanup();
      
      // Nettoyer les écouteurs
      websocketService.removeListener('presenceUpdate', handlePresenceUpdate);
      websocketService.removeListener('newReaction', handleNewReaction);
      websocketService.removeListener('notification', handleNotification);
    };
  }, [userId, handlePresenceUpdate, handleNewReaction, handleNotification]);

  const sendReaction = useCallback((postId, reaction) => {
    websocketService.sendReaction(postId, reaction);
  }, []);

  const markTyping = useCallback((chatId, isTyping) => {
    websocketService.sendTypingStatus(chatId, isTyping);
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    notificationService.clearBadgeCount();
  }, []);

  const isUserOnline = useCallback((targetUserId) => {
    return onlineUsers.has(targetUserId);
  }, [onlineUsers]);

  const getReactions = useCallback((postId) => {
    return reactions[postId] || {};
  }, [reactions]);

  return {
    onlineUsers,
    typing,
    notifications,
    sendReaction,
    markTyping,
    clearNotifications,
    isUserOnline,
    getReactions
  };
};

export default useSocialInteractions;
