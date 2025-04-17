import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RatingBar = ({ star, count, total }) => {
  const percentage = (count / total) * 100;

  return (
    <View style={styles.container}>
      <Text style={styles.starText}>{star}</Text>
      <View style={styles.barContainer}>
        <View style={[styles.bar, { width: `${percentage}%` }]} />
      </View>
      <Text style={styles.countText}>{count}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  starText: {
    width: 20,
    textAlign: 'center',
    marginRight: 8,
  },
  barContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E5EA',
    borderRadius: 4,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    backgroundColor: '#FFD700',
  },
  countText: {
    marginLeft: 8,
    width: 30,
    textAlign: 'right',
  },
});

export default RatingBar;
