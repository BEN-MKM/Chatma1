import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width / 3;

const MediaGalleryScreen = ({ navigation, route }) => {
  const [mediaItems, setMediaItems] = useState([]);
  const [selectedTab, setSelectedTab] = useState('photos'); // photos, videos, documents
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { chatId } = route.params;

  useEffect(() => {
    loadMediaItems();
  }, [selectedTab, loadMediaItems]);

  const loadMediaItems = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simuler le chargement des médias depuis une API
      // À remplacer par votre logique de chargement réelle
      const mockData = Array.from({ length: 20 }, (_, index) => ({
        id: index.toString(),
        type: selectedTab,
        uri: 'https://picsum.photos/200/300?random=' + index,
        timestamp: new Date(Date.now() - index * 86400000).toISOString(),
        size: Math.floor(Math.random() * 10000000),
      }));

      setMediaItems(mockData);
    } catch (error) {
      console.error('Erreur lors du chargement des médias:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedTab]);

  const handleDownload = async (item) => {
    try {
      const permissions = await MediaLibrary.requestPermissionsAsync();
      if (!permissions.granted) {
        alert('Permission de stockage requise');
        return;
      }

      // Télécharger et sauvegarder le fichier
      const asset = await MediaLibrary.createAssetAsync(item.uri);
      await MediaLibrary.createAlbumAsync('ChatMa', asset, false);
      alert('Média sauvegardé dans la galerie');
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      alert('Erreur lors du téléchargement');
    }
  };

  const handleShare = async (item) => {
    try {
      const canShare = await Sharing.isAvailableAsync();
      if (!canShare) {
        alert('Le partage n\'est pas disponible sur cet appareil');
        return;
      }

      await Sharing.shareAsync(item.uri);
    } catch (error) {
      console.error('Erreur lors du partage:', error);
      alert('Erreur lors du partage');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderMediaItem = ({ item }) => (
    <TouchableOpacity
      style={styles.mediaItem}
      onPress={() => {
        setSelectedItem(item);
        setShowModal(true);
      }}
    >
      <Image
        source={{ uri: item.uri }}
        style={styles.mediaItemImage}
        resizeMode="cover"
      />
      {selectedTab === 'videos' && (
        <View style={styles.videoBadge}>
          <Ionicons name="play-circle" size={24} color="white" />
        </View>
      )}
    </TouchableOpacity>
  );

  const renderModal = () => (
    <Modal visible={showModal} transparent={true} animationType="fade">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowModal(false)}
          >
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleDownload(selectedItem)}
            >
              <Ionicons name="download" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleShare(selectedItem)}
            >
              <Ionicons name="share" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        <Image
          source={{ uri: selectedItem?.uri }}
          style={styles.modalImage}
          resizeMode="contain"
        />
        <View style={styles.modalFooter}>
          <Text style={styles.modalDate}>
            {new Date(selectedItem?.timestamp).toLocaleDateString()}
          </Text>
          <Text style={styles.modalSize}>
            {formatFileSize(selectedItem?.size)}
          </Text>
        </View>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Médias Partagés</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'photos' && styles.activeTab]}
          onPress={() => setSelectedTab('photos')}
        >
          <Text style={styles.tabText}>Photos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'videos' && styles.activeTab]}
          onPress={() => setSelectedTab('videos')}
        >
          <Text style={styles.tabText}>Vidéos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'documents' && styles.activeTab]}
          onPress={() => setSelectedTab('documents')}
        >
          <Text style={styles.tabText}>Documents</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#007AFF" />
      ) : (
        <FlatList
          data={mediaItems}
          renderItem={renderMediaItem}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={styles.mediaList}
        />
      )}

      {renderModal()}
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    color: '#666',
    fontSize: 14,
  },
  mediaList: {
    padding: 1,
  },
  mediaItem: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH,
    padding: 1,
  },
  mediaItemImage: {
    width: '100%',
    height: '100%',
  },
  videoBadge: {
    position: 'absolute',
    right: 8,
    bottom: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  closeButton: {
    padding: 8,
  },
  modalActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 16,
  },
  modalImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  modalFooter: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalDate: {
    color: 'white',
  },
  modalSize: {
    color: 'white',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MediaGalleryScreen;
