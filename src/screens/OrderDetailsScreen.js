import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const OrderDetailsScreen = ({ navigation, route }) => {
  const { orderId } = route.params;

  // Données de test
  const order = {
    id: orderId,
    date: '2025-02-24',
    status: 'delivered',
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
    shipping: {
      address: '123 Rue de la Paix',
      city: 'Paris',
      postalCode: '75000',
      country: 'France',
      tracking: 'LP00123456789',
      carrier: 'La Poste',
    },
    payment: {
      method: 'Carte bancaire',
      last4: '4242',
      subtotal: 499.99,
      shipping: 0,
      tax: 0,
      total: 499.99,
    },
  };

  const renderStatusBar = () => {
    const statuses = [
      { key: 'pending', label: 'Commande', icon: 'cart-outline' },
      { key: 'confirmed', label: 'Confirmation', icon: 'checkmark-circle-outline' },
      { key: 'shipped', label: 'Expédition', icon: 'airplane-outline' },
      { key: 'delivered', label: 'Livraison', icon: 'home-outline' },
    ];

    const currentStatusIndex = statuses.findIndex(s => s.key === order.status);

    return (
      <View style={styles.statusBar}>
        {statuses.map((status, index) => (
          <React.Fragment key={status.key}>
            <View style={styles.statusItem}>
              <View style={[
                styles.statusIcon,
                index <= currentStatusIndex && styles.statusIconActive,
              ]}>
                <Ionicons
                  name={status.icon}
                  size={20}
                  color={index <= currentStatusIndex ? '#fff' : '#666'}
                />
              </View>
              <Text style={[
                styles.statusLabel,
                index <= currentStatusIndex && styles.statusLabelActive,
              ]}>
                {status.label}
              </Text>
            </View>
            {index < statuses.length - 1 && (
              <View style={[
                styles.statusLine,
                index < currentStatusIndex && styles.statusLineActive,
              ]} />
            )}
          </React.Fragment>
        ))}
      </View>
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
        <Text style={styles.title}>Détails de la commande</Text>
        <TouchableOpacity
          style={styles.helpButton}
          onPress={() => navigation.navigate('CustomerService', { orderId })}
        >
          <Ionicons name="help-circle-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statut de la commande</Text>
          {renderStatusBar()}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Articles</Text>
          {order.items.map(item => (
            <View key={item.id} style={styles.productItem}>
              <Image
                source={{ uri: item.image }}
                style={styles.productImage}
                resizeMode="cover"
              />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productQuantity}>Quantité: {item.quantity}</Text>
                <Text style={styles.productPrice}>{item.price}€</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Livraison</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={20} color="#666" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Adresse de livraison</Text>
                <Text style={styles.infoText}>{order.shipping.address}</Text>
                <Text style={styles.infoText}>
                  {order.shipping.postalCode} {order.shipping.city}
                </Text>
                <Text style={styles.infoText}>{order.shipping.country}</Text>
              </View>
            </View>
            {order.shipping.tracking && (
              <View style={styles.infoRow}>
                <Ionicons name="airplane-outline" size={20} color="#666" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Suivi</Text>
                  <Text style={styles.infoText}>
                    {order.shipping.carrier} - {order.shipping.tracking}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Paiement</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="card-outline" size={20} color="#666" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Méthode de paiement</Text>
                <Text style={styles.infoText}>
                  {order.payment.method} (**** {order.payment.last4})
                </Text>
              </View>
            </View>
            <View style={styles.paymentSummary}>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Sous-total</Text>
                <Text style={styles.paymentValue}>{order.payment.subtotal}€</Text>
              </View>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Livraison</Text>
                <Text style={styles.paymentValue}>{order.payment.shipping}€</Text>
              </View>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>TVA</Text>
                <Text style={styles.paymentValue}>{order.payment.tax}€</Text>
              </View>
              <View style={[styles.paymentRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>{order.payment.total}€</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.supportButton}
          onPress={() => navigation.navigate('MarketChat', {
            orderId: order.id,
            mode: 'support',
          })}
        >
          <Ionicons name="chatbubble-outline" size={20} color="#fff" />
          <Text style={styles.supportButtonText}>Contacter le support</Text>
        </TouchableOpacity>
      </View>
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
  helpButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  statusItem: {
    alignItems: 'center',
    gap: 8,
  },
  statusIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusIconActive: {
    backgroundColor: '#4CAF50',
  },
  statusLabel: {
    fontSize: 12,
    color: '#666',
  },
  statusLabelActive: {
    color: '#4CAF50',
    fontWeight: '500',
  },
  statusLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#f5f5f5',
    marginHorizontal: 8,
  },
  statusLineActive: {
    backgroundColor: '#4CAF50',
  },
  productItem: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 12,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  productQuantity: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  infoCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
  },
  paymentSummary: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  paymentLabel: {
    fontSize: 14,
    color: '#666',
  },
  paymentValue: {
    fontSize: 14,
    color: '#333',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    height: 48,
    borderRadius: 24,
    gap: 8,
  },
  supportButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default OrderDetailsScreen;
