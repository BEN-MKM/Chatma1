import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  TextInput,
  Modal,
  Share,
  Alert,
  Animated,
  Easing,
  StatusBar,
  Switch,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { useTheme, useNavigation } from '@react-navigation/native';
import PostCard from '../components/PostCard';
import StoryComponent from '../components/StoryComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PostOptionsMenu from '../components/PostOptionsMenu';
import * as Haptics from 'expo-haptics';
import { Image as CacheImage } from 'react-native-expo-image-cache';
import ToastAndroid from '../components/ToastAndroid';

// Cache Manager implementation
const CacheManager = {
  async get(key) {
    try {
      const cached = await AsyncStorage.getItem(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  },
  async set(key, value) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }
};



const REACTIONS = {
  '👍': 'like',
  '❤️': 'love',
  '😂': 'haha',
  '😮': 'wow',
  '😢': 'sad',
  '😡': 'angry'
};

const Story = React.memo(({ story, onPress }) => {
  if (!story?.user) return null;

  return (
    <TouchableOpacity style={styles.storyContainer} onPress={() => onPress(story.user)}>
      <View style={styles.storyAvatarContainer}>
        <Image
          source={{ uri: story.user.avatar }}
          style={styles.storyAvatar}
        />
      </View>
      <Text style={styles.storyUsername} numberOfLines={1}>
        {story.user.name}
      </Text>
    </TouchableOpacity>
  );
});

const PostStats = React.memo(({ post }) => {
  const theme = useTheme();
  
  return (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <Ionicons name="eye-outline" size={16} color={theme.colors.text} />
        <Text style={[styles.statText, { color: theme.colors.text }]}>
          {post.views || 0} vues
        </Text>
      </View>
      <View style={styles.statItem}>
        <Ionicons name="share-outline" size={16} color={theme.colors.text} />
        <Text style={[styles.statText, { color: theme.colors.text }]}>
          {post.shares || 0} partages
        </Text>
      </View>
      <View style={styles.statItem}>
        <Ionicons name="bookmark-outline" size={16} color={theme.colors.text} />
        <Text style={[styles.statText, { color: theme.colors.text }]}>
          {post.saves || 0} enregistrements
        </Text>
      </View>
    </View>
  );
});

const ReactionBar = React.memo(({ post, onReact }) => {
  const [showReactions, setShowReactions] = useState(false);
  const theme = useTheme();

  return (
    <View>
      <TouchableOpacity
        style={styles.reactionButton}
        onPress={() => setShowReactions(!showReactions)}
      >
        <Text style={styles.reactionEmoji}>
          {post.userReaction || '👍'}
        </Text>
      </TouchableOpacity>
      
      {showReactions && (
        <View style={[styles.reactionsContainer, { backgroundColor: theme.colors.card }]}>
          {Object.keys(REACTIONS).map(emoji => (
            <TouchableOpacity
              key={emoji}
              style={styles.reactionOption}
              onPress={() => {
                onReact(post.id, REACTIONS[emoji]);
                setShowReactions(false);
              }}
            >
              <Text style={styles.reactionEmoji}>{emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
});

const Hashtag = React.memo(({ tag, onPress }) => {
  const theme = useTheme();
  return (
    <TouchableOpacity onPress={() => onPress(tag)}>
      <Text style={[styles.hashtag, { color: theme.colors.primary }]}>
        #{tag}
      </Text>
    </TouchableOpacity>
  );
});

const UserMention = React.memo(({ username, onPress }) => {
  const theme = useTheme();
  return (
    <TouchableOpacity onPress={() => onPress(username)}>
      <Text style={[styles.mention, { color: theme.colors.primary }]}>
        @{username}
      </Text>
    </TouchableOpacity>
  );
});

const FilterChip = React.memo(({ label, active, onPress }) => (
  <TouchableOpacity 
    style={[styles.filterChip, active && styles.filterChipActive]}
    onPress={onPress}
  >
    <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
      {label}
    </Text>
  </TouchableOpacity>
));

const SearchBar = React.memo(({ onSearch }) => {
  const theme = useTheme();
  const [searchText, setSearchText] = useState('');

  const handleSearch = useCallback((text) => {
    setSearchText(text);
    onSearch(text);
  }, [onSearch]);

  return (
    <View style={styles.searchContainer}>
      <Ionicons name="search" size={20} color={theme.colors.text} />
      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher..."
        placeholderTextColor={theme.colors.text}
        value={searchText}
        onChangeText={handleSearch}
      />
    </View>
  );
});

const PostSkeleton = () => (
  <View style={styles.skeletonContainer}>
    <View style={styles.skeletonHeader}>
      <View style={styles.skeletonAvatar} />
      <View style={styles.skeletonUsername} />
    </View>
    <View style={styles.skeletonImage} />
    <View style={styles.skeletonActions} />
    <View style={styles.skeletonCaption} />
  </View>
);

const FeedHeader = React.memo(({ onOptionPress, isDarkMode }) => {
  const theme = useTheme();
  const [showOptions, setShowOptions] = useState(false);
  const [selectedSubOption, setSelectedSubOption] = useState(null);

  const options = [
    {
      id: 'layout',
      icon: 'grid-outline',
      label: 'Style d\'affichage',
      subOptions: ['Liste', 'Grille', 'Compact']
    },
    {
      id: 'content',
      icon: 'options-outline',
      label: 'Contenu préféré',
      subOptions: ['Photos', 'Vidéos', 'Texte', 'Tout']
    },
    {
      id: 'autoplay',
      icon: 'play-outline',
      label: 'Lecture automatique',
      toggle: true
    },
    {
      id: 'language',
      icon: 'language-outline',
      label: 'Langue du contenu',
      subOptions: ['Français', 'English', 'Español']
    },
    {
      id: 'notifications',
      icon: 'notifications-outline',
      label: 'Notifications',
      badge: '3',
      subOptions: ['Tous', 'Mentions', 'Aucun']
    },
    {
      id: 'theme',
      icon: isDarkMode ? 'sunny-outline' : 'moon-outline',
      label: 'Apparence',
      subOptions: ['Clair', 'Sombre', 'Système']
    },
    {
      id: 'font',
      icon: 'text-outline',
      label: 'Taille du texte',
      subOptions: ['Petit', 'Moyen', 'Grand']
    },
    {
      id: 'privacy',
      icon: 'shield-checkmark-outline',
      label: 'Confidentialité',
      subOptions: ['Public', 'Amis', 'Privé']
    }
  ];

  const [selectedOptions, setSelectedOptions] = useState({
    layout: 'Liste',
    content: 'Tout',
    autoplay: true,
    language: 'Français',
    notifications: 'Tous',
    theme: isDarkMode ? 'Sombre' : 'Clair',
    font: 'Moyen',
    privacy: 'Public'
  });

  const handleOptionSelect = (optionId, value) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionId]: value
    }));
    onOptionPress(optionId, value);
    setSelectedSubOption(null);
  };

  const handleOptionPress = (option) => {
    if (option.toggle) {
      handleOptionSelect(option.id, !selectedOptions[option.id]);
    } else {
      setSelectedSubOption(option.id);
    }
  };

  return (
    <View style={[styles.headerContainer, { borderBottomColor: theme.colors.border }]}>
      <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Feed</Text>
      <TouchableOpacity
        style={styles.headerButton}
        onPress={() => setShowOptions(true)}
      >
        <Ionicons name="settings-outline" size={24} color={theme.colors.text} />
      </TouchableOpacity>

      <Modal
        visible={showOptions}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setShowOptions(false);
          setSelectedSubOption(null);
        }}
      >
        <TouchableOpacity
          style={styles.optionsOverlay}
          activeOpacity={1}
          onPress={() => {
            setShowOptions(false);
            setSelectedSubOption(null);
          }}
        >
          <TouchableOpacity 
            activeOpacity={1}
            style={[
              styles.optionsMenu,
              { backgroundColor: theme.colors.card }
            ]}
          >
            <View style={styles.optionsHeader}>
              <Text style={[styles.optionsTitle, { color: theme.colors.text }]}>
                {selectedSubOption ? options.find(opt => opt.id === selectedSubOption)?.label : 'Options'}
              </Text>
              <TouchableOpacity 
                onPress={() => {
                  if (selectedSubOption) {
                    setSelectedSubOption(null);
                  } else {
                    setShowOptions(false);
                  }
                }}
              >
                <Ionicons 
                  name={selectedSubOption ? "arrow-back" : "close"} 
                  size={24} 
                  color={theme.colors.text} 
                />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.optionsList}>
              {selectedSubOption ? (
                options.find(opt => opt.id === selectedSubOption)?.subOptions.map((subOption, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.optionItem,
                      selectedOptions[selectedSubOption] === subOption && styles.selectedOption
                    ]}
                    onPress={() => handleOptionSelect(selectedSubOption, subOption)}
                  >
                    <Text style={[
                      styles.optionText,
                      { color: theme.colors.text },
                      selectedOptions[selectedSubOption] === subOption && styles.selectedOptionText
                    ]}>
                      {subOption}
                    </Text>
                    {selectedOptions[selectedSubOption] === subOption && (
                      <Ionicons name="checkmark" size={24} color={theme.colors.primary} />
                    )}
                  </TouchableOpacity>
                ))
              ) : (
                options.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.optionItem}
                    onPress={() => handleOptionPress(option)}
                  >
                    <View style={styles.optionItemContent}>
                      <Ionicons name={option.icon} size={24} color={theme.colors.text} />
                      <Text style={[styles.optionText, { color: theme.colors.text }]}>
                        {option.label}
                      </Text>
                    </View>
                    {option.toggle ? (
                      <Switch
                        value={selectedOptions[option.id]}
                        onValueChange={(value) => handleOptionSelect(option.id, value)}
                        trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                        thumbColor={selectedOptions[option.id] ? theme.colors.background : theme.colors.text}
                      />
                    ) : option.badge ? (
                      <View style={[styles.badge, { backgroundColor: theme.colors.primary }]}>
                        <Text style={styles.badgeText}>{option.badge}</Text>
                      </View>
                    ) : (
                      <View style={styles.optionValue}>
                        <Text style={[styles.optionValueText, { color: theme.colors.text + '80' }]}>
                          {selectedOptions[option.id]}
                        </Text>
                        <Ionicons name="chevron-forward" size={20} color={theme.colors.text + '80'} />
                      </View>
                    )}
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
});

