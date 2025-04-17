import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width / 3;

const SavedPostsScreen = ({ navigation }) => {
  const [activeView, setActiveView] = useState('grid');
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [selectedCollection, setSelectedCollection] = useState(null);

  const [collections] = useState([
    {
      id: '1',
      name: 'Favoris',
      cover: 'https://picsum.photos/500/500?random=1',
      count: 15,
    },
    {
      id: '2',
      name: 'À voir plus tard',
      cover: 'https://picsum.photos/500/500?random=2',
      count: 8,
    },
  ]);

  const [savedPosts] = useState(Array(20).fill(null).map((_, i) => ({
    id: i.toString(),
    image: `https://picsum.photos/500/500?random=${i}`,
    user: {
      username: `user${i}`,
      avatar: `https://i.pravatar.cc/150?img=${i}`,
    },
    caption: 'Description du post...',
    saved: true,
    collection: i % 3 === 0 ? 'Favoris' : i % 3 === 1 ? 'À voir plus tard' : null,
  })));

  const handleCreateCollection = useCallback(() => {
    if (newCollectionName.trim()) {
      // Simuler la création d'une collection
      Alert.alert('Succès', 'Collection créée avec succès');
      setShowCollectionModal(false);
      setNewCollectionName('');
    }
  }, [newCollectionName]);

  const renderGridItem = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('PostDetail', { postId: item.id })}
      style={styles.gridItem}
    >
      <Image source={{ uri: item.image }} style={styles.gridImage} />
      {item.collection && (
        <View style={styles.collectionBadge}>
          <Text style={styles.collectionBadgeText}>{item.collection}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderListItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('PostDetail', { postId: item.id })}
      style={styles.listItem}
    >
      <Image source={{ uri: item.image }} style={styles.listImage} />
      <View style={styles.listContent}>
        <View style={styles.listHeader}>
          <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
          <Text style={styles.username}>{item.user.username}</Text>
        </View>
        <Text numberOfLines={2} style={styles.caption}>
          {item.caption}
        </Text>
        {item.collection && (
          <Text style={styles.collectionName}>
            Collection: {item.collection}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderCollectionItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => setSelectedCollection(item)}
      style={styles.collectionItem}
    >
      <Image source={{ uri: item.cover }} style={styles.collectionCover} />
      <View style={styles.collectionInfo}>
        <Text style={styles.collectionName}>{item.name}</Text>
        <Text style={styles.collectionCount}>{item.count} éléments</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* En-tête */}
      <View style={styles.header}>
        <Text style={styles.title}>Posts Sauvegardés</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            onPress={() => setShowCollectionModal(true)}
            style={styles.headerButton}
          >
            <Ionicons name="add" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveView(prev => 
              prev === 'grid' ? 'list' : prev === 'list' ? 'collections' : 'grid'
            )}
            style={styles.headerButton}
          >
            <Ionicons 
              name={
                activeView === 'grid' ? 'list' :
                activeView === 'list' ? 'albums' : 'grid'
              }
              size={24}
              color="#000"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Contenu principal */}
      {activeView === 'collections' ? (
        <FlatList
          data={collections}
          renderItem={renderCollectionItem}
          keyExtractor={item => item.id}
          numColumns={2}
          columnWrapperStyle={styles.collectionGrid}
        />
      ) : (
        <FlatList
          data={savedPosts}
          renderItem={activeView === 'grid' ? renderGridItem : renderListItem}
          keyExtractor={item => item.id}
          numColumns={activeView === 'grid' ? 3 : 1}
          key={activeView} // Force re-render when view changes
        />
      )}

      {/* Modal de création de collection */}
      <Modal
        visible={showCollectionModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nouvelle Collection</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Nom de la collection"
              value={newCollectionName}
              onChangeText={setNewCollectionName}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setShowCollectionModal(false)}
                style={[styles.modalButton, styles.cancelButton]}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCreateCollection}
                style={[styles.modalButton, styles.createButton]}
              >
                <Text style={styles.createButtonText}>Créer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: 15,
  },
  gridItem: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH,
    padding: 1,
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  collectionBadge: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  collectionBadgeText: {
    color: '#fff',
    fontSize: 10,
  },
  listItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  listImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
  listContent: {
    flex: 1,
    marginLeft: 10,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  username: {
    fontWeight: '600',
  },
  caption: {
    color: '#666',
  },
  collectionGrid: {
    justifyContent: 'space-between',
    padding: 10,
  },
  collectionItem: {
    width: (width - 30) / 2,
    marginBottom: 15,
  },
  collectionCover: {
    width: '100%',
    height: (width - 30) / 2,
    borderRadius: 10,
  },
  collectionInfo: {
    padding: 8,
  },
  collectionName: {
    fontWeight: '600',
    fontSize: 14,
  },
  collectionCount: {
    color: '#666',
    fontSize: 12,
    marginTop: 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    textAlign: 'center',
    color: '#666',
  },
  createButton: {
    backgroundColor: '#0095F6',
  },
  createButtonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SavedPostsScreen;
