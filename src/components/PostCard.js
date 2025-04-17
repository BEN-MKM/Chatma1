import React, { memo, useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  Share,
  Platform,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PostCard = ({
  post,
  onLike,
  onComment,
  onShare,
  onBookmark,
  onReaction,
  onUserPress,
  onOptions,
  isDarkMode
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [likeScale] = useState(new Animated.Value(1));
  const [bookmarkScale] = useState(new Animated.Value(1));

  const animateButton = (animatedValue) => {
    Animated.sequence([
      Animated.spring(animatedValue, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(animatedValue, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleLike = () => {
    animateButton(likeScale);
    onLike && onLike(post.id);
  };

  const handleBookmark = () => {
    animateButton(bookmarkScale);
    onBookmark && onBookmark(post.id);
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `Check out this post by ${post.username}!`,
        url: post.imageUrl,
        title: 'Share Post',
      });
      if (result.action === Share.sharedAction) {
        onShare && onShare();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleOptionsPress = () => {
    if (onOptions) {
      onOptions(post);
    }
  };

  return (
    <Animated.View style={[
      styles.container,
      isDarkMode && styles.darkContainer,
      { transform: [{ scale: 1 }] }
    ]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.userInfo} onPress={() => onUserPress && onUserPress(post.user)}>
          <Image 
            source={{ uri: post.userAvatar }} 
            style={styles.avatar}
          />
          <View>
            <Text style={[styles.username, isDarkMode && styles.darkText]}>
              {post.username}
            </Text>
            <Text style={styles.location}>{post.location}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.optionsButton} 
          onPress={handleOptionsPress}
        >
          <Ionicons 
            name="ellipsis-vertical" 
            size={24} 
            color={isDarkMode ? '#fff' : '#000'} 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.imageContainer}>
        {!imageLoaded && (
          <View style={styles.imagePlaceholder}>
            <ActivityIndicator color={isDarkMode ? '#fff' : '#000'} />
          </View>
        )}
        <Image
          source={{ uri: post.imageUrl }}
          style={[styles.postImage, !imageLoaded && { opacity: 0 }]}
          onLoadEnd={() => setImageLoaded(true)}
          resizeMode="cover"
        />
      </View>

      <View style={styles.actions}>
        <View style={styles.leftActions}>
          <Animated.View style={{ transform: [{ scale: likeScale }] }}>
            <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
              <Ionicons
                name={post.isLiked ? "heart" : "heart-outline"}
                size={26}
                color={post.isLiked ? "#e74c3c" : isDarkMode ? '#fff' : '#000'}
              />
            </TouchableOpacity>
          </Animated.View>
          <TouchableOpacity 
            onPress={() => onComment && onComment(post.id)} 
            style={styles.actionButton}
          >
            <Ionicons
              name="chatbubble-outline"
              size={24}
              color={isDarkMode ? '#fff' : '#000'}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
            <Ionicons
              name="paper-plane-outline"
              size={24}
              color={isDarkMode ? '#fff' : '#000'}
            />
          </TouchableOpacity>
        </View>
        <Animated.View style={{ transform: [{ scale: bookmarkScale }] }}>
          <TouchableOpacity onPress={handleBookmark}>
            <Ionicons
              name={post.isBookmarked ? "bookmark" : "bookmark-outline"}
              size={24}
              color={post.isBookmarked ? "#007AFF" : isDarkMode ? '#fff' : '#000'}
            />
          </TouchableOpacity>
        </Animated.View>
      </View>

      <View style={styles.content}>
        <Text style={[styles.likes, isDarkMode && styles.darkText]}>
          {post.likes} likes
        </Text>
        <Text style={[styles.caption, isDarkMode && styles.darkText]}>
          <Text style={styles.username}>{post.username}</Text>{' '}
          {post.caption}
        </Text>
        <TouchableOpacity onPress={() => onComment && onComment(post.id)}>
          <Text style={styles.viewComments}>
            View all {post.comments} comments
          </Text>
        </TouchableOpacity>
        <Text style={styles.timestamp}>{post.timestamp}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal: 10,
  },
  darkContainer: {
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontWeight: '600',
    fontSize: 15,
  },
  location: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  darkText: {
    color: '#fff',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#f0f0f0',
  },
  imagePlaceholder: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
  },
  leftActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginRight: 16,
    padding: 4,
  },
  content: {
    padding: 12,
  },
  likes: {
    fontWeight: '600',
    marginBottom: 6,
    fontSize: 15,
  },
  caption: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  viewComments: {
    color: '#666',
    marginTop: 6,
    fontSize: 14,
  },
  timestamp: {
    color: '#666',
    fontSize: 12,
    marginTop: 6,
  },
  optionsButton: {
    padding: 8,
  },
});

export default memo(PostCard);
