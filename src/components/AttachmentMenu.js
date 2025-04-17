import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MENU_ITEMS = [
  {
    icon: 'image',
    text: 'Photo',
    color: '#4CAF50',
    handler: 'onImagePick'
  },
  {
    icon: 'document',
    text: 'Document',
    color: '#FF9800',
    handler: 'onDocumentPick'
  },
  {
    icon: 'location',
    text: 'Localisation',
    color: '#F44336',
    handler: 'onLocationPick'
  },
  {
    icon: 'person',
    text: 'Contact',
    color: '#2196F3',
    handler: 'onContactPick'
  },
  {
    icon: 'musical-notes',
    text: 'Musique',
    color: '#9C27B0',
    handler: 'onMusicPick'
  },
  {
    icon: 'bar-chart',
    text: 'Sondage',
    color: '#009688',
    handler: 'onPollCreate'
  }
];

const AttachmentMenu = ({
  visible = false,
  onClose = () => {},
  onImagePick = () => {},
  onDocumentPick = () => {},
  onLocationPick = () => {},
  onContactPick = () => {},
  onMusicPick = () => {},
  onPollCreate = () => {},
  attachMenuAnimation = new Animated.Value(0)
}) => {
  const scaleAnimations = useRef(MENU_ITEMS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    if (visible) {
      Animated.stagger(50, [
        Animated.spring(attachMenuAnimation, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 7
        }),
        ...scaleAnimations.map(anim =>
          Animated.spring(anim, {
            toValue: 1,
            useNativeDriver: true,
            tension: 50,
            friction: 7
          })
        )
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(attachMenuAnimation, {
          toValue: 0,
          useNativeDriver: true
        }),
        ...scaleAnimations.map(anim =>
          Animated.spring(anim, {
            toValue: 0,
            useNativeDriver: true
          })
        )
      ]).start();
    }
  }, [visible, attachMenuAnimation, scaleAnimations]);

  const handlers = {
    onImagePick,
    onDocumentPick,
    onLocationPick,
    onContactPick,
    onMusicPick,
    onPollCreate
  };

  const renderMenuItems = (start, end) => (
    <View style={styles.menuRow}>
      {MENU_ITEMS.slice(start, end).map((item, index) => {
        const itemIndex = start + index;
        const handler = handlers[item.handler];
        return (
          <Animated.View
            key={itemIndex}
            style={{
              transform: [{
                scale: scaleAnimations[itemIndex]
              }]
            }}
          >
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                if (handler) {
                  handler();
                  onClose();
                }
              }}
            >
              <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                <Ionicons name={item.icon} size={24} color="#fff" />
              </View>
              <Text style={styles.itemText}>{item.text}</Text>
            </TouchableOpacity>
          </Animated.View>
        );
      })}
    </View>
  );

  if (!visible) return null;

  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.backdrop}>
        <TouchableWithoutFeedback>
          <Animated.View 
            style={[
              styles.container,
              {
                transform: [{
                  translateY: attachMenuAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [300, 0]
                  })
                }],
                opacity: attachMenuAnimation
              }
            ]}
          >
            <View style={styles.handle} />
            {renderMenuItems(0, 3)}
            {renderMenuItems(3, 6)}
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  menuItem: {
    alignItems: 'center',
    width: 80,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default React.memo(AttachmentMenu);