// Composant ActionBar
const ActionBar = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [showPublishOptions, setShowPublishOptions] = useState(false);

  const publishOptions = [
    {
      id: 'photo',
      icon: 'image-outline',
      label: 'Photo',
      onPress: () => {
        navigation.navigate('CreateContent', { type: 'photo' });
        setShowPublishOptions(false);
      }
    },
    {
      id: 'text',
      icon: 'text-outline',
      label: 'Texte',
      onPress: () => {
        navigation.navigate('CreateContent', { type: 'text' });
        setShowPublishOptions(false);
      }
    },
    {
      id: 'story',
      icon: 'camera-outline',
      label: 'Story (visible 24h)',
      onPress: () => {
        navigation.navigate('CreateContent', { type: 'story' });
        setShowPublishOptions(false);
      }
    },
    {
      id: 'music',
      icon: 'musical-notes-outline',
      label: 'Musique',
      onPress: () => {
        navigation.navigate('CreateContent', { type: 'music' });
        setShowPublishOptions(false);
      }
    }
  ];

  return (
    <View style={styles.publishButtonsContainer}>
      <TouchableOpacity 
        style={styles.publishButton}
        onPress={() => navigation.navigate('CreateContent')}
      >
        <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
        <Text style={styles.publishButtonText}>Publier</Text>
      </TouchableOpacity>

      <View style={styles.buttonSeparator} />

      <TouchableOpacity 
        style={styles.publishButton}
        onPress={() => navigation.navigate('Video')}
      >
        <Ionicons name="videocam-outline" size={24} color="#007AFF" />
        <Text style={styles.publishButtonText}>Vidéo</Text>
      </TouchableOpacity>

      <View style={styles.buttonSeparator} />

      <TouchableOpacity 
        style={styles.publishButton}
        onPress={() => navigation.navigate('Music')}
      >
        <Ionicons name="musical-notes-outline" size={24} color="#007AFF" />
        <Text style={styles.publishButtonText}>Musique</Text>
      </TouchableOpacity>
    </View>
  );
};

