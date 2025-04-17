import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useTheme } from '@react-navigation/native';

const MusicScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const [currentTrack, setCurrentTrack] = useState(null);

  const playlists = [
    {
      id: '1',
      title: 'Top Hits',
      image: 'https://picsum.photos/200/200',
      songs: 25
    },
    {
      id: '2',
      title: 'Chill Mix',
      image: 'https://picsum.photos/200/201',
      songs: 18
    },
    {
      id: '3',
      title: 'Workout',
      image: 'https://picsum.photos/200/202',
      songs: 30
    }
  ];

  const songs = [
    {
      id: '1',
      title: 'Summer Vibes',
      artist: 'DJ Cool',
      duration: '3:45',
      image: 'https://picsum.photos/100/100'
    },
    {
      id: '2',
      title: 'Dancing in the Rain',
      artist: 'Music Band',
      duration: '4:20',
      image: 'https://picsum.photos/100/101'
    },
    {
      id: '3',
      title: 'Midnight Dreams',
      artist: 'Night Singer',
      duration: '3:55',
      image: 'https://picsum.photos/100/102'
    },
    {
      id: '4',
      title: 'Happy Days',
      artist: 'Joy Group',
      duration: '3:30',
      image: 'https://picsum.photos/100/103'
    }
  ];

  const renderPlaylist = ({ item }) => (
    <TouchableOpacity style={styles.playlistItem}>
      <Image source={{ uri: item.image }} style={styles.playlistImage} />
      <Text style={[styles.playlistTitle, { color: theme.colors.text }]}>{item.title}</Text>
      <Text style={styles.playlistSongs}>{item.songs} chansons</Text>
    </TouchableOpacity>
  );

  const renderSong = ({ item }) => (
    <TouchableOpacity 
      style={[styles.songItem, currentTrack?.id === item.id && styles.currentSong]}
      onPress={() => setCurrentTrack(item)}
    >
      <Image source={{ uri: item.image }} style={styles.songImage} />
      <View style={styles.songInfo}>
        <Text style={[styles.songTitle, { color: theme.colors.text }]}>{item.title}</Text>
        <Text style={styles.songArtist}>{item.artist}</Text>
      </View>
      <Text style={styles.songDuration}>{item.duration}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Musique</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Vos playlists</Text>
          <FlatList
            data={playlists}
            renderItem={renderPlaylist}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.playlistList}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Chansons populaires</Text>
          <FlatList
            data={songs}
            renderItem={renderSong}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>

      {currentTrack && (
        <View style={styles.player}>
          <Image source={{ uri: currentTrack.image }} style={styles.playerImage} />
          <View style={styles.playerInfo}>
            <Text style={[styles.playerTitle, { color: theme.colors.text }]}>{currentTrack.title}</Text>
            <Text style={styles.playerArtist}>{currentTrack.artist}</Text>
          </View>
          <TouchableOpacity style={styles.playButton}>
            <Ionicons name="play" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      )}
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
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  section: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  playlistList: {
    marginTop: 10,
  },
  playlistItem: {
    width: 150,
    marginRight: 15,
  },
  playlistImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  playlistTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  playlistSongs: {
    fontSize: 14,
    color: '#666',
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
  },
  currentSong: {
    backgroundColor: 'rgba(29, 161, 242, 0.1)',
  },
  songImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  songInfo: {
    flex: 1,
    marginLeft: 15,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  songArtist: {
    fontSize: 14,
    color: '#666',
  },
  songDuration: {
    fontSize: 14,
    color: '#666',
  },
  player: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: 'white',
  },
  playerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  playerInfo: {
    flex: 1,
    marginLeft: 15,
  },
  playerTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  playerArtist: {
    fontSize: 14,
    color: '#666',
  },
  playButton: {
    padding: 10,
  },
});

export default MusicScreen;
