import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useTheme } from '@react-navigation/native';

const VideoScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('Lives');

  // Fonction pour démarrer un live
  const startLive = () => {
    console.log('Démarrage du live...');
    // Utilisons une approche différente pour la navigation
    navigation.push('StartLive');
  };

  // Header avec bouton de live et bouton de retour
  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
      </TouchableOpacity>
      <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Vidéos</Text>
      <TouchableOpacity 
        style={styles.startLiveButton}
        onPress={startLive}
      >
        <Ionicons name="radio" size={16} color="white" style={styles.liveIcon} />
        <Text style={styles.startLiveText}>Démarrer</Text>
      </TouchableOpacity>
    </View>
  );

  // Données de test pour les lives
  const liveStreams = [
    {
      id: 'live1',
      title: ' Live Gaming - Fortnite',
      viewers: '1.2K',
      streamer: 'GameMaster',
      thumbnail: 'https://picsum.photos/300/204'
    },
    {
      id: 'live2',
      title: ' Concert Live',
      viewers: '3.4K',
      streamer: 'MusicLover',
      thumbnail: 'https://picsum.photos/300/205'
    }
  ];

  // Données de test pour les vidéos
  const videos = [
    { 
      id: '1', 
      title: 'Comment faire une délicieuse recette', 
      duration: '3:45',
      views: '1.2M',
      author: 'CuisineExpress',
      thumbnail: 'https://picsum.photos/300/200'
    },
    { 
      id: '2', 
      title: 'Tutoriel maquillage naturel', 
      duration: '2:30',
      views: '856K',
      author: 'BeautyTips',
      thumbnail: 'https://picsum.photos/300/201'
    },
    { 
      id: '3', 
      title: 'Voyage à Paris', 
      duration: '4:15',
      views: '2.1M',
      author: 'TravelWorld',
      thumbnail: 'https://picsum.photos/300/202'
    },
    { 
      id: '4', 
      title: 'Exercices fitness à la maison', 
      duration: '5:00',
      views: '987K',
      author: 'FitnessPro',
      thumbnail: 'https://picsum.photos/300/203'
    },
  ];

  const categories = ['Lives', 'Tendances'];

  const renderCategory = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.categoryItem,
        selectedCategory === item && styles.selectedCategory
      ]}
      onPress={() => setSelectedCategory(item)}
    >
      <Text style={[
        styles.categoryText,
        selectedCategory === item && styles.selectedCategoryText
      ]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  const renderLiveStream = ({ item }) => (
    <TouchableOpacity style={styles.liveItem}>
      <View style={styles.videoThumbnail}>
        <Image 
          source={{ uri: item.thumbnail }} 
          style={styles.thumbnail}
        />
        <View style={styles.liveBadge}>
          <Text style={styles.liveText}>LIVE</Text>
        </View>
        <View style={styles.viewersBadge}>
          <Ionicons name="eye-outline" size={16} color="white" />
          <Text style={styles.viewersText}>{item.viewers}</Text>
        </View>
      </View>
      <View style={styles.videoInfo}>
        <Text style={[styles.videoTitle, { color: theme.colors.text }]} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.videoMeta}>{item.streamer}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderVideo = ({ item }) => (
    <TouchableOpacity style={styles.videoItem}>
      <View style={styles.videoThumbnail}>
        <Image 
          source={{ uri: item.thumbnail }} 
          style={styles.thumbnail}
        />
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{item.duration}</Text>
        </View>
      </View>
      <View style={styles.videoInfo}>
        <Text style={[styles.videoTitle, { color: theme.colors.text }]} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.videoMeta}>{item.views} vues • {item.author}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {renderHeader()}
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={item => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesList}
      />
      {selectedCategory === 'Lives' ? (
        <FlatList
          data={liveStreams}
          renderItem={renderLiveStream}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList
          data={videos}
          renderItem={renderVideo}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
        />
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
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 10,
  },
  startLiveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF4B4B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  liveIcon: {
    marginRight: 5,
  },
  startLiveText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  categoriesList: {
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  categoryItem: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  selectedCategory: {
    backgroundColor: '#007AFF',
  },
  categoryText: {
    fontSize: 16,
    color: '#666',
  },
  selectedCategoryText: {
    color: 'white',
    fontWeight: '500',
  },
  videoItem: {
    marginBottom: 20,
  },
  liveItem: {
    marginBottom: 20,
  },
  videoThumbnail: {
    position: 'relative',
    width: '100%',
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  liveBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#FF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  liveText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  viewersBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewersText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 4,
  },
  durationText: {
    color: 'white',
    fontSize: 12,
  },
  videoInfo: {
    padding: 10,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  videoMeta: {
    fontSize: 14,
    color: '#666',
  },
});

export default VideoScreen;
