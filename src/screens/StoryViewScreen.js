import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Animated,
  StatusBar,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

const { width, height } = Dimensions.get('window');
const PROGRESS_BAR_WIDTH = width - 40;
const STORY_DURATION = 5000; // 5 seconds per story

const StoryViewScreen = ({ route, navigation }) => {
  const { theme } = useTheme();
  const { stories, initialIndex } = route.params;
  const [currentIndex, setCurrentIndex] = useState(initialIndex || 0);
  const [paused, setPaused] = useState(false);
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const [startTime, setStartTime] = useState(0);
  const [remainingTime, setRemainingTime] = useState(STORY_DURATION);

  const nextStory = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.goBack();
    }
  }, [currentIndex, stories.length, navigation]);

  const previousStory = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  const startProgressAnimation = useCallback(() => {
    if (paused) return;

    progressAnimation.setValue(0);
    setStartTime(Date.now());
    setRemainingTime(STORY_DURATION);

    Animated.timing(progressAnimation, {
      toValue: 1,
      duration: remainingTime,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished && !paused) {
        nextStory();
      }
    });
  }, [paused, progressAnimation, remainingTime, nextStory]);

  const pauseStory = useCallback(() => {
    if (!paused) {
      const elapsedTime = Date.now() - startTime;
      setRemainingTime(STORY_DURATION - elapsedTime);
      progressAnimation.stopAnimation();
      setPaused(true);
    }
  }, [paused, startTime, progressAnimation]);

  const resumeStory = useCallback(() => {
    if (paused) {
      setPaused(false);
      startProgressAnimation();
    }
  }, [paused, startProgressAnimation]);

  useEffect(() => {
    startProgressAnimation();
    return () => {
      progressAnimation.stopAnimation();
    };
  }, [currentIndex, startProgressAnimation, progressAnimation]);

  const handlePress = useCallback((event) => {
    const touchX = event.nativeEvent.locationX;
    if (touchX < width / 3) {
      previousStory();
    } else if (touchX > (width * 2) / 3) {
      nextStory();
    }
  }, [previousStory, nextStory]);

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <TouchableWithoutFeedback
        onLongPress={pauseStory}
        onPressOut={resumeStory}
        onPress={handlePress}
      >
        <View style={styles.content}>
          <Image
            source={{ uri: stories[currentIndex].uri }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.header}>
            <View style={styles.progressContainer}>
              {stories.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.progressBar,
                    {
                      backgroundColor: index < currentIndex
                        ? theme?.colors?.primary
                        : 'rgba(255, 255, 255, 0.3)',
                    },
                  ]}
                >
                  {index === currentIndex && (
                    <Animated.View
                      style={[
                        styles.activeProgress,
                        {
                          backgroundColor: theme?.colors?.primary,
                          width: progressAnimation.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0%', '100%'],
                          }),
                        },
                      ]}
                    />
                  )}
                </View>
              ))}
            </View>
            <View style={styles.userInfo}>
              <Image
                source={{ uri: stories[currentIndex].userAvatar }}
                style={styles.avatar}
              />
              <Text style={styles.username}>{stories[currentIndex].username}</Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
  },
  image: {
    width,
    height,
  },
  header: {
    position: 'absolute',
    top: 30,
    left: 0,
    right: 0,
    padding: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  progressBar: {
    height: 2,
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 2,
    overflow: 'hidden',
  },
  activeProgress: {
    height: '100%',
    backgroundColor: '#fff',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  username: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default StoryViewScreen;
