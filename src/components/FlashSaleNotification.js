import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const FlashSaleNotification = ({ 
  notification,
  onPress,
  onClose,
  slideAnim = new Animated.Value(0)
}) => {
  useEffect(() => {
    if (notification) {
      Animated.sequence([
        Animated.spring(slideAnim, {
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.delay(5000),
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
        })
      ]).start(() => onClose());
    }
  }, [notification, onClose, slideAnim]);

  if (!notification) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{
            translateY: slideAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [-100, 0]
            })
          }]
        }
      ]}
    >
      <TouchableOpacity 
        style={styles.content}
        onPress={onPress}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="flash" size={24} color="#FFD700" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Vente Flash !</Text>
          <Text style={styles.message} numberOfLines={2}>
            {notification.message}
          </Text>
          {notification.discount && (
            <Text style={styles.discount}>-{notification.discount}%</Text>
          )}
        </View>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={onClose}
        >
          <Ionicons name="close" size={20} color="#666" />
        </TouchableOpacity>
      </TouchableOpacity>
      <View style={styles.timer}>
        <Animated.View 
          style={[
            styles.timerBar,
            {
              width: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%']
              })
            }
          ]}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  content: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
  },
  message: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  discount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF3B30',
    marginTop: 2,
  },
  closeButton: {
    padding: 5,
  },
  timer: {
    height: 2,
    backgroundColor: '#eee',
  },
  timerBar: {
    height: '100%',
    backgroundColor: '#FF3B30',
  },
});

export default FlashSaleNotification;
