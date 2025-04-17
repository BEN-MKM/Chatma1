// hooks/useMessages.js
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  addMessage, 
  updateMessageStatus, 
  deleteMessage, 
  setMessages 
} from '../redux/slices/messagesSlice';

export const useMessages = (chatId) => {
  const dispatch = useDispatch();
  const { 
    messages, 
    isLoading, 
    error,
    hasMore 
  } = useSelector(state => state.messages[chatId] || {
    messages: [],
    isLoading: false,
    error: null,
    hasMore: true
  });

  const sendMessage = useCallback(async (content, type = 'text') => {
    try {
      const newMessage = {
        id: Date.now().toString(),
        content,
        type,
        timestamp: Date.now(),
        status: 'sending',
        chatId
      };

      dispatch(addMessage(newMessage));

      // Simuler l'envoi du message
      setTimeout(() => {
        dispatch(updateMessageStatus({ 
          messageId: newMessage.id, 
          status: 'sent' 
        }));
      }, 1000);

      // Simuler la confirmation de lecture
      setTimeout(() => {
        dispatch(updateMessageStatus({ 
          messageId: newMessage.id, 
          status: 'read' 
        }));
      }, 2000);

      return newMessage;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }, [dispatch, chatId]);

  const loadMoreMessages = useCallback(async () => {
    if (!hasMore || isLoading) return;

    try {
      // Simuler le chargement des messages
      const olderMessages = []; // À remplacer par l'appel API réel
      
      dispatch(setMessages({
        chatId,
        messages: [...messages, ...olderMessages],
        hasMore: olderMessages.length > 0
      }));
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  }, [dispatch, chatId, hasMore, isLoading, messages]);

  const handleDeleteMessage = useCallback((messageId, deleteType = 'forMe') => {
    dispatch(deleteMessage({ messageId, deleteType, chatId }));
  }, [dispatch, chatId]);

  const forwardMessage = useCallback(async (messageId, targetChatId) => {
    const messageToForward = messages.find(m => m.id === messageId);
    if (messageToForward) {
      return sendMessage(messageToForward.content, messageToForward.type);
    }
  }, [messages, sendMessage]);

  return {
    messages,
    isLoading,
    error,
    hasMore,
    sendMessage,
    loadMoreMessages,
    deleteMessage: handleDeleteMessage,
    forwardMessage
  };
};