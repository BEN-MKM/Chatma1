import React from 'react';
import {
  TouchableOpacity,
  Animated,
  StyleSheet,
  Pressable,
} from 'react-native';
import * as Haptics from 'expo-haptics';

const AnimatedButton = ({
  onPress,
  style,
  children,
  hapticFeedback = true,
  scale = 0.95,
  disabled = false,
}) => {
  const animation = new Animated.Value(1);

  const handlePressIn = () => {
    if (hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    Animated.spring(animation, {
      toValue: scale,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(animation, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
    >
      <Animated.View
        style={[
          style,
          {
            transform: [{ scale: animation }],
            opacity: disabled ? 0.5 : 1,
          },
        ]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
};

export default AnimatedButton;
