import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import supabase from '../config/supabase';
import { useAuth } from '../contexts/AuthContext';
import notificationService from '../services/notificationService';

const NotificationsScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          id,
          type,
          created_at,
          read,
          target_id,
          actor_id,
          body,
          data,
          actor:actor_id (id, username, avatar_url)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notifications:', error);
        return;
      }

      const formattedNotifications = data.map(notification => ({
        id: notification.id,
        type: notification.type,
        user: notification.actor,
        content: notification.body,
        time: new Date(notification.created_at).toLocaleDateString(),
        image: notification.data?.image_url,
        read: notification.read,
        target_id: notification.target_id,
      }));

      setNotifications(formattedNotifications);
    } catch (error) {
      console.error('Error in fetchNotifications:', error);
      Alert.alert('Error', 'Failed to fetch notifications');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user.id]);

  useEffect(() => {
    fetchNotifications();

    // Subscribe to new notifications
    const subscription = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          // Add new notification to the beginning of the list
          const newNotification = {
            id: payload.new.id,
            type: payload.new.type,
            content: payload.new.body,
            time: new Date(payload.new.created_at).toLocaleDateString(),
            read: false,
            target_id: payload.new.target_id,
          };

          // Get user information
          supabase
            .from('users')
            .select('id, username, avatar_url')
            .eq('id', payload.new.actor_id)
            .single()
            .then(({ data }) => {
              if (data) {
                newNotification.user = data;
                setNotifications(prev => [newNotification, ...prev]);
              }
            });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user.id, fetchNotifications]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (notificationId) => {
    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);
    } catch (error) {
      console.error('Erreur lors du marquage de la notification:', error);
    }
  };

  const handleNotificationPress = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }

    switch (notification.type) {
      case 'message':
        navigation.navigate('Chat', { chatId: notification.target_id });
        break;
      case 'mention':
      case 'comment':
      case 'like':
        navigation.navigate('Post', { postId: notification.target_id });
        break;
      case 'follow':
        navigation.navigate('Profile', { userId: notification.actor_id });
        break;
      case 'product':
        navigation.navigate('ProductDetails', { productId: notification.target_id });
        break;
      default:
        console.warn('Unknown notification type:', notification.type);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return <Ionicons name="heart" size={24} color="#ED4956" />;
      case 'follow':
        return <Ionicons name="person-add" size={24} color="#0095F6" />;
      case 'comment':
        return <Ionicons name="chatbubble" size={24} color="#5851DB" />;
      case 'mention':
        return <Ionicons name="at" size={24} color="#F56040" />;
      default:
        return null;
    }
  };

  const renderNotification = ({ item: notification }) => {
    const NotificationIcon = getNotificationIcon(notification.type);
    const formattedTime = formatDistanceToNow(new Date(notification.time), { addSuffix: true });

    return (
      <TouchableOpacity
        style={[styles.notificationItem, !notification.read && styles.unreadNotification]}
        onPress={() => handleNotificationPress(notification)}
      >
        <View style={styles.notificationContent}>
          {notification.user?.avatar_url ? (
            <Image source={{ uri: notification.user.avatar_url }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, { backgroundColor: '#ddd' }]} />
          )}
          <View style={styles.textContainer}>
            <View style={styles.userInfo}>
              <Text style={styles.username}>{notification.user?.username || 'User'}</Text>
              <Text style={styles.content}>{notification.content}</Text>
            </View>
            <Text style={styles.time}>{formattedTime}</Text>
          </View>
          <View style={styles.rightContent}>
            {notification.image && (
              <Image source={{ uri: notification.image }} style={styles.postImage} />
            )}
            {NotificationIcon}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (notifications.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No notifications yet</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        <TouchableOpacity onPress={() => navigation.navigate('NotificationSettings')}>
          <Ionicons name="settings-outline" size={24} color="#666" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingVertical: 5,
  },
  notificationItem: {
    padding: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  unreadNotification: {
    backgroundColor: '#F8F8F8',
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  userInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  username: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  content: {
    color: '#262626',
    flex: 1,
  },
  time: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  postImage: {
    width: 44,
    height: 44,
    borderRadius: 4,
  },
});

export default NotificationsScreen;
