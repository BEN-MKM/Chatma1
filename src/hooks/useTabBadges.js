import { useSelector } from 'react-redux';

export const useTabBadges = () => {
  const unreadMessages = useSelector(state => state.chat.unreadCount);
  const notifications = useSelector(state => state.notifications.count);
  const cartItems = useSelector(state => state.market.cart.length);

  return {
    unreadMessages,
    notifications,
    cartItems,
    hasBadges: unreadMessages > 0 || notifications > 0 || cartItems > 0
  };
};