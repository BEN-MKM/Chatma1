import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Structure: { [chatId]: { messages: [], isLoading: false, error: null, hasMore: true } }
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setMessages: (state, action) => {
      const { chatId, messages, hasMore } = action.payload;
      state[chatId] = {
        ...state[chatId],
        messages,
        hasMore,
        isLoading: false,
        error: null
      };
    },
    addMessage: (state, action) => {
      const message = action.payload;
      const chatId = message.chatId;
      
      if (!state[chatId]) {
        state[chatId] = {
          messages: [],
          isLoading: false,
          error: null,
          hasMore: true
        };
      }
      
      state[chatId].messages.push(message);
    },
    updateMessageStatus: (state, action) => {
      const { messageId, status, chatId } = action.payload;
      const chat = state[chatId];
      
      if (chat) {
        const message = chat.messages.find(m => m.id === messageId);
        if (message) {
          message.status = status;
        }
      }
    },
    deleteMessage: (state, action) => {
      const { messageId, deleteType, chatId } = action.payload;
      const chat = state[chatId];
      
      if (chat) {
        if (deleteType === 'forMe') {
          chat.messages = chat.messages.filter(m => m.id !== messageId);
        } else {
          const message = chat.messages.find(m => m.id === messageId);
          if (message) {
            message.deleted = true;
            message.content = 'Ce message a été supprimé';
          }
        }
      }
    },
    setLoading: (state, action) => {
      const { chatId, isLoading } = action.payload;
      if (state[chatId]) {
        state[chatId].isLoading = isLoading;
      }
    },
    setError: (state, action) => {
      const { chatId, error } = action.payload;
      if (state[chatId]) {
        state[chatId].error = error;
      }
    },
    clearChat: (state, action) => {
      const chatId = action.payload;
      delete state[chatId];
    },
  },
});

export const {
  setMessages,
  addMessage,
  updateMessageStatus,
  deleteMessage,
  setLoading,
  setError,
  clearChat,
} = messagesSlice.actions;

export default messagesSlice.reducer;