const initialState = {
  isLoading: false,
  error: null,
  notifications: {
    count: 0,
    items: []
  }
};

export const appActions = {
  SET_LOADING: 'app/setLoading',
  SET_ERROR: 'app/setError',
  ADD_NOTIFICATION: 'app/addNotification',
  REMOVE_NOTIFICATION: 'app/removeNotification',
  CLEAR_NOTIFICATIONS: 'app/clearNotifications'
};

export const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case appActions.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    case appActions.SET_ERROR:
      return {
        ...state,
        error: action.payload
      };
    case appActions.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: {
          count: state.notifications.count + 1,
          items: [action.payload, ...state.notifications.items]
        }
      };
    case appActions.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: {
          count: state.notifications.count - 1,
          items: state.notifications.items.filter(n => n.id !== action.payload)
        }
      };
    case appActions.CLEAR_NOTIFICATIONS:
      return {
        ...state,
        notifications: {
          count: 0,
          items: []
        }
      };
    default:
      return state;
  }
};