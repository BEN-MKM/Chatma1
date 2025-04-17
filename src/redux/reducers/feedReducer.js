const initialState = {
  posts: [],
  loading: false,
  error: null
};

export const feedActions = {
  FETCH_POSTS_REQUEST: 'FETCH_POSTS_REQUEST',
  FETCH_POSTS_SUCCESS: 'FETCH_POSTS_SUCCESS',
  FETCH_POSTS_FAILURE: 'FETCH_POSTS_FAILURE',
  LIKE_POST: 'LIKE_POST',
  CREATE_POST: 'CREATE_POST'
};

export const feedReducer = (state = initialState, action) => {
  switch (action.type) {
    case feedActions.FETCH_POSTS_REQUEST:
      return { ...state, loading: true };
    case feedActions.FETCH_POSTS_SUCCESS:
      return { 
        ...state, 
        loading: false, 
        posts: action.payload 
      };
    case feedActions.FETCH_POSTS_FAILURE:
      return { 
        ...state, 
        loading: false, 
        error: action.payload 
      };
    case feedActions.LIKE_POST:
      return {
        ...state,
        posts: state.posts.map(post => 
          post.id === action.payload 
            ? { ...post, likes: post.likes + 1 } 
            : post
        )
      };
    case feedActions.CREATE_POST:
      return {
        ...state,
        posts: [action.payload, ...state.posts]
      };
    default:
      return state;
  }
};