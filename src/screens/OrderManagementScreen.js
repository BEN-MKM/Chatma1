import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const OrderManagementScreen = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingNumber, setTrackingNumber] = useState('');

  const [orders] = useState([
    {
      id: 'CMD001',
      customer: {
        name: 'Sophie Martin',
        email: 'sophie@example.com',
        phone: '+33 6 12 34 56 78',
        address: '123 Rue de Paris, 75001 Paris',
      },
      date: '2025-02-14',
      status: 'pending',
      total: 599.99,
      items: [
        {
          id: '1',
          name: 'Smartphone 5G',
          quantity: 1,
          price: 499.99,
          options: 'Noir, 128GB',
        },
        {
          id: '2',
          name: 'Coque de protection',
          quantity: 2,
          price: 49.99,
          options: 'Transparente',
        },
      ],
      shipping: {
        method: 'Express',
        cost: 9.99,
        tracking: '',
      },
      payment: {
        method: 'Carte bancaire',
        status: 'completed',
        transaction: 'TRX123456',
      },
    },
    // Plus de commandes...
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#4CAF50';
      case 'pending':
        return '#FFC107';
      case 'cancelled':
        return '#FF4D4F';
      default:
        return '#666';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Terminée';
      case 'pending':
        return 'En attente';
      case 'cancelled':
        return 'Annulée';
      default:
        return status;
    }
  };

  const renderFilters = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.filtersContainer}
    >
      <TouchableOpacity
        style={[
          styles.filterButton,
          selectedFilter === 'all' && styles.filterButtonActive,
        ]}
        onPress={() => setSelectedFilter('all')}
      >
        <Text style={styles.filterText}>Toutes</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.filterButton,
          selectedFilter === 'pending' && styles.filterButtonActive,
        ]}
        onPress={() => setSelectedFilter('pending')}
      >
        <Text style={styles.filterText}>En attente</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.filterButton,
          selectedFilter === 'completed' && styles.filterButtonActive,
        ]}
        onPress={() => setSelectedFilter('completed')}
      >
        <Text style={styles.filterText}>Terminées</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.filterButton,
          selectedFilter === 'cancelled' && styles.filterButtonActive,
        ]}
        onPress={() => setSelectedFilter('cancelled')}
      >
        <Text style={styles.filterText}>Annulées</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderOrderCard = (order) => (
    <TouchableOpacity
      key={order.id}
      style={styles.orderCard}
      onPress={() => {
        setSelectedOrder(order);
        setShowDetailsModal(true);
      }}
    >
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderId}>Commande #{order.id}</Text>
          <Text style={styles.orderDate}>{order.date}</Text>
        </View>
        <View style={[
          styles.statusBadge,
          { backgroundColor: getStatusColor(order.status) }
        ]}>
          <Text style={styles.statusText}>
            {getStatusText(order.status)}
          </Text>
        </View>
      </View>
      <View style={styles.orderInfo}>
        <View style={styles.infoRow}>
          <Ionicons name="person" size={16} color="#666" />
          <Text style={styles.infoText}>{order.customer.name}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="cart" size={16} color="#666" />
          <Text style={styles.infoText}>
            {order.items.length} article{order.items.length > 1 ? 's' : ''}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="cash" size={16} color="#666" />
          <Text style={styles.infoText}>{order.total.toFixed(2)} €</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderDetailsModal = () => (
    <Modal
      visible={showDetailsModal}
      transparent={true}
      animationType="slide"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              Détails de la commande #{selectedOrder?.id}
            </Text>
            <TouchableOpacity onPress={() => setShowDetailsModal(false)}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalScroll}>
            {/* Informations client */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Client</Text>
              <View style={styles.customerInfo}>
                <Text style={styles.customerName}>{selectedOrder?.customer.name}</Text>
                <Text style={styles.customerDetail}>{selectedOrder?.customer.email}</Text>
                <Text style={styles.customerDetail}>{selectedOrder?.customer.phone}</Text>
                <Text style={styles.customerDetail}>{selectedOrder?.customer.address}</Text>
              </View>
            </View>

            {/* Articles */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Articles</Text>
              {selectedOrder?.items.map(item => (
                <View key={item.id} style={styles.itemRow}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemOptions}>{item.options}</Text>
                  </View>
                  <View style={styles.itemPricing}>
                    <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                    <Text style={styles.itemPrice}>{item.price.toFixed(2)} €</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Livraison */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Livraison</Text>
              <View style={styles.shippingInfo}>
                <Text style={styles.shippingMethod}>
                  {selectedOrder?.shipping.method}
                </Text>
                <Text style={styles.shippingCost}>
                  {selectedOrder?.shipping.cost.toFixed(2)} €
                </Text>
                {selectedOrder?.shipping.tracking ? (
                  <Text style={styles.trackingNumber}>
                    Numéro de suivi: {selectedOrder.shipping.tracking}
                  </Text>
                ) : (
                  <View style={styles.trackingInput}>
                    <TextInput
                      placeholder="Ajouter un numéro de suivi"
                      value={trackingNumber}
                      onChangeText={setTrackingNumber}
                      style={styles.input}
                    />
                    <TouchableOpacity style={styles.addTrackingButton}>
                      <Text style={styles.addTrackingText}>Ajouter</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>

            {/* Paiement */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Paiement</Text>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentMethod}>
                  {selectedOrder?.payment.method}
                </Text>
                <Text style={styles.paymentStatus}>
                  {selectedOrder?.payment.status === 'completed' ? 'Payé' : 'En attente'}
                </Text>
                <Text style={styles.transactionId}>
                  Transaction: {selectedOrder?.payment.transaction}
                </Text>
              </View>
            </View>

            {/* Total */}
            <View style={styles.totalSection}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Sous-total</Text>
                <Text style={styles.totalValue}>
                  {(selectedOrder?.total - selectedOrder?.shipping.cost).toFixed(2)} €
                </Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Livraison</Text>
                <Text style={styles.totalValue}>
                  {selectedOrder?.shipping.cost.toFixed(2)} €
                </Text>
              </View>
              <View style={[styles.totalRow, styles.finalTotal]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>
                  {selectedOrder?.total.toFixed(2)} €
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Actions */}
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => setShowDetailsModal(false)}
            >
              <Text style={styles.actionButtonText}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.confirmButton]}
              onPress={() => {
                // Logique de confirmation
                setShowDetailsModal(false);
              }}
            >
              <Text style={styles.actionButtonText}>Confirmer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Commandes</Text>
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>125</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>En attente</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>98%</Text>
            <Text style={styles.statLabel}>Satisfaction</Text>
          </View>
        </View>
      </View>
      {renderFilters()}
      <ScrollView style={styles.ordersList}>
        {orders
          .filter(order => selectedFilter === 'all' || order.status === selectedFilter)
          .map(order => renderOrderCard(order))}
      </ScrollView>
      {renderDetailsModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF4D4F',
  },
  statLabel: {
    color: '#666',
    marginTop: 5,
  },
  filtersContainer: {
    backgroundColor: '#fff',
    padding: 15,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  filterButtonActive: {
    backgroundColor: '#FF4D4F',
  },
  filterText: {
    color: '#666',
  },
  ordersList: {
    padding: 15,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderDate: {
    color: '#666',
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
  },
  orderInfo: {
    marginTop: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  infoText: {
    marginLeft: 10,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalScroll: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  customerInfo: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
  },
  customerName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  customerDetail: {
    color: '#666',
    marginBottom: 5,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontWeight: 'bold',
  },
  itemOptions: {
    color: '#666',
    fontSize: 12,
    marginTop: 5,
  },
  itemPricing: {
    alignItems: 'flex-end',
  },
  itemQuantity: {
    color: '#666',
  },
  itemPrice: {
    fontWeight: 'bold',
    marginTop: 5,
  },
  shippingInfo: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
  },
  trackingInput: {
    flexDirection: 'row',
    marginTop: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  addTrackingButton: {
    backgroundColor: '#FF4D4F',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
  },
  addTrackingText: {
    color: '#fff',
  },
  paymentInfo: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
  },
  totalSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  finalTotal: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalLabel: {
    fontWeight: 'bold',
  },
  totalValue: {
    fontWeight: 'bold',
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actionButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  confirmButton: {
    backgroundColor: '#FF4D4F',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default OrderManagementScreen;
