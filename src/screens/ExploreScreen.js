import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width / 3;

const ExploreScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('trending');

  const [trending] = useState([
    { id: '1', tag: '#photography', posts: '2.1M' },
    { id: '2', tag: '#travel', posts: '1.8M' },
    { id: '3', tag: '#food', posts: '900K' },
  ]);

  const [posts] = useState(Array(30).fill(null).map((_, i) => ({
    id: i.toString(),
    image: `https://picsum.photos/500/500?random=${i}`,
    likes: Math.floor(Math.random() * 10000),
    comments: Math.floor(Math.random() * 1000),
  })));

  const renderTrendingItem = ({ item }) => (
    <TouchableOpacity style={styles.trendingItem}>
      <Text style={styles.trendingTag}>{item.tag}</Text>
      <Text style={styles.trendingPosts}>{item.posts} posts</Text>
    </TouchableOpacity>
  );

  const renderGridItem = ({ item, index }) => {
    const isLarge = index % 3 === 0;
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('PostDetail', { postId: item.id })}
        style={[
          styles.gridItem,
          isLarge && styles.largeGridItem
        ]}
      >
        <Image
          source={{ uri: item.image }}
          style={[
            styles.gridImage,
            isLarge && styles.largeGridImage
          ]}
        />
        {(item.likes > 5000 || item.comments > 500) && (
          <View style={styles.popularBadge}>
            <Ionicons name="trending-up" size={16} color="#fff" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <>
      {/* Barre de recherche */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Onglets */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
      >
        {['trending', 'photos', 'videos', 'reels', 'shops'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && styles.activeTab
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[
              styles.tabText,
              activeTab === tab && styles.activeTabText
            ]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Tendances */}
      <View style={styles.trendingContainer}>
        <Text style={styles.sectionTitle}>Tendances</Text>
        <FlatList
          data={trending}
          renderItem={renderTrendingItem}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <Text style={styles.sectionTitle}>Explorer</Text>
    </>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderGridItem}
        numColumns={3}
        ListHeaderComponent={renderHeader}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    margin: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  tabsContainer: {
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#f2f2f2',
  },
  activeTab: {
    backgroundColor: '#0095F6',
  },
  tabText: {
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
  },
  trendingContainer: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 10,
    marginVertical: 10,
  },
  trendingItem: {
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    minWidth: 120,
  },
  trendingTag: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  trendingPosts: {
    color: '#666',
    fontSize: 12,
    marginTop: 5,
  },
  gridItem: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH,
    padding: 1,
  },
  largeGridItem: {
    height: ITEM_WIDTH * 2 + 2,
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  largeGridImage: {
    height: '100%',
  },
  popularBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    padding: 4,
  },
});

export default ExploreScreen;
