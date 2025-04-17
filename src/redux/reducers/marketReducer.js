const initialState = {
  products: [],
  cart: [],
  groupBuys: [],
  loading: false,
  error: null,
  hasMore: true
};

export const marketActions = {
  FETCH_PRODUCTS_REQUEST: 'FETCH_PRODUCTS_REQUEST',
  FETCH_PRODUCTS_SUCCESS: 'FETCH_PRODUCTS_SUCCESS',
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  JOIN_GROUP_BUY: 'JOIN_GROUP_BUY',
  CREATE_ORDER: 'CREATE_ORDER'
};

export const marketReducer = (state = initialState, action) => {
  switch (action.type) {
    case marketActions.FETCH_PRODUCTS_REQUEST:
      return { ...state, loading: true };
    case marketActions.FETCH_PRODUCTS_SUCCESS:
      return { 
        ...state, 
        loading: false, 
        products: action.payload.newPage 
          ? [...state.products, ...action.payload.products]
          : action.payload.products,
        hasMore: action.payload.products.length > 0
      };
    case marketActions.ADD_TO_CART:
      return {
        ...state,
        cart: [...state.cart, action.payload]
      };
    case marketActions.REMOVE_FROM_CART:
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload.id)
      };
    case marketActions.JOIN_GROUP_BUY:
      return {
        ...state,
        groupBuys: [...state.groupBuys, action.payload]
      };
    case marketActions.CREATE_ORDER:
      return {
        ...state,
        cart: []
      };
    default:
      return state;
  }
};