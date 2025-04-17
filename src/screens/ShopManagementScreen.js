import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  Switch,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ShopManagementScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [shopSettings, setShopSettings] = useState({
    isOpen: true,
    autoAcceptOrders: false,
    minimumOrderAmount: '50',
    maxOrdersPerDay: '50',
    deliveryRadius: '20',
    commission: '10',
  });

  const mockProducts = [
    {
      id: '1',
      name: 'iPhone 13 Pro',
      price: '1299.99',
      stock: 15,
      status: 'active',
    },
    {
      id: '2',
      name: 'MacBook Pro M1',
      price: '1999.99',
      stock: 8,
      status: 'active',
    },
  ];

  const mockOrders = [
    {
      id: 'ORD001',
      date: '2025-02-21',
      customer: 'Jean Dupont',
      amount: '1299.99',
      status: 'pending',
    },
    {
      id: 'ORD002',
      date: '2025-02-21',
      customer: 'Marie Martin',
      amount: '1999.99',
      status: 'completed',
    },
  ];

  const renderOverview = () => (
    <View style={styles.tabContent}>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>152</Text>
          <Text style={styles.statLabel}>Produits</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>47</Text>
          <Text style={styles.statLabel}>Commandes</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>4.8</Text>
          <Text style={styles.statLabel}>Note</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>12k€</Text>
          <Text style={styles.statLabel}>Revenus</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dernières Commandes</Text>
        {mockOrders.map(order => (
          <View key={order.id} style={styles.orderItem}>
            <View style={styles.orderHeader}>
              <Text style={styles.orderId}>{order.id}</Text>
              <Text style={[
                styles.orderStatus,
                { color: order.status === 'completed' ? '#34C759' : '#007AFF' }
              ]}>
                {order.status === 'completed' ? 'Terminée' : 'En attente'}
              </Text>
            </View>
            <Text style={styles.orderCustomer}>{order.customer}</Text>
            <Text style={styles.orderAmount}>{order.amount} €</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderProducts = () => (
    <View style={styles.tabContent}>
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => {/* Navigation vers l'ajout de produit */}}
      >
        <Ionicons name="add" size={24} color="#fff" />
        <Text style={styles.addButtonText}>Nouveau Produit</Text>
      </TouchableOpacity>

      {mockProducts.map(product => (
        <View key={product.id} style={styles.productItem}>
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productPrice}>{product.price} €</Text>
          </View>
          <View style={styles.productActions}>
            <Text style={styles.stockText}>Stock: {product.stock}</Text>
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="create-outline" size={20} color="#007AFF" />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );

  const renderSettings = () => (
    <View style={styles.tabContent}>
      <View style={styles.settingSection}>
        <Text style={styles.settingTitle}>Paramètres Généraux</Text>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Boutique ouverte</Text>
          <Switch
            value={shopSettings.isOpen}
            onValueChange={(value) => 
              setShopSettings({...shopSettings, isOpen: value})
            }
          />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Acceptation automatique</Text>
          <Switch
            value={shopSettings.autoAcceptOrders}
            onValueChange={(value) => 
              setShopSettings({...shopSettings, autoAcceptOrders: value})
            }
          />
        </View>
      </View>

      <View style={styles.settingSection}>
        <Text style={styles.settingTitle}>Paramètres de Commande</Text>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Montant minimum (€)</Text>
          <TextInput
            style={styles.settingInput}
            value={shopSettings.minimumOrderAmount}
            onChangeText={(text) => 
              setShopSettings({...shopSettings, minimumOrderAmount: text})
            }
            keyboardType="numeric"
          />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Commandes max/jour</Text>
          <TextInput
            style={styles.settingInput}
            value={shopSettings.maxOrdersPerDay}
            onChangeText={(text) => 
              setShopSettings({...shopSettings, maxOrdersPerDay: text})
            }
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={styles.settingSection}>
        <Text style={styles.settingTitle}>Paramètres de Livraison</Text>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Rayon de livraison (km)</Text>
          <TextInput
            style={styles.settingInput}
            value={shopSettings.deliveryRadius}
            onChangeText={(text) => 
              setShopSettings({...shopSettings, deliveryRadius: text})
            }
            keyboardType="numeric"
          />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Commission (%)</Text>
          <TextInput
            style={styles.settingInput}
            value={shopSettings.commission}
            onChangeText={(text) => 
              setShopSettings({...shopSettings, commission: text})
            }
            keyboardType="numeric"
          />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gestion de la Boutique</Text>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
          onPress={() => setActiveTab('overview')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'overview' && styles.activeTabText
          ]}>Aperçu</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'products' && styles.activeTab]}
          onPress={() => setActiveTab('products')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'products' && styles.activeTabText
          ]}>Produits</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'settings' && styles.activeTab]}
          onPress={() => setActiveTab('settings')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'settings' && styles.activeTabText
          ]}>Paramètres</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'products' && renderProducts()}
        {activeTab === 'settings' && renderSettings()}
      </ScrollView>
    </View>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    color: '#666',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    margin: '1%',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  orderItem: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  orderId: {
    fontWeight: '600',
  },
  orderStatus: {
    fontWeight: '500',
  },
  orderCustomer: {
    color: '#666',
    marginBottom: 4,
  },
  orderAmount: {
    fontWeight: '600',
    color: '#007AFF',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 25,
    padding: 12,
    marginBottom: 16,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  productItem: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  productInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
  },
  productPrice: {
    color: '#007AFF',
    fontWeight: '600',
  },
  productActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stockText: {
    color: '#666',
  },
  editButton: {
    padding: 4,
  },
  settingSection: {
    marginBottom: 24,
  },
  settingTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  settingInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 4,
    width: 80,
    textAlign: 'center',
  },
});

export default ShopManagementScreen;
