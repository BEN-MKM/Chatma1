import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Dimensions,
  Platform,
  Animated,
} from 'react-native';
import { Camera } from 'expo-camera';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import io from 'socket.io-client';

const { width, height } = Dimensions.get('window');

const LiveStreamScreen = ({ route, navigation }) => {
  const { streamTitle, category, isPrivate } = route.params || {};
  const theme = useTheme();
  const cameraRef = useRef(null);
  const socket = useRef(null);
  const scrollViewRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState('front');
  const [isStreaming, setIsStreaming] = useState(false);
  const [flash, setFlash] = useState('off');
  const [zoom, setZoom] = useState(0);
  const [autoFocus, setAutoFocus] = useState('on');
  const [viewerCount, setViewerCount] = useState(0);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('normal');
  const [showControls, setShowControls] = useState(true);

  // Effets disponibles
  const filters = [
    { id: 'normal', name: 'Normal' },
    { id: 'sepia', name: 'Sépia' },
    { id: 'vintage', name: 'Vintage' },
    { id: 'grayscale', name: 'Noir & Blanc' },
    { id: 'brightness', name: 'Lumineux' },
  ];

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();

    // Connexion au serveur de chat
    socket.current = io('http://votre-serveur.com');
    
    socket.current.on('viewerCount', (count) => setViewerCount(count));
    socket.current.on('newLike', () => setLikes(prev => prev + 1));
    socket.current.on('comment', (comment) => {
      setComments(prev => [...prev, comment]);
      scrollViewRef.current?.scrollToEnd({ animated: true });
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    let controlsTimer;
    if (showControls) {
      controlsTimer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }).start(() => setShowControls(false));
      }, 3000);
    }
    return () => clearTimeout(controlsTimer);
  }, [showControls, fadeAnim]);

  const startStream = async () => {
    if (!cameraRef.current) return;
    
    setIsStreaming(true);
    try {
      // Démarrer le streaming
      socket.current.emit('startStream', {
        title: streamTitle,
        category,
        isPrivate,
      });
    } catch (error) {
      console.error('Erreur lors du démarrage du stream:', error);
      alert('Impossible de démarrer le stream');
    }
  };

  const stopStream = () => {
    setIsStreaming(false);
    socket.current.emit('endStream');
    navigation.goBack();
  };

  const toggleCameraType = () => {
    setType(type === 'back' ? 'front' : 'back');
  };

  const toggleFlash = () => {
    setFlash(flash === 'off' ? 'torch' : 'off');
  };

  const handleZoom = (value) => {
    setZoom(Math.max(0, Math.min(1, value)));
  };

  const sendComment = () => {
    if (!newComment.trim()) return;
    
    const comment = {
      id: Date.now(),
      text: newComment,
      user: 'Vous',
      timestamp: new Date().toISOString(),
    };
    
    socket.current.emit('comment', comment);
    setNewComment('');
  };

  const toggleControls = () => {
    setShowControls(true);
    fadeAnim.setValue(1);
  };

  if (hasPermission === null) {
    return <View style={styles.container}><Text>Demande d'accès à la caméra...</Text></View>;
  }
  if (hasPermission === false) {
    return <View style={styles.container}><Text>Pas d'accès à la caméra</Text></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity 
        style={styles.cameraContainer} 
        activeOpacity={1}
        onPress={toggleControls}
      >
        <Camera
          ref={cameraRef}
          style={styles.camera}
          type={type}
          flashMode={flash}
          zoom={zoom}
          autoFocus={autoFocus}
        >
          <Animated.View style={[styles.controls, { opacity: fadeAnim }]}>
            {/* En-tête */}
            <View style={styles.header}>
              <View style={styles.streamInfo}>
                <Text style={styles.streamTitle}>{streamTitle}</Text>
                <View style={styles.statsContainer}>
                  <Ionicons name="eye" size={16} color="white" />
                  <Text style={styles.statsText}>{viewerCount}</Text>
                  <Ionicons name="heart" size={16} color="white" />
                  <Text style={styles.statsText}>{likes}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.endButton} onPress={stopStream}>
                <Text style={styles.endButtonText}>Terminer</Text>
              </TouchableOpacity>
            </View>

            {/* Contrôles de la caméra */}
            <View style={styles.cameraControls}>
              <TouchableOpacity onPress={toggleCameraType}>
                <Ionicons name="camera-reverse" size={30} color="white" />
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleFlash}>
                <Ionicons name={flash === 'off' ? 'flash-off' : 'flash'} size={30} color="white" />
              </TouchableOpacity>
            </View>

            {/* Filtres */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.filtersContainer}
            >
              {filters.map(filter => (
                <TouchableOpacity
                  key={filter.id}
                  style={[
                    styles.filterButton,
                    selectedFilter === filter.id && styles.selectedFilter
                  ]}
                  onPress={() => setSelectedFilter(filter.id)}
                >
                  <Text style={styles.filterText}>{filter.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        </Camera>
      </TouchableOpacity>

      {/* Chat */}
      <BlurView intensity={80} style={styles.chatContainer}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.commentsContainer}
          contentContainerStyle={styles.commentsContent}
        >
          {comments.map(comment => (
            <View key={comment.id} style={styles.commentItem}>
              <Text style={styles.commentUser}>{comment.user}</Text>
              <Text style={styles.commentText}>{comment.text}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Écrivez un commentaire..."
            placeholderTextColor="#999"
            value={newComment}
            onChangeText={setNewComment}
            onSubmitEditing={sendComment}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendComment}>
            <Ionicons name="send" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </BlurView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  controls: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  streamInfo: {
    flex: 1,
  },
  streamTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsText: {
    color: 'white',
    marginLeft: 5,
    marginRight: 15,
  },
  endButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  endButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  filtersContainer: {
    marginBottom: 20,
  },
  filterButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  selectedFilter: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    color: 'white',
  },
  chatContainer: {
    height: height * 0.3,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  commentsContainer: {
    flex: 1,
  },
  commentsContent: {
    padding: 10,
  },
  commentItem: {
    marginBottom: 10,
  },
  commentUser: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  commentText: {
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
  },
  sendButton: {
    padding: 5,
  },
});

export default LiveStreamScreen;