const FeedScreen = () => {
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();
  const theme = useTheme();
  const isDarkMode = useColorScheme() === 'dark';
  const [selectedPost, setSelectedPost] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);

  // Animation du header
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [Platform.OS === 'ios' ? 120 : 100, Platform.OS === 'ios' ? 80 : 60],
    extrapolate: 'clamp',
  });

  // Charger les stories
  const loadStories = useCallback(async () => {
    try {
      // Simuler le chargement des stories
      const dummyStories = Array.from({ length: 10 }, (_, i) => ({
        id: `story-${i}`,
        user: {
          id: `user-${i}`,
          name: `user${i}`,
          avatar: `https://randomuser.me/api/portraits/${i % 2 ? 'men' : 'women'}/${(i % 10) + 1}.jpg`,
        },
        viewed: Math.random() > 0.5,
        hasNewStory: true,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 24 * 60 * 60 * 1000)), // Story créée dans les dernières 24h
        expiresAt: new Date(Date.now() + (24 * 60 * 60 * 1000)) // Expire dans 24h
      }));
      setStories(dummyStories);
    } catch (error) {
      console.error('Error loading stories:', error);
    }
  }, []);

  // Charger les posts
  const loadPosts = useCallback(async (page = 1, refresh = false) => {
    if (loading || (!hasMore && !refresh)) return;

    try {
      setLoading(true);
      const newPosts = generateDummyPosts(10);
      
      if (refresh) {
        setPosts(newPosts);
        setCurrentPage(1);
        setHasMore(true);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [loading, hasMore]);

  // Rafraîchir les posts
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadPosts(1, true);
    loadStories();
  }, [loadPosts, loadStories]);

  // Charger plus de posts
  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadPosts(currentPage + 1);
    }
  }, [loading, hasMore, currentPage, loadPosts]);

  // Gérer le commentaire d'un post

  const handleShare = useCallback(async (post) => {
    try {
      const result = await Share.share({
        message: `${post.content}

Partagé depuis ChatMa`,
        title: 'Partager le post',
      });
      
      if (result.action === Share.sharedAction) {
        await addShare(post.id);
      }
    } catch (error) {
      console.error('Error sharing post:', error);
      Alert.alert('Error', 'Failed to share post');
    }
  }, []);

