import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  FlatList,
  Dimensions,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';

const { width } = Dimensions.get('window');

const MusicPlayer = ({ navigation }) => {
  const theme = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [sound, setSound] = useState(null);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  // Données factices pour la démonstration
  const tracks = [
    {
      id: '1',
      title: 'Titre de la chanson 1',
      artist: 'Artiste 1',
      artwork: 'https://picsum.photos/300/300',
      duration: '3:45',
    },
    {
      id: '2',
      title: 'Titre de la chanson 2',
      artist: 'Artiste 2',
      artwork: 'https://picsum.photos/301/301',
      duration: '4:20',
    },
    // Ajoutez plus de chansons ici
  ];

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const formatTime = (milliseconds) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = ((milliseconds % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handlePlayPause = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const renderTrack = ({ item }) => (
    <TouchableOpacity 
      style={[styles.trackItem, { 
        backgroundColor: currentTrack?.id === item.id ? theme.colors.primary + '20' : 'transparent'
      }]}
      onPress={() => setCurrentTrack(item)}
    >
      <Image source={{ uri: item.artwork }} style={styles.trackArtwork} />
      <View style={styles.trackInfo}>
        <Text style={[styles.trackTitle, { color: theme.colors.text }]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={[styles.trackArtist, { color: theme.colors.text + '80' }]} numberOfLines={1}>
          {item.artist}
        </Text>
      </View>
      <Text style={[styles.trackDuration, { color: theme.colors.text + '60' }]}>
        {item.duration}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Musique</Text>
        <TouchableOpacity onPress={() => navigation.navigate('MusicSearch')}>
          <Ionicons name="search-outline" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      {currentTrack && (
        <View style={styles.playerContainer}>
          <Image 
            source={{ uri: currentTrack.artwork }}
            style={styles.currentArtwork}
          />
          <Text style={[styles.currentTitle, { color: theme.colors.text }]}>
            {currentTrack.title}
          </Text>
          <Text style={[styles.currentArtist, { color: theme.colors.text + '80' }]}>
            {currentTrack.artist}
          </Text>

          <Slider
            style={styles.progressBar}
            value={position}
            maximumValue={duration}
            minimumTrackTintColor={theme.colors.primary}
            maximumTrackTintColor={theme.colors.border}
            thumbTintColor={theme.colors.primary}
            onSlidingComplete={(value) => {
              // Implémenter la logique pour changer la position de la lecture
            }}
          />

          <View style={styles.timeContainer}>
            <Text style={[styles.timeText, { color: theme.colors.text }]}>
              {formatTime(position)}
            </Text>
            <Text style={[styles.timeText, { color: theme.colors.text }]}>
              {formatTime(duration)}
            </Text>
          </View>

          <View style={styles.controls}>
            <TouchableOpacity>
              <Ionicons name="play-skip-back" size={32} color={theme.colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.playButton} onPress={handlePlayPause}>
              <Ionicons 
                name={isPlaying ? "pause" : "play"} 
                size={32} 
                color={theme.colors.text}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="play-skip-forward" size={32} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <FlatList
        data={tracks}
        renderItem={renderTrack}
        keyExtractor={item => item.id}
        style={styles.trackList}
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
  playerContainer: {
    alignItems: 'center',
    padding: 20,
  },
  currentArtwork: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: 12,
    marginBottom: 20,
  },
  currentTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  currentArtist: {
    fontSize: 16,
    marginBottom: 20,
  },
  progressBar: {
    width: '100%',
    height: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
  },
  timeText: {
    fontSize: 12,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    width: '100%',
  },
  playButton: {
    marginHorizontal: 32,
  },
  trackList: {
    flex: 1,
    marginTop: 20,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  trackArtwork: {
    width: 48,
    height: 48,
    borderRadius: 6,
  },
  trackInfo: {
    flex: 1,
    marginLeft: 12,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  trackArtist: {
    fontSize: 14,
    marginTop: 2,
  },
  trackDuration: {
    marginLeft: 12,
    fontSize: 14,
  },
});

export default MusicPlayer;
