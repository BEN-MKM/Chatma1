import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  Modal,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as Contacts from 'expo-contacts';
import { Camera } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { chatService } from '../services/ChatService';
import supabase from '../config/supabase';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

// Composant pour afficher un code QR
const QRCodeDisplay = React.memo(({ value }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const { theme } = useTheme();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return (
      <View style={[styles.qrContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={[styles.qrContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.text }}>Pas d'accès à la caméra</Text>
      </View>
    );
  }

  return (
    <View style={[styles.qrContainer, { backgroundColor: theme.colors.background }]}>
      <Camera
        type={Camera.Constants.Type.back}
        style={{
          width: 200,
          height: 200,
        }}
        onBarCodeScanned={({ type, data }) => {
          if (data === value) {
            console.log('QR Code valide:', data);
          }
        }}
      />
      <Text style={[styles.qrText, { color: theme.colors.text }]}>{value}</Text>
    </View>
  );
});

const ChatListScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [shareMode, setShareMode] = useState(false);
  const [sharedContent, setSharedContent] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [users, setUsers] = useState([]);
  const [showUserList, setShowUserList] = useState(false);

  // Chargement des conversations
  const loadConversations = useCallback(async () => {
    if (!user) return;
    
    try {
      const data = await chatService.getUserConversations();
      setConversations(data);
    } catch (error) {
      console.error('Erreur chargement conversations:', error);
      Alert.alert('Erreur', 'Impossible de charger les conversations');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]); // Suppression de chatService car c'est une valeur externe

  // Chargement des utilisateurs
  const loadUsers = useCallback(async () => {
    if (!user) return;
    
    try {
      const { userService } = await import('../services/supabaseService');
      const data = await userService.getAllUsers();
      // Filtrer pour ne pas inclure l'utilisateur actuel
      setUsers(data.filter(u => u.id !== user.id));
    } catch (error) {
      console.error('Erreur chargement utilisateurs:', error);
      Alert.alert('Erreur', 'Impossible de charger les utilisateurs');
    }
  }, [user, setUsers]);

  // Création d'une nouvelle conversation
  const startNewConversation = async (otherUser) => {
    try {
      const { roomService } = await import('../services/supabaseService');
      const room = await roomService.createRoom(
        '', // pas de nom pour les conversations privées
        'private',
        user.id,
        [otherUser.id]
      );
      
      setShowUserList(false);
      navigation.navigate('ChatRoom', { roomId: room.id });
    } catch (error) {
      console.error('Erreur création conversation:', error);
      Alert.alert('Erreur', 'Impossible de créer la conversation');
    }
  };

  // Chargement initial des utilisateurs
  useEffect(() => {
    if (user) {
      loadUsers();
    }
  }, [user, loadUsers]);

  // Initialisation du service de chat
  useEffect(() => {
    if (user) {
      chatService.init(user.id);
      loadConversations();

      // Souscription aux changements en temps réel
      const conversationsSubscription = supabase
        .channel('conversations_changes')
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'conversations' },
          () => {
            loadConversations();
          }
        )
        .subscribe();

      return () => {
        chatService.cleanup();
        conversationsSubscription.unsubscribe();
      };
    }
  }, [user, loadConversations]);

  // Rafraîchissement des conversations
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadConversations();
  }, [loadConversations]);

  // Demander la permission pour les contacts
  const requestContactsPermission = useCallback(async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync();
        // Traiter les contacts...
      }
    } catch (error) {
      console.error('Erreur permission contacts:', error);
    }
  }, []);

  // Demander la permission pour la caméra
  const requestCameraPermission = useCallback(async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      if (status === 'granted') {
        setShowScanner(true);
      }
    } catch (error) {
      console.error('Erreur permission caméra:', error);
    }
  }, []);

  // Navigation vers la conversation
  const handleChatPress = useCallback((chat) => {
    navigation.navigate('Chat', {
      chatId: chat.id,
      participants: chat.participants,
      type: chat.type
    });
  }, [navigation]);

  const handleQRCodePress = useCallback(() => {
    navigation.navigate('QRCode');
  }, []);

  const handleSearchPress = useCallback(() => {
    navigation.navigate('GlobalSearch');
  }, [navigation]);

  // Filtrer les conversations
  const filteredConversations = conversations.filter(chat => {
    const searchLower = searchQuery.toLowerCase();
    return (
      chat.title?.toLowerCase().includes(searchLower) ||
      chat.participants.some(p => 
        p.username?.toLowerCase().includes(searchLower) ||
        p.full_name?.toLowerCase().includes(searchLower)
      )
    );
  });

  // Rendu de l'en-tête
  const renderHeader = useCallback(() => (
    <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.searchContainer, { backgroundColor: theme.colors.card }]}>
        <Ionicons
          name="search"
          size={20}
          color={theme.colors.placeholder}
          style={styles.searchIcon}
        />
        <TextInput
          style={[styles.searchInput, { color: theme.colors.text }]}
          placeholder="Rechercher..."
          placeholderTextColor={theme.colors.placeholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <TouchableOpacity
        style={styles.newChatButton}
        onPress={() => setShowUserList(true)}
      >
        <Ionicons name="create-outline" size={24} color={theme.colors.primary} />
      </TouchableOpacity>
    </View>
  ), [navigation, searchQuery, theme.colors]);

  // Rendu d'une conversation
  const renderConversation = useCallback(({ item: chat }) => {
    const lastMessage = chat.last_message;
    const isOnline = chat.type === 'private' && 
      onlineUsers.has(chat.participants[0]?.id);

    return (
      <TouchableOpacity
        style={[
          styles.chatItem,
          { backgroundColor: theme.colors.background }
        ]}
        onPress={() => handleChatPress(chat)}
      >
        <View style={styles.avatarContainer}>
          {chat.type === 'group' ? (
            <View style={[styles.groupAvatar, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.groupAvatarText}>
                {chat.title?.charAt(0).toUpperCase() || 'G'}
              </Text>
            </View>
          ) : (
            <>
              {chat.participants[0]?.avatar_url ? (
                <Image
                  source={{ uri: chat.participants[0].avatar_url }}
                  style={styles.avatar}
                />
              ) : (
                <View style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.border }]}>
                  <Text style={[styles.avatarText, { color: theme.colors.text }]}>
                    {chat.participants[0]?.username?.charAt(0).toUpperCase() || '?'}
                  </Text>
                </View>
              )}
              {isOnline && (
                <View style={[styles.onlineIndicator, { borderColor: theme.colors.background }]} />
              )}
            </>
          )}
        </View>

        <View style={styles.chatInfo}>
          <View style={styles.chatHeader}>
            <Text
              style={[styles.chatTitle, { color: theme.colors.text }]}
              numberOfLines={1}
            >
              {chat.type === 'group'
                ? chat.title
                : chat.participants[0]?.full_name || chat.participants[0]?.username}
            </Text>
            {lastMessage && (
              <Text style={[styles.timestamp, { color: theme.colors.placeholder }]}>
                {formatDistanceToNow(new Date(lastMessage.created_at), {
                  addSuffix: true,
                  locale: fr
                })}
              </Text>
            )}
          </View>

          {lastMessage && (
            <Text
              style={[
                styles.lastMessage,
                { color: theme.colors.placeholder },
                !lastMessage.read && styles.unreadMessage
              ]}
              numberOfLines={2}
            >
              {lastMessage.content}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  }, [handleChatPress, onlineUsers, theme.colors]);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {renderHeader()}
      <FlatList
        data={filteredConversations}
        renderItem={renderConversation}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.colors.placeholder }]}>
              {searchQuery
                ? 'Aucune conversation trouvée'
                : 'Commencez une nouvelle conversation !'}
            </Text>
          </View>
        }
      />

      <Modal
        visible={showOptions}
        transparent
        animationType="fade"
        onRequestClose={() => setShowOptions(false)}
      >
        <BlurView
          style={styles.modalOverlay}
          intensity={80}
          tint={theme.dark ? 'dark' : 'light'}
        >
          <View style={[styles.optionsContainer, { backgroundColor: theme.colors.card }]}>
            <TouchableOpacity
              style={styles.optionItem}
              onPress={() => {
                setShowOptions(false);
                requestContactsPermission();
              }}
            >
              <Ionicons name="people" size={24} color={theme.colors.primary} />
              <Text style={[styles.optionText, { color: theme.colors.text }]}>
                Inviter des contacts
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionItem}
              onPress={() => {
                setShowOptions(false);
                setShowQRCode(true);
              }}
            >
              <Ionicons name="qr-code" size={24} color={theme.colors.primary} />
              <Text style={[styles.optionText, { color: theme.colors.text }]}>
                Mon QR Code
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionItem}
              onPress={() => {
                setShowOptions(false);
                requestCameraPermission();
              }}
            >
              <Ionicons name="scan" size={24} color={theme.colors.primary} />
              <Text style={[styles.optionText, { color: theme.colors.text }]}>
                Scanner un QR Code
              </Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Modal>

      <Modal
        visible={showQRCode}
        transparent
        animationType="slide"
        onRequestClose={() => setShowQRCode(false)}
      >
        <BlurView
          style={styles.modalOverlay}
          intensity={80}
          tint={theme.dark ? 'dark' : 'light'}
        >
          <View style={[styles.qrContainer, { backgroundColor: theme.colors.card }]}>
            <QRCodeDisplay value={user?.id} />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowQRCode(false)}
            >
              <Text style={[styles.closeButtonText, { color: theme.colors.primary }]}>
                Fermer
              </Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Modal>

      {/* Modal Liste des utilisateurs */}
      <Modal
        visible={showUserList}
        transparent
        animationType="fade"
        onRequestClose={() => setShowUserList(false)}
      >
        <BlurView
          style={styles.modalOverlay}
          intensity={80}
          tint={theme.dark ? 'dark' : 'light'}
        >
          <View style={[styles.userListContainer, { backgroundColor: theme.colors.card }]}>
            <View style={styles.userListHeader}>
              <Text style={[styles.userListTitle, { color: theme.colors.text }]}>
                Nouvelle conversation
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowUserList(false)}
              >
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={users}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.userItem, { borderBottomColor: theme.colors.border }]}
                  onPress={() => startNewConversation(item)}
                >
                  <View style={styles.avatarContainer}>
                    {item.avatar_url ? (
                      <Image
                        source={{ uri: item.avatar_url }}
                        style={styles.avatar}
                      />
                    ) : (
                      <View
                        style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.primary }]}
                      >
                        <Text style={[styles.avatarText, { color: '#FFF' }]}>
                          {item.username?.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                    )}
                    {item.status === 'online' && (
                      <View style={styles.onlineIndicator} />
                    )}
                  </View>
                  <View style={styles.userInfo}>
                    <Text style={[styles.username, { color: theme.colors.text }]}>
                      {item.username}
                    </Text>
                    <Text style={[styles.lastSeen, { color: theme.colors.text }]}>
                      {item.last_seen
                        ? `Vu ${formatDistanceToNow(new Date(item.last_seen), {
                            addSuffix: true,
                            locale: fr,
                          })}`
                        : ''}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </BlurView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  userListContainer: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  userListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  userListTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  userItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  lastSeen: {
    fontSize: 12,
    opacity: 0.7,
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginRight: 12,
    height: 36,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  newChatButton: {
    padding: 8,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '600',
  },
  groupAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupAvatarText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '600',
  },
  onlineIndicator: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#34C759',
    borderWidth: 2,
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
  chatTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  timestamp: {
    fontSize: 12,
  },
  lastMessage: {
    fontSize: 14,
    lineHeight: 20,
  },
  unreadMessage: {
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsContainer: {
    width: '80%',
    borderRadius: 12,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  optionText: {
    fontSize: 16,
    marginLeft: 12,
  },
  qrContainer: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  qrText: {
    fontSize: 16,
    marginTop: 12,
  },
  closeButton: {
    marginTop: 20,
    padding: 12,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ChatListScreen;
