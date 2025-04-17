import React, { memo } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const StoriesList = ({ stories, onStoryPress, isDarkMode }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={[styles.container, isDarkMode && styles.darkContainer]}
    >
      {stories.map((story, index) => (
        <TouchableOpacity
          key={story.id}
          style={styles.storyContainer}
          onPress={() => onStoryPress(story)}
        >
          <LinearGradient
            colors={story.viewed ? ['#8e8e8e', '#8e8e8e'] : ['#833ab4', '#fd1d1d', '#fcb045']}
            style={styles.storyRing}
          >
            <Image
              source={{ uri: story.userAvatar }}
              style={styles.storyAvatar}
            />
          </LinearGradient>
          <Text
            style={[
              styles.username,
              isDarkMode && styles.darkText,
              story.viewed && styles.viewedText
            ]}
            numberOfLines={1}
          >
            {story.username}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 100,
    borderBottomWidth: 0.5,
    borderBottomColor: '#dbdbdb',
  },
  darkContainer: {
    borderBottomColor: '#2d2d2d',
  },
  storyContainer: {
    width: 70,
    alignItems: 'center',
    marginHorizontal: 5,
    marginVertical: 5,
  },
  storyRing: {
    width: 62,
    height: 62,
    borderRadius: 31,
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#fff',
  },
  username: {
    fontSize: 11,
    marginTop: 3,
    textAlign: 'center',
    width: '100%',
  },
  darkText: {
    color: '#fff',
  },
  viewedText: {
    color: '#8e8e8e',
  },
});

export default memo(StoriesList);
