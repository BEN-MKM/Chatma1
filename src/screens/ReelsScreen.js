import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

const { height } = Dimensions.get('window');

const ReelItem = ({ item, isActive }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef(null);
  const likeAnimation = useRef(new Animated.Value(0)).current;

  const handleDoubleTap = () => {
    setIsLiked(true);
    Animated.sequence([
      Animated.spring(likeAnimation, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(likeAnimation, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={{ height, backgroundColor: 'black' }}>
      <Video
        ref={videoRef}
        source={{ uri: item.videoUrl }}
        style={{ flex: 1 }}
        resizeMode="cover"
        isLooping
        isMuted={isMuted}
        shouldPlay={isActive}
      />
      
      {/* Overlay des actions */}
      <View style={styles.overlay}>
        <View style={styles.rightActions}>
          <TouchableOpacity onPress={() => setIsLiked(!isLiked)}>
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={28}
              color={isLiked ? "#ff0000" : "#fff"}
            />
            <Text style={styles.actionText}>{item.likes}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity>
            <Ionicons name="chatbubble-outline" size={28} color="#fff" />
            <Text style={styles.actionText}>{item.comments}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity>
            <Ionicons name="paper-plane-outline" size={28} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => setIsMuted(!isMuted)}>
            <Ionicons
              name={isMuted ? "volume-mute" : "volume-high"}
              size={28}
              color="#fff"
            />
          </TouchableOpacity>
        </View>

        {/* Informations de l'utilisateur */}
        <View style={styles.userInfo}>
          <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
          <Text style={styles.username}>{item.user.username}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <View style={styles.musicInfo}>
            <Ionicons name="musical-note" size={16} color="#fff" />
            <Text style={styles.musicText}>{item.musicName}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const ReelsScreen = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [reels, setReels] = useState([
    // Données de test
    {
      id: '1',
      videoUrl: 'URL_VIDEO',
      user: {
        username: 'user1',
        avatar: 'https://i.pravatar.cc/150?img=1',
      },
      description: 'Description du reel #fun #dance',
      likes: '10.5K',
      comments: '1.2K',
      musicName: 'Nom de la musique - Artiste',
    },
    // Ajoutez plus de reels...
  ]);

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      <FlatList
        data={reels}
        renderItem={({ item, index }) => (
          <ReelItem item={item} isActive={index === activeIndex} />
        )}
        pagingEnabled
        vertical
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
      />
    </View>
  );
};

const styles = {
  overlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    padding: 20,
  },
  rightActions: {
    position: 'absolute',
    right: 10,
    bottom: 100,
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 5,
  },
  userInfo: {
    position: 'absolute',
    left: 10,
    bottom: 20,
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 10,
  },
  username: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    color: '#fff',
    marginBottom: 10,
  },
  musicInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  musicText: {
    color: '#fff',
    marginLeft: 5,
  },
};

export default ReelsScreen;
