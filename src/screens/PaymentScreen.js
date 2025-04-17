import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStripe } from '@stripe/stripe-react-native';
import { useAuth } from '../contexts/AuthContext';
import paymentService from '../services/paymentService';

const PaymentScreen = ({ navigation }) => {
  const { user } = useAuth();
  const stripe = useStripe();
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState(null);

  useEffect(() => {
    paymentService.setStripe(stripe);
  }, [stripe]);

  useEffect(() => {
    const loadPaymentMethods = async () => {
      try {
        const methods = await paymentService.getPaymentMethods();
        setPaymentMethods(methods);
      } catch (error) {
        console.error('Error loading payment methods:', error);
        Alert.alert('Error', 'Failed to load payment methods');
      } finally {
        setLoading(false);
      }
    };

    loadPaymentMethods();
  }, []);

  const handleAddPaymentMethod = () => {
    navigation.navigate('AddPaymentMethod');
  };

  const handleRemovePaymentMethod = async (methodId) => {
    Alert.alert(
      'Confirmation',
      'Voulez-vous vraiment supprimer cette méthode de paiement ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await paymentService.removePaymentMethod(methodId);
              setPaymentMethods(prev =>
                prev.filter(method => method.id !== methodId)
              );
            } catch (error) {
              console.error('Erreur lors de la suppression:', error);
              Alert.alert('Erreur', 'Impossible de supprimer la méthode de paiement');
            }
          },
        },
      ]
    );
  };

  const handlePayment = async () => {
    if (!selectedMethod) {
      Alert.alert('Erreur', 'Veuillez sélectionner une méthode de paiement');
      return;
    }

    try {
      const amount = 1000; // 10€ par exemple
      const success = await paymentService.processPayment(amount);
      
      if (success) {
        navigation.goBack();
      }
    } catch (error) {
      console.error('Erreur lors du paiement:', error);
      Alert.alert('Erreur', 'Le paiement a échoué');
    }
  };

  const renderPaymentMethod = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.paymentMethod,
        selectedMethod?.id === item.id && styles.selectedMethod,
      ]}
      onPress={() => setSelectedMethod(item)}
    >
      <View style={styles.methodInfo}>
        <View style={styles.cardIcon}>
          {item.card_type === 'visa' ? (
            <Ionicons name="card" size={24} color="#1a1f71" />
          ) : item.card_type === 'mastercard' ? (
            <Ionicons name="card" size={24} color="#eb001b" />
          ) : (
            <Ionicons name="card-outline" size={24} color="#000" />
          )}
        </View>
        <View>
          <Text style={styles.cardType}>
            {item.card_type.charAt(0).toUpperCase() + item.card_type.slice(1)}
          </Text>
          <Text style={styles.cardNumber}>**** **** **** {item.last_four}</Text>
          <Text style={styles.expiryDate}>
            Expire {item.expiry_month}/{item.expiry_year}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleRemovePaymentMethod(item.id)}
      >
        <Ionicons name="trash-outline" size={24} color="#FF3B30" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Méthodes de paiement</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddPaymentMethod}
        >
          <Ionicons name="add" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#007AFF" />
      ) : paymentMethods.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="card-outline" size={48} color="#999" />
          <Text style={styles.emptyStateText}>
            Aucune méthode de paiement enregistrée
          </Text>
          <TouchableOpacity
            style={styles.addFirstButton}
            onPress={handleAddPaymentMethod}
          >
            <Text style={styles.addFirstButtonText}>
              Ajouter une méthode de paiement
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={paymentMethods}
          renderItem={renderPaymentMethod}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
        />
      )}

      {paymentMethods.length > 0 && (
        <TouchableOpacity
          style={[
            styles.payButton,
            !selectedMethod && styles.payButtonDisabled,
          ]}
          onPress={handlePayment}
          disabled={!selectedMethod}
        >
          <Text style={styles.payButtonText}>Payer</Text>
        </TouchableOpacity>
      )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    padding: 8,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  emptyStateText: {
    marginTop: 10,
    marginBottom: 20,
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  addFirstButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addFirstButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  list: {
    padding: 15,
  },
  paymentMethod: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  selectedMethod: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
    borderWidth: 1,
  },
  methodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardType: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardNumber: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  expiryDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  deleteButton: {
    padding: 8,
  },
  payButton: {
    backgroundColor: '#007AFF',
    margin: 15,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  payButtonDisabled: {
    backgroundColor: '#ccc',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PaymentScreen;
