import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
  TextInput,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const PROGRESS_BAR_WIDTH = width - 40;

const StoriesScreen = ({ navigation, route }) => {
  const [currentStory, setCurrentStory] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reply, setReply] = useState('');
  const progressAnim = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  const [stories] = useState([
    {
      id: '1',
      user: {
        id: '1',
        username: 'user1',
        avatar: 'https://i.pravatar.cc/150?img=1',
      },
      media: 'https://picsum.photos/400/800',
      type: 'image',
      duration: 5000,
      seen: false,
      reactions: ['❤️', '👏', '😍'],
      views: 1234,
    },
    // Ajouter plus de stories...
  ]);

  // Wrap nextStory in its own useCallback
  const nextStory = useCallback(() => {
    if (currentStory < stories.length - 1) {
      setCurrentStory(prev => prev + 1);
    } else {
      navigation.goBack();
    }
  }, [currentStory, stories.length, navigation]);

  const startProgress = useCallback(() => {
    progressAnim.setValue(0);
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: stories[currentStory].duration,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished && !paused) {
        nextStory();
      }
    });
  }, [progressAnim, stories, currentStory, paused, nextStory]);

  useEffect(() => {
    startProgress();
    return () => progressAnim.stopAnimation();
  }, [currentStory, progressAnim, startProgress]);

  const handlePress = useCallback((evt) => {
    const x = evt.nativeEvent.locationX;
    
    if (x < width / 3) {
      if (currentStory > 0) {
        setCurrentStory(prev => prev - 1);
      }
    } else {
      nextStory();
    }
  }, [currentStory, nextStory]);

  const handlePressIn = () => {
    setPaused(true);
    progressAnim.stopAnimation();
  };

  const handlePressOut = () => {
    setPaused(false);
    startProgress();
  };

  const handleReaction = (reaction) => {
    Animated.sequence([
      Animated.spring(scale, {
        toValue: 1.2,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
    // Envoyer la réaction au serveur
  };

  const handleReply = () => {
    if (reply.trim()) {
      // Envoyer la réponse au serveur
      setReply('');
    }
  };

  return (
    <View style={styles.container}>
      {/* Barre de progression */}
      <View style={styles.progressContainer}>
        {stories.map((story, index) => (
          <View key={story.id} style={styles.progressBar}>
            <Animated.View 
              style={[
                styles.progress,
                {
                  width: index === currentStory 
                    ? progressAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%'],
                      })
                    : index < currentStory ? '100%' : '0%',
                },
              ]}
            />
          </View>
        ))}
      </View>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image 
            source={{ uri: stories[currentStory].user.avatar }}
            style={styles.avatar}
          />
          <Text style={styles.username}>{stories[currentStory].user.username}</Text>
          <Text style={styles.time}>Il y a 2h</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Contenu de la story */}
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        style={styles.content}
      >
        <Image
          source={{ uri: stories[currentStory].media }}
          style={styles.media}
          resizeMode="cover"
        />
      </TouchableOpacity>

      {/* Réactions rapides */}
      <View style={styles.reactionsContainer}>
        {stories[currentStory].reactions.map((reaction, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleReaction(reaction)}
          >
            <Animated.Text
              style={[
                styles.reaction,
                { transform: [{ scale }] }
              ]}
            >
              {reaction}
            </Animated.Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Input de réponse */}
      <View style={styles.replyContainer}>
        <TextInput
          style={styles.replyInput}
          placeholder="Répondre..."
          placeholderTextColor="#fff"
          value={reply}
          onChangeText={setReply}
        />
        <TouchableOpacity 
          style={styles.sendButton}
          onPress={handleReply}
        >
          <Ionicons name="paper-plane" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  progressBar: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 2,
  },
  progress: {
    height: '100%',
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  username: {
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 10,
  },
  time: {
    color: '#fff',
    opacity: 0.7,
  },
  content: {
    flex: 1,
  },
  media: {
    width: '100%',
    height: '100%',
  },
  reactionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  reaction: {
    fontSize: 24,
  },
  replyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  replyInput: {
    flex: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingHorizontal: 15,
    color: '#fff',
    marginRight: 10,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0095F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default StoriesScreen;
