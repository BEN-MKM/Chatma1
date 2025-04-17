import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ImagePlaceholder = ({ size }) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Ionicons name="image-outline" size={size * 0.3} color="#666" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
});

export default ImagePlaceholder;
