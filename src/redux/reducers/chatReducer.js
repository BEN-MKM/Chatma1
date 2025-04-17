const initialState = {
  conversations: [],
  currentConversation: null,
  messages: [],
  loading: false,
  error: null
};

export const chatActions = {
  FETCH_CONVERSATIONS_REQUEST: 'FETCH_CONVERSATIONS_REQUEST',
  FETCH_CONVERSATIONS_SUCCESS: 'FETCH_CONVERSATIONS_SUCCESS',
  SELECT_CONVERSATION: 'SELECT_CONVERSATION',
  SEND_MESSAGE: 'SEND_MESSAGE',
  RECEIVE_MESSAGE: 'RECEIVE_MESSAGE'
};

export const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case chatActions.FETCH_CONVERSATIONS_REQUEST:
      return { ...state, loading: true };
    case chatActions.FETCH_CONVERSATIONS_SUCCESS:
      return { 
        ...state, 
        loading: false, 
        conversations: action.payload 
      };
    case chatActions.SELECT_CONVERSATION:
      return {
        ...state,
        currentConversation: action.payload,
        messages: []
      };
    case chatActions.SEND_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload]
      };
    case chatActions.RECEIVE_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload]
      };
    default:
      return state;
  }
};