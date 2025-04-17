import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Share,
  Modal,
  Text,
  Platform,
  Animated,
  Dimensions
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const SHARE_OPTIONS = [
  {
    id: 'direct',
    icon: 'paper-plane-outline',
    label: 'Message direct',
    color: '#007AFF'
  },
  {
    id: 'story',
    icon: 'camera-outline',
    label: 'Story',
    color: '#FF2D55'
  },
  {
    id: 'whatsapp',
    icon: 'logo-whatsapp',
    label: 'WhatsApp',
    color: '#25D366'
  },
  {
    id: 'copy',
    icon: 'copy-outline',
    label: 'Copier le lien',
    color: '#8E8E93'
  }
];

const SocialShare = ({ isVisible, onClose, content, onShare }) => {
  const [animation] = useState(new Animated.Value(0));
  const { height } = Dimensions.get('window');

  useEffect(() => {
    if (isVisible) {
      Animated.spring(animation, {
        toValue: 1,
        useNativeDriver: true,
        tension: 65,
        friction: 11
      }).start();
    } else {
      Animated.spring(animation, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11
      }).start();
    }
  }, [isVisible, animation]);

  const handleShare = async (option) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    switch (option.id) {
      case 'direct':
        onShare?.('direct', content);
        break;
      case 'story':
        onShare?.('story', content);
        break;
      case 'whatsapp':
        try {
          const result = await Share.share({
            message: content.message,
            url: content.url,
            title: content.title
          });
          
          if (result.action === Share.sharedAction) {
            if (result.activityType) {
              console.log('Shared with activity type:', result.activityType);
            } else {
              console.log('Shared');
            }
          }
        } catch (error) {
          console.error('Error sharing:', error);
        }
        break;
      case 'copy':
        Clipboard.setString(content.url);
        // Afficher un toast de confirmation
        break;
    }
    
    onClose();
  };

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [height, 0]
  });

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <BlurView intensity={80} style={styles.backdrop}>
        <TouchableOpacity
          style={styles.dismissArea}
          onPress={onClose}
          activeOpacity={1}
        />
        
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ translateY }]
            }
          ]}
        >
          <View style={styles.header}>
            <View style={styles.indicator} />
            <Text style={styles.title}>Partager</Text>
          </View>

          <View style={styles.optionsContainer}>
            {SHARE_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.option}
                onPress={() => handleShare(option)}
              >
                <View style={[styles.iconContainer, { backgroundColor: option.color }]}>
                  <Ionicons name={option.icon} size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.optionLabel}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  dismissArea: {
    flex: 1,
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  indicator: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E5EA',
    borderRadius: 2,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  option: {
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 15,
    width: 80,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionLabel: {
    fontSize: 12,
    color: '#000000',
    textAlign: 'center',
  },
});

export default SocialShare;
