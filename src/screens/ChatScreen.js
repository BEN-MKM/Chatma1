import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  View, 
  Text, 
  Image, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet,
  TextInput,
  Animated,
  Platform,
  StatusBar,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
  Modal,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Clipboard from 'expo-clipboard';
import { Alert } from 'react-native';

const { width } = Dimensions.get('window');

// Données de test
const mockConversations = [
  {
    id: '1',
    participant: {
      id: 'user1',
      username: 'Alice',
      avatar_url: 'https://i.pravatar.cc/150?img=1',
    },
    lastMessage: {
      content: 'Salut ! Comment ça va ?',
      timestamp: '10:30',
      isRead: false,
    },
    unreadCount: 2,
  },
  {
    id: '2',
    participant: {
      id: 'user2',
      username: 'Bob',
      avatar_url: 'https://i.pravatar.cc/150?img=2',
    },
    lastMessage: {
      content: 'On se voit demain ?',
      timestamp: 'Hier',
      isRead: true,
    },
    unreadCount: 0,
  },
  {
    id: '3',
    participant: {
      id: 'user3',
      username: 'Groupe Amis',
      avatar_url: 'https://i.pravatar.cc/150?img=3',
    },
    lastMessage: {
      content: 'Super idée !',
      timestamp: 'Hier',
      isRead: true,
    },
    unreadCount: 0,
    isGroup: true,
  },
];

const ChatScreen = ({ navigation, route }) => {
  const conversation = route.params.conversation;
  const scrollY = useRef(new Animated.Value(0)).current;
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredConversations, setFilteredConversations] = useState(mockConversations);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [messageText, setMessageText] = useState('');
  const [showAttachMenu, setShowAttachMenu] = useState(false);

  const handleNewChat = () => {
    navigation.navigate('SearchUsers');
  };

  const handleContacts = () => {
    navigation.navigate('Contacts');
  };

  const handleNewGroup = () => {
    navigation.navigate('NewGroupChat');
  };

  const handleFilter = (filter) => {
    setActiveFilter(filter);
    setShowFilters(false);

    let filteredConvs = mockConversations;
    
    if (filter === 'unread') {
      filteredConvs = mockConversations.filter(conv => conv.unreadCount > 0);
    } else if (filter === 'groups') {
      filteredConvs = mockConversations.filter(conv => conv.isGroup);
    }
    
    setFilteredConversations(filteredConvs);
  };

  const handleConversationPress = (conversation) => {
    navigation.navigate('ChatRoom', {
      participant: conversation.participant,
      conversationId: conversation.id
    });
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (!text.trim()) {
      setFilteredConversations(mockConversations);
      return;
    }

    const filtered = mockConversations.filter(conv =>
      conv.participant.username.toLowerCase().includes(text.toLowerCase()) ||
      conv.lastMessage.content.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredConversations(filtered);
  };

  const handleShare = async (message) => {
    try {
      const result = await Share.share({
        message: message.text,
        title: 'Partager le message',
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Partagé avec:', result.activityType);
        } else {
          console.log('Partagé');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Partage annulé');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors du partage');
    }
  };

  const handleCopy = async (message) => {
    try {
      await Clipboard.setStringAsync(message.text);
      Alert.alert('Succès', 'Message copié dans le presse-papiers');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de copier le message');
    }
  };

  const renderConversationItem = ({ item }) => {
    const avatarUri = item.participant.avatar_url || 'https://i.pravatar.cc/150?img=' + item.participant.id;
    
    return (
      <TouchableOpacity
        style={styles.conversationItem}
        onPress={() => {
          navigation.navigate('ChatRoom', {
            participant: {
              id: item.participant.id,
              username: item.participant.username,
              avatar_url: avatarUri
            }
          });
        }}
      >
        <Image
          source={{ uri: avatarUri }}
          style={styles.avatar}
        />
        <View style={styles.conversationContent}>
          <Text style={styles.username}>{item.participant.username}</Text>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage.content}
          </Text>
        </View>
        <View style={styles.conversationMeta}>
          <Text style={styles.timestamp}>{item.lastMessage.timestamp}</Text>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => {
    if (!route.params?.conversation) return null;
    
    const { participant } = route.params.conversation;
    
    return (
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerProfile}
          onPress={() => navigation.navigate('ChatInfo', { participant })}
        >
          <Image 
            source={{ uri: participant?.avatar_url || 'https://via.placeholder.com/40' }}
            style={styles.headerAvatar}
          />
          <View style={styles.headerInfo}>
            <Text style={styles.headerName}>{participant?.username || 'Utilisateur'}</Text>
            <Text style={styles.headerStatus}>En ligne</Text>
          </View>
        </TouchableOpacity>
        
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.navigate('VoiceCall', { participant })}
          >
            <Ionicons name="call" size={24} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.navigate('VideoCall', { participant })}
          >
            <Ionicons name="videocam" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const handleSendMessage = () => {
    // Code pour envoyer le message
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <FlatList
        data={filteredConversations}
        renderItem={renderConversationItem}
        keyExtractor={item => item.id}
        onRefresh={() => {
          setIsRefreshing(true);
          setTimeout(() => setIsRefreshing(false), 1000);
        }}
        refreshing={isRefreshing}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      />
      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={styles.attachButton}
          onPress={() => setShowAttachMenu(true)}
        >
          <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.messageOptionsButton}
          onPress={() => navigation.navigate('MessageOptions')}
        >
          <Ionicons name="ellipsis-horizontal-circle" size={24} color="#007AFF" />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Message"
          value={messageText}
          onChangeText={setMessageText}
          multiline
        />

        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSendMessage}
          disabled={!messageText.trim()}
        >
          <Ionicons
            name="send"
            size={24}
            color={messageText.trim() ? "#007AFF" : "#999"}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const MessageOptionsScreen = ({ route }) => {
  const message = route.params.message;

  return (
    <View style={styles.messageOptions}>
      <TouchableOpacity 
        style={styles.optionButton}
        onPress={() => handleShare(message)}
      >
        <Ionicons name="share-outline" size={24} color="#007AFF" />
        <Text style={styles.optionText}>Partager</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.optionButton}
        onPress={() => handleCopy(message)}
      >
        <Ionicons name="copy-outline" size={24} color="#007AFF" />
        <Text style={styles.optionText}>Copier</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  headerStatus: {
    fontSize: 12,
    color: '#666',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  conversationItem: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  conversationContent: {
    flex: 1,
    marginLeft: 15,
  },
  conversationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  unreadBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#ff3b30',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#eee',
  },
  attachButton: {
    padding: 5,
  },
  messageOptionsButton: {
    padding: 5,
    marginLeft: 10,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  sendButton: {
    padding: 5,
    marginLeft: 10,
  },
  messageOptions: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginHorizontal: 10,
  },
  optionText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#007AFF',
  },
});

export default ChatScreen;
