import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PostDetailScreen = ({ route, navigation }) => {
  const [post, setPost] = useState(route.params?.post || {
    id: '1',
    user: {
      id: '1',
      username: 'username',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    image: 'https://picsum.photos/500/500',
    caption: 'Belle photo #photo #lifestyle',
    likes: 1234,
    comments: [],
    location: 'Paris, France',
    created_at: new Date().toISOString(),
  });
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleLike = useCallback(() => {
    setIsLiked(prev => !prev);
    // API call to update like status
  }, []);

  const handleSave = useCallback(() => {
    setIsSaved(prev => !prev);
    // API call to save/unsave post
  }, []);

  const handleShare = useCallback(async () => {
    try {
      await Share.share({
        message: `Découvrez ce post de ${post.user.username}!`,
        url: post.image,
      });
    } catch (error) {
      console.error(error);
    }
  }, [post]);

  const handleComment = useCallback(() => {
    navigation.navigate('Comments', { postId: post.id });
  }, [navigation, post.id]);

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <ScrollView style={styles.container}>
      {/* En-tête */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.userInfo}
          onPress={() => navigation.navigate('Profile', { userId: post.user.id })}
        >
          <Image source={{ uri: post.user.avatar }} style={styles.avatar} />
          <View>
            <Text style={styles.username}>{post.user.username}</Text>
            {post.location && (
              <Text style={styles.location}>{post.location}</Text>
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={24} color="#262626" />
        </TouchableOpacity>
      </View>

      {/* Image */}
      <Image source={{ uri: post.image }} style={styles.image} />

      {/* Actions */}
      <View style={styles.actions}>
        <View style={styles.leftActions}>
          <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
            <Ionicons 
              name={isLiked ? "heart" : "heart-outline"}
              size={28}
              color={isLiked ? "#ED4956" : "#262626"}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleComment} style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={26} color="#262626" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
            <Ionicons name="paper-plane-outline" size={26} color="#262626" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleSave}>
          <Ionicons 
            name={isSaved ? "bookmark" : "bookmark-outline"}
            size={26}
            color="#262626"
          />
        </TouchableOpacity>
      </View>

      {/* Likes */}
      <Text style={styles.likes}>
        {formatNumber(post.likes)} j'aime
      </Text>

      {/* Caption */}
      <View style={styles.captionContainer}>
        <Text>
          <Text style={styles.username}>{post.user.username}</Text>
          {' '}
          <Text style={styles.caption}>{post.caption}</Text>
        </Text>
      </View>

      {/* Statistiques */}
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{formatNumber(post.likes)}</Text>
          <Text style={styles.statLabel}>Likes</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{formatNumber(post.comments.length)}</Text>
          <Text style={styles.statLabel}>Commentaires</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{formatNumber(1234)}</Text>
          <Text style={styles.statLabel}>Partages</Text>
        </View>
      </View>

      {/* Suggestions */}
      <View style={styles.suggestions}>
        <Text style={styles.suggestionTitle}>Posts similaires</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[1, 2, 3, 4].map(i => (
            <TouchableOpacity key={i} style={styles.suggestionItem}>
              <Image 
                source={{ uri: `https://picsum.photos/200/200?random=${i}` }}
                style={styles.suggestionImage}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
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
    marginRight: 12,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  location: {
    fontSize: 12,
    color: '#666',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginRight: 16,
  },
  likes: {
    fontWeight: '600',
    paddingHorizontal: 12,
  },
  captionContainer: {
    padding: 12,
  },
  caption: {
    fontSize: 14,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#DBDBDB',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  suggestions: {
    padding: 12,
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  suggestionItem: {
    marginRight: 8,
  },
  suggestionImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
});

export default PostDetailScreen;
