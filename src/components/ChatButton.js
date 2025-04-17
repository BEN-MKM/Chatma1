import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
  View
} from 'react-native';
import { Tooltip } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';

const ChatButton = ({
  onPress,
  icon,
  label,
  tooltipText,
  style,
  disabled = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const scaleAnim = new Animated.Value(1);

  const handlePress = async () => {
    if (disabled || isLoading) return;

    // Animation de pression
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setIsLoading(true);
    try {
      await onPress();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Tooltip
      popover={<Text style={styles.tooltipText}>{tooltipText}</Text>}
      width={200}
      height={40}
      backgroundColor="rgba(0, 0, 0, 0.8)"
      withPointer={true}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          style={[styles.button, style, disabled && styles.disabled]}
          onPress={handlePress}
          disabled={disabled}
          activeOpacity={0.7}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <View style={styles.buttonContent}>
              <Ionicons name={icon} size={24} color="#FFFFFF" />
              {label && <Text style={styles.label}>{label}</Text>}
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    </Tooltip>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#6A5ACD',
    borderRadius: 8,
    padding: 12,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: '#FFFFFF',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  disabled: {
    opacity: 0.5,
  },
  tooltipText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
});

export default ChatButton;
