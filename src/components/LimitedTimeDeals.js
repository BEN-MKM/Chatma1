import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { CountdownTimer } from './CountdownTimer';
import { ProgressBar } from './ProgressBar';

const { width } = Dimensions.get('window');

const LimitedTimeDeals = ({ deals, onDealPress }) => {
  const renderDealItem = ({ item }) => {
    const stockPercentage = (item.currentStock / item.totalStock) * 100;
    
    return (
      <TouchableOpacity 
        style={styles.dealItem}
        onPress={() => onDealPress(item)}
      >
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.infoContainer}>
          <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{item.price}€</Text>
            <Text style={styles.originalPrice}>{item.originalPrice}€</Text>
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>
                -{Math.round((1 - item.price / item.originalPrice) * 100)}%
              </Text>
            </View>
          </View>
          
          <View style={styles.stockInfo}>
            <ProgressBar progress={stockPercentage} />
            <Text style={styles.stockText}>
              {item.currentStock} restants sur {item.totalStock}
            </Text>
          </View>
          
          <View style={styles.timerContainer}>
            <CountdownTimer endTime={item.endTime} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Offres à Durée Limitée</Text>
      <FlatList
        data={deals}
        renderItem={renderDealItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
    marginBottom: 10,
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  dealItem: {
    width: width * 0.6,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: width * 0.4,
    resizeMode: 'cover',
  },
  infoContainer: {
    padding: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF4444',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  discountBadge: {
    backgroundColor: '#FFE8E8',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    color: '#FF4444',
    fontSize: 12,
    fontWeight: '600',
  },
  stockInfo: {
    marginVertical: 8,
  },
  stockText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  timerContainer: {
    alignItems: 'flex-end',
    marginTop: 4,
  },
});

export default LimitedTimeDeals;
