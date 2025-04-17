import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';

const VideoHub = ({ navigation }) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState('trending'); // 'trending', 'live', 'following'

  // Données factices pour la démonstration
  const videos = [
    {
      id: '1',
      thumbnail: 'https://picsum.photos/300/200',
      title: 'Titre de la vidéo 1',
      author: 'Auteur 1',
      views: '1.2K',
      isLive: false,
    },
    {
      id: '2',
      thumbnail: 'https://picsum.photos/300/201',
      title: 'Live Streaming',
      author: 'Auteur 2',
      viewers: '234',
      isLive: true,
    },
    // Ajoutez plus de vidéos ici
  ];

  const renderVideo = ({ item }) => (
    <TouchableOpacity 
      style={styles.videoCard}
      onPress={() => navigation.navigate(item.isLive ? 'LiveStream' : 'VideoPlayer', { video: item })}
    >
      <Image 
        source={{ uri: item.thumbnail }}
        style={styles.thumbnail}
      />
      {item.isLive && (
        <View style={styles.liveTag}>
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      )}
      <View style={styles.videoInfo}>
        <Text style={[styles.videoTitle, { color: theme.colors.text }]} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={[styles.videoMeta, { color: theme.colors.text }]}>
          {item.author} • {item.isLive ? `${item.viewers} spectateurs` : `${item.views} vues`}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Vidéos</Text>
        <TouchableOpacity 
          style={styles.goLiveButton}
          onPress={() => navigation.navigate('StartLive')}
        >
          <Ionicons name="radio-outline" size={24} color={theme.colors.primary} />
          <Text style={[styles.goLiveText, { color: theme.colors.primary }]}>Démarrer un live</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'trending' && styles.activeTab]}
          onPress={() => setActiveTab('trending')}
        >
          <Text style={[styles.tabText, { color: theme.colors.text }]}>Tendances</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'live' && styles.activeTab]}
          onPress={() => setActiveTab('live')}
        >
          <Text style={[styles.tabText, { color: theme.colors.text }]}>En direct</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'following' && styles.activeTab]}
          onPress={() => setActiveTab('following')}
        >
          <Text style={[styles.tabText, { color: theme.colors.text }]}>Abonnements</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={videos}
        renderItem={renderVideo}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.videoList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  goLiveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  goLiveText: {
    marginLeft: 8,
    fontWeight: '600',
  },
  tabBar: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
  },
  videoList: {
    padding: 8,
  },
  videoCard: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  thumbnail: {
    width: '100%',
    height: 200,
  },
  liveTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#FF0000',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  liveText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  videoInfo: {
    padding: 12,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  videoMeta: {
    fontSize: 14,
    opacity: 0.8,
  },
});

export default VideoHub;
