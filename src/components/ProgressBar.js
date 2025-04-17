import React from 'react';
import { View, StyleSheet } from 'react-native';

export const ProgressBar = ({ progress, width = '100%', height = 4, color = '#FF4444' }) => {
  return (
    <View style={[styles.container, { width, height }]}>
      <View 
        style={[
          styles.progress, 
          { 
            width: `${Math.min(100, Math.max(0, progress * 100))}%`,
            backgroundColor: color,
            height
          }
        ]} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progress: {
    borderRadius: 2,
  },
});