const handleOptionPress = useCallback((post) => {
  const options = ['Signaler', 'Bloquer l\'utilisateur'];
  const destructiveButtonIndex = 1;
  
  if (post.user_id === user.id) {
    options.push('Supprimer');
  }

  showActionSheetWithOptions(
    {
      options,
      destructiveButtonIndex,
      cancelButtonIndex: options.length - 1,
    },
    (buttonIndex) => {
      if (buttonIndex === 0) {
        handleReportPost(post.id);
      } else if (buttonIndex === 1) {
        handleBlockUser(post.user_id);
      } else if (buttonIndex === 2 && post.user_id === user.id) {
        handleDeletePost(post.id);
      }
    }
  );
}, []);

  const renderHeader = useCallback(() => (
    <LinearGradient
      colors={['#007AFF', '#5856D6']}
      style={styles.headerContainer}
    >
      <BlurView intensity={20} style={styles.headerBlur}>
        <SafeAreaView style={styles.headerContent}>
          <Text style={styles.headerTitle}>ChatMa</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity
              style={styles.headerIcon}
              onPress={handleSearchPress}
            >
              <Ionicons name="search" size={24} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerIcon}
              onPress={handleNotificationsPress}
            >
              <Ionicons name="notifications" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </BlurView>
    </LinearGradient>
  ), []);

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error && !refreshing) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Text style={[styles.errorText, { color: theme.colors.text }]}>
          Une erreur est survenue lors du chargement des posts
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadPosts}>
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}
      
      <FlatList
        data={posts.filter(post => !blockedUsers.includes(post.user.id))}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onLike={() => handleLike(item)}
            onComment={() => handleComment(item)}
            onShare={() => handleShare(item)}
            onBookmark={() => handleBookmark(item)}
            onUserPress={() => handleUserPress(item.user)}
            onOptions={() => handleOptionPress(item)}
            isDarkMode={isDarkMode}
            isOwnPost={item.user_id === user.id}
          />
        )}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.text}
          />
        }
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        ListHeaderComponent={
          <View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.storiesContainer}
              contentContainerStyle={styles.storiesContentContainer}
            >
              {stories.map((story) => (
                <StoryComponent
                  key={story.id}
                  story={story}
                  onPress={() => handleUserPress(story.user)}
                  createdAt={story.created_at}
                  expiresAt={story.expires_at}
                />
              ))}
            </ScrollView>
            <ActionBar />
          </View>
        }
        ListHeaderComponentStyle={{ backgroundColor: theme.colors.background }}
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: theme.colors.text }]}>
                Aucun post pour le moment
              </Text>
            </View>
          )
        }
      />

      <PostOptionsMenu
        visible={showOptions}
        onClose={() => setShowOptions(false)}
        onOption={handleOptionSelected}
        post={selectedPost}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingBottom: 20,
    paddingTop: 20,
  },
  headerBlur: {
    paddingTop: 10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  headerTitle: {
    color: 'black',
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  headerIcon: {
    marginLeft: 15,
  },
  publishButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  publishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  publishButtonText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  buttonSeparator: {
    width: 1,
    height: 24,
    backgroundColor: '#eee',
    marginHorizontal: 10,
  },
  // ... (autres styles existants)
});

export default FeedScreen;
