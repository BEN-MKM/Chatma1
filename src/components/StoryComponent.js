import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#6C63FF',
  secondary: '#00D9F5',
  gradient: ['#6C63FF', '#FF6584'],
  text: '#2D3436',
  background: '#F8F9FA',
  white: '#FFFFFF',
};

const StoryComponent = ({ navigation }) => {
  const [stories, setStories] = useState([
    {
      id: '1',
      username: 'Votre story',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      hasStory: false,
      isOwn: true,
    },
    {
      id: '2',
      username: 'Jean',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
      hasStory: true,
      stories: ['https://picsum.photos/400/700'],
    },
    {
      id: '3',
      username: 'Marie',
      avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
      hasStory: true,
      stories: ['https://picsum.photos/400/701'],
    },
  ]);

  const [selectedStory, setSelectedStory] = useState(null);
  const [storyModalVisible, setStoryModalVisible] = useState(false);

  const handleAddStory = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      alert("Vous devez autoriser l'accès à la galerie pour ajouter une story");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [9, 16],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      const newStory = pickerResult.assets[0].uri;
      setStories(prevStories => {
        const updatedStories = [...prevStories];
        if (updatedStories[0].isOwn) {
          updatedStories[0] = {
            ...updatedStories[0],
            hasStory: true,
            stories: [newStory],
          };
        }
        return updatedStories;
      });
    }
  };

  const handleStoryPress = (story) => {
    if (story.isOwn && !story.hasStory) {
      handleAddStory();
    } else {
      setSelectedStory(story);
      setStoryModalVisible(true);
    }
  };

  const renderStoryRing = (story) => (
    <View style={[styles.storyRing, { borderColor: story.hasStory ? COLORS.primary : '#E0E0E0' }]}>
      <View style={styles.storyAvatarContainer}>
        <Image source={{ uri: story.avatar }} style={styles.storyAvatar} />
      </View>
      {story.isOwn && !story.hasStory && (
        <View style={styles.addStoryButton}>
          <View style={styles.addIconContainer}>
            <Ionicons name="add" size={20} color={COLORS.white} />
          </View>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.storiesContainer}
      >
        {stories.map((story) => (
          <TouchableOpacity
            key={story.id}
            style={styles.storyItem}
            onPress={() => handleStoryPress(story)}
          >
            {renderStoryRing(story)}
            <Text style={styles.storyUsername} numberOfLines={1}>
              {story.username}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={storyModalVisible}
        onRequestClose={() => setStoryModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Image
            source={{ uri: selectedStory?.stories[0] }}
            style={styles.storyImage}
            resizeMode="cover"
          />
          <View style={styles.storyHeader}>
            <View style={styles.storyUserInfo}>
              <Image
                source={{ uri: selectedStory?.avatar }}
                style={styles.modalAvatar}
              />
              <Text style={styles.modalUsername}>{selectedStory?.username}</Text>
            </View>
            <TouchableOpacity
              onPress={() => setStoryModalVisible(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={28} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 110,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    paddingVertical: 5,
  },
  storiesContainer: {
    paddingHorizontal: 15,
  },
  storyItem: {
    alignItems: 'center',
    marginRight: 18,
    width: 75,
  },
  storyRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  storyAvatarContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 31,
    padding: 2,
  },
  storyAvatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
  },
  storyUsername: {
    fontSize: 12,
    marginTop: 6,
    color: COLORS.text,
    fontWeight: '500',
  },
  addStoryButton: {
    position: 'absolute',
    bottom: -4,
    right: -4,
  },
  addIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  storyImage: {
    width: width,
    height: '100%',
  },
  storyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 90,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 40,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  storyUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  modalUsername: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    padding: 5,
  },
});

export default StoryComponent;
