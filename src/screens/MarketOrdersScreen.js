import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

const STATUS_INFO = {
  [ORDER_STATUS.PENDING]: {
    label: 'En attente',
    color: '#FFA000',
    icon: 'time-outline',
  },
  [ORDER_STATUS.CONFIRMED]: {
    label: 'Confirmé',
    color: '#1976D2',
    icon: 'checkmark-circle-outline',
  },
  [ORDER_STATUS.SHIPPED]: {
    label: 'Expédié',
    color: '#7B1FA2',
    icon: 'airplane-outline',
  },
  [ORDER_STATUS.DELIVERED]: {
    label: 'Livré',
    color: '#4CAF50',
    icon: 'checkmark-done-circle-outline',
  },
  [ORDER_STATUS.CANCELLED]: {
    label: 'Annulé',
    color: '#D32F2F',
    icon: 'close-circle-outline',
  },
};

const MarketOrdersScreen = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState('all');

  // Données de test
  const orders = [
    {
      id: '1',
      date: '2025-02-24',
      status: ORDER_STATUS.DELIVERED,
      total: 499.99,
      items: [
        {
          id: '1',
          name: 'Smartphone XYZ',
          price: 499.99,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        },
      ],
    },
    {
      id: '2',
      date: '2025-02-23',
      status: ORDER_STATUS.SHIPPED,
      total: 199.99,
      items: [
        {
          id: '2',
          name: 'Casque Audio Pro',
          price: 199.99,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        },
      ],
    },
  ];

  const tabs = [
    { id: 'all', label: 'Tout' },
    { id: 'pending', label: 'En attente' },
    { id: 'active', label: 'En cours' },
    { id: 'completed', label: 'Terminé' },
  ];

  const filteredOrders = orders.filter(order => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'pending') return order.status === ORDER_STATUS.PENDING;
    if (selectedTab === 'active') {
      return [ORDER_STATUS.CONFIRMED, ORDER_STATUS.SHIPPED].includes(order.status);
    }
    if (selectedTab === 'completed') {
      return [ORDER_STATUS.DELIVERED, ORDER_STATUS.CANCELLED].includes(order.status);
    }
    return true;
  });

  const renderOrderItem = ({ item }) => {
    const statusInfo = STATUS_INFO[item.status];

    return (
      <TouchableOpacity
        style={styles.orderCard}
        onPress={() => navigation.navigate('OrderDetails', { orderId: item.id })}
      >
        <View style={styles.orderHeader}>
          <Text style={styles.orderDate}>
            Commande du {new Date(item.date).toLocaleDateString()}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.color + '20' }]}>
            <Ionicons name={statusInfo.icon} size={16} color={statusInfo.color} />
            <Text style={[styles.statusText, { color: statusInfo.color }]}>
              {statusInfo.label}
            </Text>
          </View>
        </View>

        <FlatList
          data={item.items}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item: product }) => (
            <View style={styles.productItem}>
              <Image
                source={{ uri: product.image }}
                style={styles.productImage}
                resizeMode="cover"
              />
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>
                  {product.name}
                </Text>
                <Text style={styles.productQuantity}>
                  Quantité: {product.quantity}
                </Text>
                <Text style={styles.productPrice}>
                  {product.price}€
                </Text>
              </View>
            </View>
          )}
          keyExtractor={product => product.id}
          contentContainerStyle={styles.productsContainer}
        />

        <View style={styles.orderFooter}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>{item.total}€</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Mes commandes</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.tabsContainer}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              selectedTab === tab.id && styles.tabActive
            ]}
            onPress={() => setSelectedTab(tab.id)}
          >
            <Text style={[
              styles.tabText,
              selectedTab === tab.id && styles.tabTextActive
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredOrders}
        renderItem={renderOrderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.ordersList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    gap: 12,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
  },
  tabActive: {
    backgroundColor: '#4CAF50',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#fff',
  },
  ordersList: {
    padding: 16,
    gap: 16,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  productsContainer: {
    gap: 12,
  },
  productItem: {
    width: 120,
    marginRight: 12,
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  productInfo: {
    gap: 4,
  },
  productName: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  productQuantity: {
    fontSize: 12,
    color: '#666',
  },
  productPrice: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalLabel: {
    fontSize: 14,
    color: '#666',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});

export default MarketOrdersScreen;
