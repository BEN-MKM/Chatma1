import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const DeliveryScreen = ({ navigation }) => {
  const [deliveryOptions, setDeliveryOptions] = useState({
    standardDelivery: true,
    expressDelivery: false,
    pickupPoint: true,
    homeDelivery: true,
  });

  const [notifications, setNotifications] = useState(true);

  const deliveryMethods = [
    {
      id: 'standardDelivery',
      title: 'Livraison standard',
      description: '3-5 jours ouvrables',
      price: '2.99€',
      icon: 'bicycle-outline',
    },
    {
      id: 'expressDelivery',
      title: 'Livraison express',
      description: '24h ouvrées',
      price: '5.99€',
      icon: 'rocket-outline',
    },
    {
      id: 'pickupPoint',
      title: 'Point relais',
      description: '3-5 jours ouvrables',
      price: '1.99€',
      icon: 'location-outline',
    },
    {
      id: 'homeDelivery',
      title: 'Livraison à domicile',
      description: '2-4 jours ouvrables',
      price: '3.99€',
      icon: 'home-outline',
    },
  ];

  const toggleDeliveryOption = (id) => {
    setDeliveryOptions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Options de livraison</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Méthodes de livraison</Text>
          {deliveryMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={styles.deliveryOption}
              onPress={() => toggleDeliveryOption(method.id)}
            >
              <View style={styles.deliveryOptionLeft}>
                <View style={styles.iconContainer}>
                  <Ionicons name={method.icon} size={24} color="#4CAF50" />
                </View>
                <View style={styles.deliveryOptionInfo}>
                  <Text style={styles.deliveryOptionTitle}>{method.title}</Text>
                  <Text style={styles.deliveryOptionDescription}>
                    {method.description}
                  </Text>
                </View>
              </View>
              <View style={styles.deliveryOptionRight}>
                <Text style={styles.deliveryOptionPrice}>{method.price}</Text>
                <Switch
                  value={deliveryOptions[method.id]}
                  onValueChange={() => toggleDeliveryOption(method.id)}
                  trackColor={{ false: '#ddd', true: '#4CAF50' }}
                  thumbColor="#fff"
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Préférences</Text>
          <View style={styles.preferenceItem}>
            <Text style={styles.preferenceTitle}>Notifications de livraison</Text>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#ddd', true: '#4CAF50' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations importantes</Text>
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={24} color="#2196F3" />
            <Text style={styles.infoText}>
              Les délais de livraison sont donnés à titre indicatif et peuvent varier
              selon la disponibilité des transporteurs et votre localisation.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.saveButtonText}>Enregistrer les préférences</Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  deliveryOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  deliveryOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  deliveryOptionInfo: {
    flex: 1,
  },
  deliveryOptionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  deliveryOptionDescription: {
    fontSize: 14,
    color: '#666',
  },
  deliveryOptionRight: {
    alignItems: 'flex-end',
  },
  deliveryOptionPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 4,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  preferenceTitle: {
    fontSize: 16,
    color: '#333',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  footer: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DeliveryScreen;
