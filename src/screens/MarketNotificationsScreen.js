import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const NOTIFICATION_TYPES = {
  ORDER: 'order',
  MESSAGE: 'message',
  PROMOTION: 'promotion',
  REVIEW: 'review',
  SYSTEM: 'system',
};

const MarketNotificationsScreen = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  
  // Données de test
  const [notifications] = useState([
    {
      id: '1',
      type: NOTIFICATION_TYPES.ORDER,
      title: 'Nouvelle commande',
      message: 'Vous avez reçu une nouvelle commande #CMD123',
      timestamp: '2025-02-24T10:30:00',
      read: false,
      data: {
        orderId: 'CMD123',
      },
    },
    {
      id: '2',
      type: NOTIFICATION_TYPES.MESSAGE,
      title: 'Nouveau message',
      message: 'Sophie vous a envoyé un message concernant sa commande',
      timestamp: '2025-02-24T09:15:00',
      read: true,
      data: {
        chatId: 'CHAT456',
      },
    },
    {
      id: '3',
      type: NOTIFICATION_TYPES.PROMOTION,
      title: 'Promotion terminée',
      message: 'Votre promotion "Soldes d\'hiver" est terminée',
      timestamp: '2025-02-23T18:45:00',
      read: true,
      data: {
        promotionId: 'PROMO789',
      },
    },
    {
      id: '4',
      type: NOTIFICATION_TYPES.REVIEW,
      title: 'Nouvel avis',
      message: 'Un client a laissé un avis 5 étoiles',
      timestamp: '2025-02-23T15:20:00',
      read: false,
      data: {
        reviewId: 'REV101',
      },
    },
  ]);

  const tabs = [
    { id: 'all', label: 'Tout' },
    { id: 'orders', label: 'Commandes' },
    { id: 'messages', label: 'Messages' },
    { id: 'promotions', label: 'Promotions' },
  ];

  const getNotificationIcon = (type) => {
    switch (type) {
      case NOTIFICATION_TYPES.ORDER:
        return { name: 'cart-outline', color: '#4CAF50' };
      case NOTIFICATION_TYPES.MESSAGE:
        return { name: 'chatbubble-outline', color: '#2196F3' };
      case NOTIFICATION_TYPES.PROMOTION:
        return { name: 'pricetag-outline', color: '#FF9800' };
      case NOTIFICATION_TYPES.REVIEW:
        return { name: 'star-outline', color: '#FFC107' };
      case NOTIFICATION_TYPES.SYSTEM:
        return { name: 'information-circle-outline', color: '#607D8B' };
      default:
        return { name: 'notifications-outline', color: '#9E9E9E' };
    }
  };

  const handleNotificationPress = (notification) => {
    switch (notification.type) {
      case NOTIFICATION_TYPES.ORDER:
        navigation.navigate('OrderDetails', { orderId: notification.data.orderId });
        break;
      case NOTIFICATION_TYPES.MESSAGE:
        navigation.navigate('MarketChat', { chatId: notification.data.chatId });
        break;
      case NOTIFICATION_TYPES.PROMOTION:
        navigation.navigate('PromotionsManagement', { promotionId: notification.data.promotionId });
        break;
      case NOTIFICATION_TYPES.REVIEW:
        navigation.navigate('MarketReviews', { reviewId: notification.data.reviewId });
        break;
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Simuler un rechargement
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const filteredNotifications = notifications.filter(notification => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'orders') return notification.type === NOTIFICATION_TYPES.ORDER;
    if (selectedTab === 'messages') return notification.type === NOTIFICATION_TYPES.MESSAGE;
    if (selectedTab === 'promotions') return notification.type === NOTIFICATION_TYPES.PROMOTION;
    return true;
  });

  const renderNotification = ({ item: notification }) => {
    const icon = getNotificationIcon(notification.type);
    const timeAgo = new Date(notification.timestamp).toLocaleDateString();

    return (
      <TouchableOpacity
        style={[
          styles.notificationItem,
          !notification.read && styles.unreadNotification,
        ]}
        onPress={() => handleNotificationPress(notification)}
      >
        <View style={[styles.iconContainer, { backgroundColor: icon.color + '20' }]}>
          <Ionicons name={icon.name} size={24} color={icon.color} />
        </View>
        
        <View style={styles.notificationContent}>
          <View style={styles.notificationHeader}>
            <Text style={styles.notificationTitle}>{notification.title}</Text>
            <Text style={styles.timestamp}>{timeAgo}</Text>
          </View>
          <Text style={styles.notificationMessage} numberOfLines={2}>
            {notification.message}
          </Text>
        </View>
        
        {!notification.read && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate('NotificationPreferences')}
        >
          <Ionicons name="settings-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              selectedTab === tab.id && styles.activeTab,
            ]}
            onPress={() => setSelectedTab(tab.id)}
          >
            <Text style={[
              styles.tabText,
              selectedTab === tab.id && styles.activeTabText,
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredNotifications}
        renderItem={renderNotification}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.notificationsList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#4CAF50']}
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  settingsButton: {
    padding: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    gap: 12,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
  },
  activeTab: {
    backgroundColor: '#4CAF50',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
  },
  notificationsList: {
    padding: 16,
    gap: 12,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
    gap: 12,
  },
  unreadNotification: {
    backgroundColor: '#f8f9fa',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
  },
});

export default MarketNotificationsScreen;
