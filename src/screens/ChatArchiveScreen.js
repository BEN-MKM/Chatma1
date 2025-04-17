import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatArchiveScreen = ({ navigation }) => {
  const [archivedChats, setArchivedChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadArchivedChats = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simuler le chargement depuis une API
      // À remplacer par votre logique de chargement réelle
      const mockData = [
        {
          id: '1',
          username: 'Alice Martin',
          avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
          lastMessage: 'Merci pour votre aide !',
          timestamp: '2025-02-20T10:30:00Z',
          unreadCount: 0,
        },
        {
          id: '2',
          username: 'Bob Durant',
          avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
          lastMessage: 'À la prochaine fois',
          timestamp: '2025-02-19T15:45:00Z',
          unreadCount: 2,
        },
      ];
      
      setArchivedChats(mockData);
    } catch (error) {
      console.error('Erreur lors du chargement des conversations archivées:', error);
      Alert.alert('Erreur', 'Impossible de charger les conversations archivées');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadArchivedChats();
  }, [loadArchivedChats]);

  const handleUnarchive = useCallback(async (chatId) => {
    Alert.alert(
      'Désarchiver la conversation',
      'Voulez-vous désarchiver cette conversation ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Désarchiver',
          onPress: async () => {
            try {
              // Simuler l'appel API pour désarchiver
              // À remplacer par votre logique de désarchivage réelle
              setArchivedChats(current =>
                current.filter(chat => chat.id !== chatId)
              );
              
              Alert.alert('Succès', 'Conversation désarchivée');
            } catch (error) {
              console.error('Erreur lors du désarchivage:', error);
              Alert.alert('Erreur', 'Impossible de désarchiver la conversation');
            }
          },
        },
      ],
    );
  }, []);

  const handleChatPress = useCallback((chat) => {
    navigation.navigate('ChatRoom', {
      chatId: chat.id,
      title: chat.username,
      avatar: chat.avatar,
    });
  }, [navigation]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Hier';
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'long' });
    } else {
      return date.toLocaleDateString();
    }
  };

  const renderChatItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => handleChatPress(item)}
    >
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: item.avatar }}
          style={styles.avatar}
        />
      </View>
      
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.username}>{item.username}</Text>
          <Text style={styles.timestamp}>{formatDate(item.timestamp)}</Text>
        </View>
        
        <View style={styles.chatFooter}>
          <Text 
            style={styles.lastMessage}
            numberOfLines={1}
          >
            {item.lastMessage}
          </Text>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>

      <TouchableOpacity
        style={styles.unarchiveButton}
        onPress={() => handleUnarchive(item.id)}
      >
        <Ionicons name="archive-outline" size={24} color="#007AFF" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Conversations Archivées</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#007AFF" />
      ) : archivedChats.length > 0 ? (
        <FlatList
          data={archivedChats}
          renderItem={renderChatItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="archive" size={48} color="#ccc" />
          <Text style={styles.emptyStateText}>
            Aucune conversation archivée
          </Text>
        </View>
      )}
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  list: {
    padding: 8,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginVertical: 4,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  chatFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  unarchiveButton: {
    padding: 8,
    marginLeft: 8,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});

export default ChatArchiveScreen;
